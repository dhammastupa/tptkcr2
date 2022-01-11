<template>
  <div class="q-pa-md paragraph">
    <q-btn
      v-for="w in contentList"
      :key="w.wordIndex"
      :id="w.wordIndex"
      :label="w.word"
      :class="{
        customFontSize: true
      }"
      flat padding="xs xs"
    />
  </div>
  <div class="text-center" v-if="readMore">
    <q-btn
      rounded
      color="deep-purple-3"
      :label="$t('system.readMore')"
      @click="fetchReferenceWordList"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { db } from 'src/boot/firebase.js'
import { last } from 'lodash'

export default {

  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // ---------------
    // local variables
    // ---------------
    const contentList = ref([])
    const lastDocSnapshot = ref(null)
    const readMore = ref(false)
    const limit = ref(180)

    // --------------------------
    // getters (global variables)
    // --------------------------
    // dataSnapshot
    const tcrData = computed(() => { return $store.getters['commonReference/getTcrData'] })
    watch(tcrData.value, function () {
      if (tcrData.value.updateTcrData) {
        // reset
        contentList.value = []
        lastDocSnapshot.value = null
        readMore.value = false
        $store.commit('commonReference/setFetchReferenceWordList', false)
      }
    })

    // imageWordList
    const imageWordList = computed(() => { return $store.getters['commonReference/getImageWordList'] })

    // referenceWordList
    const referenceWordList = computed(() => { return $store.getters['commonReference/getReferenceWordList'] })
    if (referenceWordList.value.fetchReferenceWordList) {
      fetchReferenceWordList()
    }
    watch(referenceWordList.value, function () {
      if (referenceWordList.value.fetchReferenceWordList) {
        contentList.value = []
        fetchReferenceWordList()
      }
    })

    // --------
    // funciton
    // --------
    // fetchReferenceWordList
    async function fetchReferenceWordList () {
      let wordlistRef = db.collection('wordList')
        .where('wordIndex', '>=', tcrData.value.selectedTcrData.beginWordIndex)
        .where('wordIndex', '<=', tcrData.value.selectedTcrData.endWordIndex)
        .orderBy('wordIndex', 'asc')
        .limit(limit.value)

      if (readMore.value) {
        wordlistRef = wordlistRef.startAfter(lastDocSnapshot.value)
      }
      const wordlistSnap = await wordlistRef.get()
      $store.commit('commonReference/setFetchReferenceWordList', false)
      lastDocSnapshot.value = wordlistSnap.docs[wordlistSnap.docs.length - 1]
      const result = wordlistSnap.docs.map(p => p.data())
      contentList.value.push(...result)
      readMore.value = tcrData.value.selectedTcrData.endWordIndex > last(contentList.value).wordIndex
    }

    // onLoad
    function onLoad (index, done) {

    }

    return {
      // global vars
      tcrData,
      imageWordList,
      // local vars
      referenceWordList,
      contentList,
      lastDocSnapshot,
      readMore,
      // function
      last,
      fetchReferenceWordList,
      onLoad
    }
  }
}
</script>

<style scoped>
.selectWord {
  color: #3a6cb7 !important;
  font-weight: bold;
}
.selectWordForRange {
  color: #673ab7 !important;
  font-weight: bold;
}
.wordInRange {
  color: #673ab7 !important;
}
.paragraph {
  text-indent: 50px;
}
</style>
