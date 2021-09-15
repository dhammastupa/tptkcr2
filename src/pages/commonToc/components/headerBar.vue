<template>
  <div>
    <div class="row no-wrap bg-deep-purple-2 shadow-1">
      <!-- toc menu -->
      <toc-menu></toc-menu>

      <!-- page finder menu -->
      <page-finder-menu></page-finder-menu>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, defineAsyncComponent } from 'vue'

export default {
  components: {
    tocMenu: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/headerTocMenu.vue')),
    pageFinderMenu: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/headerPageFinderMenu.vue'))
  },

  setup () {
    // initial composible
    const $store = useStore()

    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // fetchTocSetRows
    $store.dispatch(
      'commonToc/fetchTocSetRows'
    )

    // get tocSetID
    const tocSetID = computed(() => {
      let result = null
      if (route.value.name === 'common-toc') {
        result = route.value.params.id
      }
      return result
    })

    // watch if tocSetID is change
    watch(tocSetID, function () {
      console.log('change tocSetID')
      if (route.value.name === 'common-toc') {
        $store.commit(
          'commonToc/setTocSet',
          { id: tocSetID.value }
        )
      }
    })

    // getters dataSnapshot
    const dataSnapshot = computed(() => { return $store.getters['commonToc/getDataSnapshot'] })

    // getters variables
    const variables = computed(() => { return $store.getters['commonToc/getVariables'] })

    return {
      dataSnapshot,
      variables
    }
  }
}
</script>
