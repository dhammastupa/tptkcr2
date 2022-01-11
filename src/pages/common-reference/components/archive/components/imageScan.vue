<template>
  <div>
    <!-- query info -->
    <query-info></query-info>

    <!-- show imageScan -->
    <q-img
      v-if="imageScan.imageUrl"
      :src="imageScan.imageUrl"
      loading="lazy"
      spinner-color="deep-purple-6"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { defineAsyncComponent, computed } from 'vue'

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
    // archiveMenu
    const archiveMenu = computed(() => { return $store.getters['commonReference/getArchiveMenu'] })

    // imageScan
    const imageScan = computed(() => { return $store.getters['commonReference/getImageScan'] })

    return {
      archiveMenu,
      imageScan
    }
  }
}
</script>
