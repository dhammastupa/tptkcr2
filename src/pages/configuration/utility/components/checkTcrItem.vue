<template>
  <q-card class="my-card bg-deep-purple-1">
    <q-card-section>
      <div class="text-h6">ตรวจสอบ TCR ITEM</div>
    </q-card-section>

    <q-card-section>
      ทำการตรวจสอบข้อมูล TCR ITEM
      เพื่อตรวจสอบข้อมูลเนื้อหาที่ไม่มี หัวเรื่อง
    </q-card-section>

    <q-separator dark />

    <div class="q-pa-md">
      <q-select
        v-model="tcrSet"
        :options="tcrSetOption"
        label="tcrSet"
        emit-value
        map-options
      />
    </div>

    <q-card-actions vertical>
      <q-btn
        flat
        @click="checkTcrItem()"
      >ดำเนินการ</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { db } from 'src/boot/firebase.js'
import { ref } from 'vue'
import { getPromiseDocs, updateDoc } from 'src/functions/manage-data'

export default {
  emits: ['updateLog', 'playSound'],

  setup (props, context) {
    // variables
    const tcrSet = ref('')
    const tcrSetOption = ref([])

    getPromiseDocs(
      db.collection('tcrSet').orderBy('sequence')
    ).then(myObject => {
      myObject.forEach(i => {
        tcrSetOption.value.push({
          value: i.docId,
          label: i.name
        })
      })
    })

    // functions
    async function checkTcrItem () {
      context.emit('playSound')
      function childTree (parentId) {
        getPromiseDocs(db.collection('tcrItem')
          .where('tcrSetId', '==', tcrSet.value)
          .where('parent', '==', parentId)
          .orderBy('sequence', 'asc')
        ).then(i => {
          i.forEach(async e => {
            console.log(e.label)
            await updateDoc(db.collection('tcrItem').doc(e.docId), { flag: true })
            childTree(e.docId)
          })
        })
      }
      childTree('')
    }

    return {
      tcrSet,
      tcrSetOption,
      checkTcrItem
    }
  }
}
</script>
