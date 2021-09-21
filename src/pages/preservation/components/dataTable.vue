<template>
  <div>
    <q-table
      row-key="id"
      :grid="$q.screen.xs"
      :title="$t($options.name)"
      :rows="datatable.rows"
      :columns="datatable.columns"
      :filter="datatable.filter"
      :pagination="datatable.pagination"
      :loading="datatable.loading"
      @row-click="selectedRow"
    >
      <template v-slot:top-right>
        <q-input borderless
          dense debounce="300"
          v-model="datatable.filter"
          :placeholder="$t('system.search')">
          <template v-slot:append>

            <!-- search -->
            <q-icon name="search" />

            <!-- add -->
            <q-btn
              color="white"
              text-color="primary"
              round
              icon="add"
              class="q-ma-md"
              @click="createData"
            >
              <q-tooltip>
                {{ $t('pageTipitakaPreservation.createPage') }}
              </q-tooltip>
            </q-btn>

            <!-- fix empty word -->
            <q-btn
              v-if="useHasPermission('utility')"
              color="purple"
              text-color="white"
              round
              icon="home_repair_service"
              @click="dataRepairServices"
            >
              <q-tooltip>
                {{ $t('pageTipitakaPreservation.dataRepairService') }}
              </q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { db } from 'src/boot/firebase.js'
import { useLiveData, getPromiseDocs, getDoc, updateDoc } from 'src/functions/manage-data.js'
import { useI18n } from 'vue-i18n'
import useHasPermission from 'src/hooks/has-permission.js'
// import { isEmpty, without, split, join } from 'lodash'
import { without, split, join } from 'lodash'
import { format } from 'quasar'

const { pad } = format

