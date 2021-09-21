<template>
  <q-page padding>
    <!-- //////////// -->
    <!-- view by mode -->
    <!-- //////////// -->
    <div v-if="pageFinderMenu.viewMode === 'imageScan' ||
      pageFinderMenu.viewMode === 'imageWordList'"
    >
      <!-- query info -->
      <div v-if="variables.tipitakaEdition.name" class="text-h6 text-center">
        {{ variables.tipitakaEdition.name }}
      </div>
      <div v-if="variables.volume.number" class="text-subtitle1 text-center q-pt-sm">
        {{ $t('pageCommonToc.volume') }} {{ variables.volume.number }}
        {{ variables.volume.name }}
        ({{ $t('pageCommonToc.page') }}
        {{ page }} / {{ variables.volume.totalPages }}
        {{$t('pageCommonToc.pages')}})
      </div>
      <!-- select page -->
      <q-slider
        v-if="variables.volume.totalPages"
        v-model="page"
        :min="1" :max="totalPages"
        @change="changePage"
      />

      <!-- view mode: imageScan -->
      <div v-if="pageFinderMenu.viewMode ==='imageScan'">
        <q-img
          v-if="variables.imageUrl"
          :src="variables.imageUrl"
          loading="lazy"
          spinner-color="deep-purple-6"
        />
      </div>

      <!-- view mode: wordRange -->
      <div v-if="pageFinderMenu.viewMode ==='imageWordList'">
        <div v-if="!isEmpty(variables.selectWordRange)" class="text-center">
          {{ $t('pageCommonToc.wordRange') }}:
            <li
              v-for="i in orderBy(variables.selectWordRange, 'wordIndex')" :key=i.id
              class="content-block" flat
            >
            <span class="text-deep-purple-10 text-weight-bolder">
              <q-badge outline color="primary" :label="i.word" />
            </span>
            {{ $t('pageCommonToc.volumeNumber') }} {{i.volumeNumber}}
            {{ $t('pageCommonToc.pageNumber') }} {{i.pageNumber}}
            <span v-if="maxBy(variables.selectWordRange, 'wordIndex').id != i.id">
              &nbsp;&nbsp;-&nbsp;&nbsp;
            </span>
          </li>
          <br/>

          <!-- add reference -->
          <q-btn
            :disable="!commonToc.selected"
            dense flat rounded
            text-color="secondary"
            :label="$t('pageCommonToc.addToReference')"
            icon="add_circle_outline"
            class="q-my-sm text-center"
            @click="addReference"
          />
        </div>

        <!-- view mode: wordList -->
        <div class="fit row wrap justify-center items-start content-start">
          <div v-if="!isEmpty(variables.wordList)">
            <ol>
              <li v-for="l in lastLine" :key="l">
                <q-btn
                  v-for="w in filter(variables.wordList, { 'lineNumber': l })"
                  :key="w.wordIndex"
                  :id="w.wordIndex"
                  :label="w.word"
                  :class="{
                    selectWord: (w.id === selectWord.id),
                    wordInRange: wordInRange(w.wordIndex)
                  }"
                  flat padding="xs xs"
                  @click="onSelectWord(w.id)"
                />
              </li>
            </ol>
          </div>
          <div v-else
            class="text-h5 text-center q-pt-lg"
          >
            {{ $t('pageCommonToc.noRecordFound') }}
          </div>
        </div>
      </div>
    </div>

    <!-- view mode: tocWordList -->
    <div v-if="pageFinderMenu.viewMode ==='tocWordList'">

    </div>
  </q-page>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { toNumber, last, isEmpty, filter, find, sortBy, orderBy, maxBy } from 'lodash'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { createDoc, getPromiseDocs } from 'src/functions/manage-data.js'
import { db, Timestamp } from 'src/boot/firebase'

