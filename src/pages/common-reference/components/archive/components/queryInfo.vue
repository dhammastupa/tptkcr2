<template>
  <div>
    <!-- query info -->
    <div v-if="archiveMenu.tipitakaEdition" class="text-h6 text-center">
      {{ archiveMenu.tipitakaEdition.label }}
    </div>
    <div v-if="archiveMenu.volume" class="text-subtitle1 text-center q-pt-sm">
      {{ archiveMenu.volume.label }}
    </div>
    <!-- select page -->
    <q-slider
      v-if="archiveMenu.volume.totalPages"
      :model-value="page" label
      :min="1" :max="totalPages"
      @change="val => { page = val }"
    />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { toNumber, isEmpty } from 'lodash'

export default {
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
    // tcrData
    const tcrData = computed(() => { return $store.getters['commonReference/getTcrData'] })
    watch(tcrData.value, function () {
      if (!isEmpty(tcrData.value.gotoWord)) {
        page.value = tcrData.value.gotoWord.pageNumber
      }
    })

    // imageScan
    const imageScan = computed(() => { return $store.getters['commonReference/getImageScan'] })

    // ---------------
    // local variables
    // ---------------
    // page
    const page = ref(imageScan.value.pageNumber)
    watch(page, function (n, o) {
      $store.dispatch('commonReference/fetchTipitaka', n)
    })

    // totalPages
    const totalPages = computed(() => {
      let result = 1
      if (archiveMenu.value.volume.totalPages) {
        result = toNumber(archiveMenu.value.volume.totalPages)
      }
      return result
    })
    // when totalPages changed mean user select new volume
    watch(totalPages, function () {
      page.value = 1
      $store.dispatch('commonReference/fetchTipitaka', page.value)
    })

    return {
      isEmpty,
      archiveMenu,
      page,
      totalPages
    }
  }
}
</script>
