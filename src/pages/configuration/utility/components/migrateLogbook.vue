<template>
  <q-card class="my-card bg-deep-purple-1">
    <q-card-section>
      <div class="text-h6">Migrate ข้อมูล Logbook</div>
    </q-card-section>

    <q-card-section>
      ทำการ migrate ข้อมูล logbook
      เพื่อ import เข้า meritbook
      และจะใช้เป็น documents หลักต่อไป
    </q-card-section>

    <q-separator dark />

    <q-card-actions vertical>
      <q-btn
        flat
        @click="migrateLogbook()"
      >
        ดำเนินการ
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { db } from 'src/boot/firebase.js'

export default {
  emits: ['updateLog', 'playSound'],

  setup (props, context) {
    async function migrateLogbook () {
      context.emit('playSound')

      // function
      function migrateToMeritBook (logbookDocs, user) {
        return new Promise((resolve, reject) => {
          const lobbookDocs = logbookDocs.empty ? [] : logbookDocs.docs.map(doc => doc.data())
          const batch = db.batch()
          lobbookDocs.forEach(eachLog => {
            const newDoc = db.collection('meritBook').doc()
            batch.set(
              db.collection('meritBook').doc(newDoc.id),
              {
                action: eachLog.action,
                createdOn: eachLog.createdOn,
                document: eachLog.details,
                userID: user.uid,
                userName: `${user.firstName} ${user.lastName}`
              }
            )
          })
          batch.commit().then(() => {
            resolve()
          })
        })
      }

      // process
      // get users
      const docs = await db.collection('user').get()
      const userDocs = docs.empty ? [] : docs.docs.map(doc => doc.data())

      // for each user
      for (const user of userDocs) {
        let accumulate = 0
        const userName = `${user.firstName} ${user.lastName}`
        context.emit('updateLog', userName)
        const first = await db.collection('logbook')
          .where('userName', '==', userName)
          .orderBy('createdOn')
          .limit(500)
          .get()
        context.emit('updateLog', `first: ${first.size}`)
        accumulate = accumulate + first.size

        await migrateToMeritBook(first, user)

        if (first.size) {
          let last = first.docs[first.docs.length - 1]

          while (true) {
            const next = await db.collection('logbook')
              .where('userName', '==', userName)
              .orderBy('createdOn')
              .startAfter(last.data().createdOn)
              .limit(500)
              .get()
            await migrateToMeritBook(next, user)
            if (next.size) {
              accumulate = accumulate + next.size
              context.emit('updateLog', `accumulate: ${accumulate}`)
              last = next.docs[next.docs.length - 1]
            } else {
              context.emit('updateLog', `break at: ${accumulate}`)
              context.emit('updateLog', '=======================')
              break
            }
          }
        }
      }
    }

    return {
      migrateLogbook
    }
  }
}
</script>
