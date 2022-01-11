<template>
  <q-card class="my-card bg-deep-purple-1">
    <q-card-section>
      <div class="text-h6">รีเซ็ตข้อมูล WordList</div>
    </q-card-section>

    <q-card-section>
      ทำการสร้าง WordList ขึ้นใหม่
      โดยทำการแก้ไขปรับเอา WordList ว่าง ออก
      และปรับเอาเครื่องหมาย [] รวมถึงเลขข้อออก
    </q-card-section>

    <q-separator dark />

    <div class="q-pa-md">
      <q-select v-model="tipitakaEdition" :options="tipitakaEditionOption" label="edition" />
      <q-select v-model="volumeNumber" :options="volumeNumberOption" label="volume" />
    </div>

    <q-card-actions vertical>
      <q-btn
        flat
        @click="wordListDataRepair()"
      >ดำเนินการ</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import { db } from 'src/boot/firebase.js'
import { without, split, join, chunk } from 'lodash'
import { format } from 'quasar'

const { pad } = format

export default {
  emits: ['updateLog', 'playSound'],

  setup (props, context) {
    // =============================
    // WordList Data Repair
    // =============================

    // variables
    const tipitakaEdition = ref('sya')
    const volumeNumber = ref('1')

    const tipitakaEditionOption = ref(['sya', 'mcu'])
    const volumeNumberOption = ref([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
      '41', '42', '43', '44', '45'
    ])

    // function wordListDataRepair
    async function wordListDataRepair () {
      context.emit('playSound')
      // get proofread from tipitaka
      const proofread = await db.collection('tipitaka')
        .where('tipitakaEdition', '==', tipitakaEdition.value)
        .where('volumeNumber', '==', volumeNumber.value)
        .where('proofread', '==', true)
        .orderBy('pageNumber')
        .get()
      // main process
      context.emit('updateLog', `Get all proofread: ${proofread.size} docs`)
      // 1: delete WordList
      for (const prDoc of proofread.docs) {
        const WordList = await db.collection('wordList')
          .where('tipitakaRecordId', '==', prDoc.id)
          .get()
        // let chunckNum = 0
        const wlDocChunks = chunk(WordList.docs, 500)
        for (const wlDocs of wlDocChunks) {
          // chunckNum++
          // console.log('wl chunck : ' + chunckNum)
          const batchDelete = db.batch()
          for (const wlDoc of wlDocs) {
            batchDelete.delete(db.collection('wordList').doc(wlDoc.docId))
          }
          await batchDelete.commit()
          context.emit('updateLog', `Remove WordList / V.${prDoc.data().volumeNumber} P.${prDoc.data().pageNumber}`)
        }
        // 2.0: prepare text
        const textTrimmed = prDoc.data().text.replace(/^\s*$(?:\r\n?|\n)/gm, '')
        const splitLines = without(split(textTrimmed, '\n'), '')
        const removeExtraSpaceArray = []
        splitLines.forEach(eachLine => {
          removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
        })
        const text = join(removeExtraSpaceArray, '\n')
        // 2.1: update clean text
        await db.collection('tipitaka').doc(prDoc.id)
          .update({ text: text })
        context.emit('updateLog', `Clean & Updated Text / V.${prDoc.data().volumeNumber} P.${prDoc.data().pageNumber}`)
        // 3: create WordList
        const batchCreate = db.batch()
        const lines = text.split('\n')
        let wordNumber = 0
        let lineNumber = 0
        let reference = []
        lines.forEach(line => {
          lineNumber++
          const words = line.split(' ')
          // for each word
          words.forEach(word => {
            const newDoc = db.collection('wordList').doc()
            switch (word.charAt(0)) {
              case ('[' || ']' || '๑' || '๒' || '๓' || '๔' || '๕' || '๖' || '๗' || '๘' || '๙' || '๐'):
                reference.push(word)
                break
              default:
                wordNumber++
                batchCreate.set(
                  db.collection('wordList').doc(newDoc.id), {
                    docId: newDoc.id,
                    word: word,
                    lineNumber: lineNumber,
                    wordNumber: wordNumber,
                    // reference
                    // tipitakaReference: db.collection('tipitaka').doc(`${prDoc.docId}`),
                    tipitakaRecordId: prDoc.id,
                    tipitakaEdition: prDoc.data().tipitakaEdition,
                    volumeNumber: prDoc.data().volumeNumber,
                    pageNumber: prDoc.data().pageNumber,
                    imageReference: prDoc.data().imageReference,
                    wordIndex: `${'sya'}-${pad(prDoc.data().volumeNumber, 3)}-${pad(prDoc.data().pageNumber, 4)}-${pad(wordNumber, 3)}`,
                    reference: reference
                  }
                )
                reference = []
                break
            }
          })
        })
        await batchCreate.commit()
        context.emit('updateLog', `Create WordList / V.${prDoc.data().volumeNumber} P. ${prDoc.data().pageNumber}`)
        context.emit('updateLog', '=======================')
      }

      context.emit('updateLog', 'finish')
      context.emit('playSound')
    }

    return {
      // public variables
      tipitakaEdition,
      volumeNumber,
      tipitakaEditionOption,
      volumeNumberOption,
      wordListDataRepair
    }
  }
}
</script>
