<template>
  <div>
    <div class="row no-wrap bg-deep-purple-2 shadow-1">
      <!-- tcr menu -->
      <tcr-menu></tcr-menu>

      <!-- archive menu -->
      <archive-menu></archive-menu>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { defineAsyncComponent, computed } from 'vue'

export default {
  components: {
    tcrMenu: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/toolbar/tcrMenu.vue')),
    archiveMenu: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/toolbar/archiveMenu.vue'))
  },

  setup () {
    // composible
    const $store = useStore()

    // getters dataSnapshot
    const dataSnapshot = computed(() => { return $store.getters['commonReference/getDataSnapshot'] })

    return {
      dataSnapshot
    }
  }
}
</script>
