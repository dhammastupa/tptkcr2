<template>
  <div>
    <!-- query info -->
    <query-info></query-info>

    <!-- imageWordList -->
    <div class="fit row wrap justify-center items-start content-start">
        <div id="pali" v-if="!isEmpty(imageWordList.wordList)">
          <ol>
            <li v-for="l in imageWordList.numberOfLine" :key="l">
              <q-btn
                v-for="w in filter(imageWordList.wordList, { 'lineNumber': l })"
                :key="w.wordIndex"
                :id="w.wordIndex"
                :class="{
                  customFontSize: true,
                  selectWord: (w.docId === selectWord.docId),
                  selectWordForRange: ((w.docId === selectWord.docId) && (selectAction == 2)),
                  wordInRange: wordInRange(w.wordIndex)
                }"
                flat padding="xs xs"
                @click="onSelectWord(w.docId)"
              >
                <div>{{ w.word }}</div>
              </q-btn>
            </li>
          </ol>
        </div>
    </div>

    <!-- selectWordRange -->
    <q-card flat class="text-center"
       v-if="!isEmpty(imageWordList.selectWordRange)" >
      <q-card-section class="bg-deep-purple-3 text-white">
        {{ $t('pageCommonReference.wordRange') }}
      </q-card-section>

      <q-card-section>
        <div
          v-for="i in orderBy(imageWordList.selectWordRange, 'wordIndex')"
          :key=i.docId class="content-block" flat
        >
          <div class="text-deep-purple-10 text-weight-bolder text-h6">
            {{ i.word }}
          </div>
          {{ $t('pageCommonReference.volumeNumber') }} {{i.volumeNumber}}
          {{ $t('pageCommonReference.pageNumber') }} {{i.pageNumber}}
          <div style="q-pb-lg" v-if="maxBy(imageWordList.selectWordRange, 'wordIndex').docId != i.docId">
            ...
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <!-- add reference -->
        <q-btn
          :disable="!tcrItem.selectedTcrItem"
          flat rounded
          text-color="secondary"
          :label="$t('pageCommonReference.addToReference')"
          icon="add_circle_outline"
          class="q-my-sm text-center"
          @click="addReference"
        />
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>
import { useStore } from 'vuex'
import { defineAsyncComponent, ref, computed, watch } from 'vue'
import { isEmpty, filter, sortBy, find, orderBy, maxBy } from 'lodash'

export default {
  components: {
    queryInfo: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/archive/components/queryInfo.vue'))
  },

  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // --------------------------
    // getters (global variables)
    // --------------------------
    // imageWordList
    const imageWordList = computed(() => { return $store.getters['commonReference/getImageWordList'] })

    // tcrItem
    const tcrItem = computed(() => { return $store.getters['commonReference/getTcrItem'] })

    // tcrData
    const tcrData = computed(() => { return $store.getters['commonReference/getTcrData'] })
    watch(tcrData.value, function (n, o) {
      if (!isEmpty(n.gotoWord) || n.updateTcrData) {
        selectWord.value = n.gotoWord
        $store.commit('commonReference/setUpdateTcrData', false)
      }
    })

    // archiveMenu
    const archiveMenu = computed(() => { return $store.getters['commonReference/getArchiveMenu'] })

    // ---------------
    // local variables
    // ---------------
    const selectWord = ref({})
    const selectAction = ref(0)
    const selectWordRange = ref([])

    // ---------
    // functions
    // ---------
    // function check is word in range?
    function wordInRange (wordIndex) {
      let result = false
      if (imageWordList.value.selectWordRange.length) {
        if (
          (wordIndex >= imageWordList.value.selectWordRange[0].wordIndex) &&
          (wordIndex <= imageWordList.value.selectWordRange[1].wordIndex)
        ) {
          result = true
        }
      }
      return result
    }

    // function onSelectWord
    function onSelectWord (docId) {
      if (!isEmpty(selectWord.value)) {
        if (selectWord.value.docId === docId) {
          switch (selectAction.value) {
            // case 0 = not select => select
            case 0:
              selectAction.value++
              // selectWord.value = find(imageWordList.value.wordList, ['docId', docId])
              break
            // case 1 = select => range
            case 1:
              selectAction.value++
              selectWordRange.value.push(selectWord.value)
              break
            // other reset selectAction
            default:
              selectAction.value = 0
              selectWord.value = {}
              selectWordRange.value = []
          }
        } else {
          selectWord.value = find(imageWordList.value.wordList, ['docId', docId])
          switch (selectAction.value) {
            case 1:
              selectWord.value = find(imageWordList.value.wordList, ['docId', docId])
              break
            case 2:
              selectAction.value++
              selectWordRange.value.push(selectWord.value)
              break
            // other reset selectAction
            default:
              selectAction.value = 0
              selectWord.value = {}
              selectWordRange.value = []
          }
        }
      } else {
        selectAction.value++
        selectWord.value = find(imageWordList.value.wordList, ['docId', docId])
      }
      $store.commit('commonReference/setSelectWord', selectWord.value)
      if (selectWordRange.value.length === 2) {
        $store.commit(
          'commonReference/setSelectWordRange',
          sortBy(selectWordRange.value, 'wordIndex')
        )
      } else {
        $store.commit('commonReference/setSelectWordRange', [])
      }
    }

    // function addReference
    function addReference () {
      $store.dispatch('commonReference/addReference', {
        selectedTcrItemRow: tcrItem.value.selectedTcrItemRow,
        tipitakaEdition: archiveMenu.value.tipitakaEdition,
        selectWordRange: imageWordList.value.selectWordRange
      })
    }

    return {
      isEmpty,
      filter,
      orderBy,
      maxBy,
      // global vars
      imageWordList,
      tcrItem,
      // local vars
      selectWord,
      selectWordRange,
      selectAction,
      // functions
      wordInRange,
      onSelectWord,
      addReference
    }
  }
}
</script>

<style scoped>
.selectWord {
  color: #aa1616 !important;
  background: #feffc3;
  font-weight: bolder;
}
.selectWordForRange {
  color: #5d00ff !important;
  background: #feffc3;
  font-weight: bolder;
}
.wordInRange {
  color: #5d00ff !important;
}
li.content-block {
  display:inline;
}
</style>