export default {
  name: 'mainNavigation.tipitakaPreservation',

  setup () {
    // composable
    const $t = useI18n().t
    const $store = useStore()

    // ---------
    // variables
    // ---------
    const collection = db.collection('tipitaka')

    // getters selection
    const selection = computed(() => { return $store.getters['preservation/getSelection'] })

    // getters variable
    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    // route
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // tipitakaEditionID
    const tipitakaEditionID = computed(() => {
      return route.value.params.id
    })

    const volume = computed(() => {
      return variables.value.volume
    })

    const pageRange = computed(() => {
      return variables.value.pageRange
    })

    // datatable
    const datatable = reactive({
      filter: '',
      rows: [],
      columns: [
        {
          name: 'pageNumber',
          field: 'pageNumber',
          label: $t('pageTipitakaPreservation.pageNumber'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'text',
          field: 'text',
          label: $t('pageTipitakaPreservation.text'),
          sortable: true,
          align: 'left',
          classes: 'bg-blue-grey-1 ellipsis',
          style: 'max-width: 250px',
          headerStyle: 'max-width: 250px'
        },
        {
          name: 'proofread',
          field: 'proofread',
          format: val => (val === true) ? '✓' : '',
          label: $t('pageTipitakaPreservation.proofread'),
          sortable: false,
          align: 'center'
        }
      ],
      pagination: {
        sortBy: 'pageNumber',
        descending: false,
        rowsPerPage: 20
      },
      loading: false
    })

    // -----------------------------------------
    // function get datatable rows from databaes
    // -----------------------------------------
    function getRows () {
      datatable.loading = true
      datatable.rows = useLiveData(
        collection
          .where('tipitakaEdition', '==', tipitakaEditionID.value)
          .where('volumeNumber', '==', variables.value.volume)
          .where('pageNumber', '>=', variables.value.pageRange.min)
          .where('pageNumber', '<=', variables.value.pageRange.max)
          .orderBy('pageNumber', 'asc'))
      setTimeout(function () { datatable.loading = false }, 1000)
    }
    getRows()

    // watch
    watch(datatable, function () {
      $store.commit(
        'preservation/setQuerySnapshot',
        datatable.rows
      )
    })

    watch(tipitakaEditionID, function () {
      if (tipitakaEditionID.value) {
        getRows()
      }
    })

    watch([volume, pageRange], function () {
      getRows()
    })

    // --------------------------
    // function create new record
    // --------------------------
    function createData () {
      $store.commit(
        'preservation/setCreateForm',
        {
          active: true
        }
      )
    }

    // --------------------------
    // function selectedRow
    // --------------------------
    function selectedRow (evt, row) {
      $store.commit(
        'preservation/setSelectedRow',
        row
      )
      $store.commit(
        'preservation/setDataForm',
        {
          active: true
        })
      $store.dispatch(
        'preservation/getImageUrl'
      )
    }

    // function dataRepairServices
    async function dataRepairServices () {
      // -----------------
      // get all proofread
      // -----------------
      const proofreadDoc = await getPromiseDocs(
        db.collection('tipitaka')
          .where('tipitakaEdition', '==', variables.value.tipitakaEdition.code)
          .where('volumeNumber', '==', variables.value.volume)
          .where('proofread', '==', true)
      )
      // log 1
      console.log('1: get all proofread in volume', proofreadDoc.length, 'docs')

      proofreadDoc.forEach(async doc => {
        // -----------------
        // get tipitaka page
        // -----------------
        const tipitakaPage = await getDoc(
          db.collection('tipitaka'), doc.id
        )
        // log 2
        console.log('2: get tipitaka page')

        // ----------
        // clean text
        // ----------
        const textTrimmed = tipitakaPage.text.replace(/^\s*$(?:\r\n?|\n)/gm, '')
        const splitLines = without(split(textTrimmed, '\n'), '')
        const removeExtraSpaceArray = []
        splitLines.forEach(eachLine => {
          removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
        })
        const text = join(removeExtraSpaceArray, '\n')
        await updateDoc(db.collection('tipitaka').doc(doc.id), { text: text })
        // log 3
        console.log('5: clean text & update')

        // ------------
        // add wordlist
        // ------------
        const batch2 = db.batch()
        const lines = text.split('\n')
        let lineNumber = 0
        let wordNumber = 0
        lines.forEach(line => {
          lineNumber++
          const words = line.split(' ')
          words.forEach(word => {
            wordNumber++
            const newDoc = db.collection('wordlist').doc()
            batch2.set(
              db.collection('wordlist').doc(newDoc.id), {
                id: newDoc.id,
                word: word,
                lineNumber: lineNumber,
                wordNumber: wordNumber,
                // reference
                tipitakaReference: db.collection('tipitaka').doc(`${doc.id}`),
                tipitakaRecordId: doc.id,
                tipitakaEdition: variables.value.tipitakaEdition.code,
                volumeNumber: variables.value.volume,
                pageNumber: doc.pageNumber,
                imageReference: doc.imageReference,
                wordIndex: `${variables.value.tipitakaEdition.code}-${pad(variables.value.volume, 3)}-${pad(doc.pageNumber, 4)}-${pad(wordNumber, 3)}`
              }
            )
          })
        })
        await batch2.commit().then(() => {
          // log 4
          console.log('4: commited fixed wordlist')
        })
      })
    }

    // async function dataRepairServicesBackup () {
    //   while (true) {
    //     const emptyWord = await getPromiseDocs(
    //       db.collection('wordlist')
    //         .where('tipitakaEdition', '==', variables.value.tipitakaEdition.code)
    //         // .where('volumeNumber', '==', variables.value.volume)
    //         .where('word', '==', '')
    //         .limit(1)
    //     )
    //     if (!isEmpty(emptyWord)) {
    //       // log
    //       console.log('1: get empty word record')
    //       const tipitakaRecordId = emptyWord[0].tipitakaRecordId
    //       const pageNumber = emptyWord[0].pageNumber
    //       const imageReference = emptyWord[0].imageReference
    //       // remove wordlist
    //       const removeWordlist = await getPromiseDocs(
    //         db.collection('wordlist')
    //           .where('tipitakaRecordId', '==', tipitakaRecordId)
    //       )
    //       // log
    //       console.log('2: get wordlist to delete')
    //       const batch1 = db.batch()
    //       removeWordlist.forEach((doc) => {
    //         batch1.delete(db.collection('wordlist').doc(doc.id))
    //       })
    //       await batch1.commit().then(() => {
    //         // ---
    //         // log
    //         console.log('3: commit remove wordlist')
    //         // ---
    //       })
    //       const tipitakaPage = await getDoc(
    //         db.collection('tipitaka'), tipitakaRecordId
    //       )
    //       // ---
    //       // log
    //       console.log('4: get tipitaka page record')
    //       // ---
    //       const textTrimmed = tipitakaPage.text.replace(/^\s*$(?:\r\n?|\n)/gm, '')
    //       const splitLines = without(split(textTrimmed, '\n'), '')
    //       const removeExtraSpaceArray = []
    //       splitLines.forEach(eachLine => {
    //         removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
    //       })
    //       const text = join(removeExtraSpaceArray, '\n')
    //       await updateDoc(db.collection('tipitaka').doc(tipitakaRecordId), { text: text })
    //       // ---
    //       // log
    //       console.log('5: update clean text')
    //       // ---
    //       // add wordlist
    //       const batch2 = db.batch()
    //       const lines = text.split('\n')
    //       let lineNumber = 0
    //       let wordNumber = 0
    //       lines.forEach(line => {
    //         lineNumber++
    //         const words = line.split(' ')
    //         words.forEach(word => {
    //           wordNumber++
    //           const newDoc = db.collection('wordlist').doc()
    //           batch2.set(
    //             db.collection('wordlist').doc(newDoc.id), {
    //               id: newDoc.id,
    //               word: word,
    //               lineNumber: lineNumber,
    //               wordNumber: wordNumber,
    //               // reference
    //               tipitakaReference: db.collection('tipitaka').doc(`${tipitakaRecordId}`),
    //               tipitakaRecordId: tipitakaRecordId,
    //               tipitakaEdition: variables.value.tipitakaEdition.code,
    //               volumeNumber: variables.value.volume,
    //               pageNumber: pageNumber,
    //               imageReference: imageReference,
    //               wordIndex: `${variables.value.tipitakaEdition.code}-${pad(variables.value.volume, 3)}-${pad(pageNumber, 4)}-${pad(wordNumber, 3)}`
    //             }
    //           )
    //         })
    //       })
    //       await batch2.commit().then(() => {
    //         // ---
    //         // log
    //         console.log('6: commited fixed wordlist')
    //         // ---
    //       })
    //     } else {
    //       // ---
    //       // log
    //       // ---
    //       console.log('7: finished')
    //       break
    //     }
    //   }
    // }

    // ------
    // return
    // ------
    return {
      selection,
      variables,
      datatable,
      useHasPermission,
      createData,
      selectedRow,
      dataRepairServices
    }
  }
}
</script>