export default {
  setup () {
    // initial composible
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // getters variables
    const variables = computed(() => { return $store.getters['commonToc/getVariables'] })

    // getters commonToc
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // getters pageFinderMenu
    const pageFinderMenu = computed(() => { return $store.getters['commonToc/getPageFinderMenu'] })

    // page
    const page = ref(1)

    // totalPages
    const totalPages = computed(() => {
      let result = 1
      if (variables.value.volume.totalPages) {
        result = toNumber(variables.value.volume.totalPages)
      }
      return result
    })
    // when totalPages changed mean user select new volume
    watch(totalPages, function () {
      page.value = 1
      $store.dispatch('commonToc/fetchTipitaka', page.value)
    })

    // function changePage
    function changePage (val) {
      $store.dispatch('commonToc/fetchTipitaka', val)
    }

    // get last line in page
    const lastLine = computed(() => {
      let result = 1
      if (!isEmpty(variables.value.wordList)) {
        result = last(variables.value.wordList).lineNumber
      }
      return result
    })

    // function onSelectWord
    const selectWord = ref({})
    const selectWordRange = ref([])

    function onSelectWord (id) {
      selectWord.value = find(variables.value.wordList, ['id', id])
      $store.commit('commonToc/setSelectWord', selectWord.value)

      // process
      if (selectWordRange.value.length < 2) {
        // < 2 then push a new wordId
        selectWordRange.value.push(selectWord.value)
        if (selectWordRange.value.length === 2) {
          $store.commit(
            'commonToc/setSelectWordRange',
            sortBy(selectWordRange.value, 'wordIndex')
          )
        }
      } else {
        // >= 2 then reset and push a new wordId
        selectWordRange.value = []
        $store.commit('commonToc/setSelectWordRange', [])
        selectWordRange.value.push(selectWord.value)
      }
    }

    // function check is word in range?
    function wordInRange (wordIndex) {
      let result = false
      if (variables.value.selectWordRange.length) {
        if (
          (wordIndex >= variables.value.selectWordRange[0].wordIndex) &&
          (wordIndex <= variables.value.selectWordRange[1].wordIndex)
        ) {
          result = true
        }
      }
      return result
    }

    // function add word range to Reference
    async function addReference () {
      const doc = await getPromiseDocs(
        db.collection('commonRef')
          .where('commonToc', '==', commonToc.value.selected)
      )
      if (isEmpty(doc)) {
        $q.dialog({
          title: $t('system.confirm'),
          message: $t('pageCommonToc.addToReference'),
          cancel: true,
          persistent: true
        }).onOk(() => {
          const newDoc = db.collection('commonRef').doc()
          const newDocId = newDoc.id
          const data = {
            id: newDocId,
            content: variables.value.selectWordRange,
            tipitakaEdition: variables.value.tipitakaEdition.code,
            // log
            createdOn: Timestamp.now(),
            createdBy: userName.value,
            updatedOn: Timestamp.now(),
            updatedBy: userName.value
          }
          createDoc(newDoc, { ...data })
        }).onOk(() => {
          console.log('>>>> second OK catcher')
        }).onCancel(() => {
          console.log('>>>> Cancel')
        }).onDismiss(() => {
          console.log('I am triggered on both OK and Cancel')
        })
      } else {
        $store.commit('commonToc/setShowReference', doc)
        $q.notify({
          icon: 'info',
          color: 'positive',
          message: $t('pageCommonToc.foundReferenceData')
        })
      }
    }

    return {
      filter,
      isEmpty,
      orderBy,
      maxBy,
      variables,
      commonToc,
      pageFinderMenu,
      page,
      totalPages,
      lastLine,
      changePage,
      onSelectWord,
      selectWord,
      selectWordRange,
      wordInRange,
      addReference
    }
  }
}
</script>

<style scoped>
.selectWord {
  color: #673ab7 !important;
  font-weight: bold;
}
.wordInRange {
  color: #673ab7 !important;
}
li.content-block {
  display:inline;
}

</style>
