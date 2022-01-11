<template>
  <q-page padding>
    <!-- view mode imageScan -->
    <image-scan v-if="archiveMenu.viewMode === 'imageScan'"></image-scan>
    <!-- imageWordList -->
    <image-word-list v-if="archiveMenu.viewMode === 'imageWordList'"></image-word-list>
    <!-- referenceWordList -->
    <reference-word-list v-if="archiveMenu.viewMode === 'referenceWordList'"></reference-word-list>
  </q-page>
</template>

<script>
import { defineAsyncComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    imageScan: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/archive/components/imageScan.vue')),
    imageWordList: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/archive/components/imageWordList')),
    referenceWordList: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/archive/components/referenceWordList.vue'))
  },

  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // --------------------------
    // getters (global variables)
    // --------------------------
    // archiveMenu
    const archiveMenu = computed(() => { return $store.getters['commonReference/getArchiveMenu'] })

    return {
      archiveMenu
    }
  }
}
</script>
