<template>
  <q-toolbar
    class="col-9 text-deep-purple-4 q-gutter-xs">
    <q-space />
    <div>
      <q-btn-toggle
        v-model="viewMode"
        flat
        toggle-color="purple"
        :options="[
          {value: 'imageScan', slot: 'imageScan',},
          {value: 'imageWordList', slot: 'imageWordList'},
          {value: 'tocWordList', slot: 'tocWordList'}
        ]"
      >
        <template v-slot:imageScan>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonToc.imageScan') }}</q-tooltip>
          </div>
          <q-icon name="auto_stories"></q-icon>
        </template>
        <template v-slot:imageWordList>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonToc.imageWordList') }}</q-tooltip>
          </div>
          <q-icon name="chrome_reader_mode"></q-icon>
        </template>
        <template v-slot:tocWordList>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonToc.tocWordList') }}</q-tooltip>
          </div>
          <q-icon name="account_tree"></q-icon>
        </template>
      </q-btn-toggle>
    </div>
    <q-btn-dropdown
      flat stretch
      color="purple"
      :label="$t('pageCommonToc.openTipitaka')"
    >
      <div class="dropdown-width no-wrap q-pa-md">
        <div class="col">
          <q-select
            v-model="tipitakaEdition"
            :options="tipitakaEditionSelection"
            :label="$t('pageCommonToc.tipitakaEdtion')"
          />
        </div>
      </div>

      <div class="dropdown-width no-wrap q-pa-md">
        <div class="col">
          <q-select
            v-model="volume"
            :options="volumeSelection"
            :label="$t('pageCommonToc.volume')"
          />
        </div>
      </div>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  setup () {
    // initial composible
    const $store = useStore()
    const $t = useI18n().t

    // --------
    // viewMode
    // --------
    const viewMode = ref('imageScan')
    watch(viewMode, function (n, o) {
      $store.commit('commonToc/setViewMode', n)
    })

    // ---------------
    // tipitakaEdition
    // ---------------
    // fetchTipitakaEdition
    $store.dispatch(
      'commonToc/fetchTipitakaEdition'
    )

    // getters dataSnapshot
    const dataSnapshot = computed(() => { return $store.getters['commonToc/getDataSnapshot'] })

    // getters variables
    const variables = computed(() => { return $store.getters['commonToc/getVariables'] })

    // tipitakaEditionSelection
    const tipitakaEditionSelection = computed(() => {
      const result = []
      dataSnapshot.value.tipitakaEdition.forEach(doc => {
        result.push({
          value: doc.code,
          label: `${doc.name} ${doc.volumes} ${$t('pageCommonToc.volumes')}`
        })
      })
      return result
    })

    // tipitakaEdition
    const tipitakaEdition = ref(null)
    watch(tipitakaEdition, function () {
      if (tipitakaEdition.value) {
        $store.commit(
          'commonToc/setTipitakaEdition',
          tipitakaEdition.value
        )
        $store.commit(
          'commonToc/setVolumeSelection',
          tipitakaEdition.value.value
        )
        $store.commit(
          'commonToc/setVolume',
          null
        )
        volume.value = null
      }
    })

    // volume selection
    const volumeSelection = computed(() => {
      const result = []
      variables.value.volumes.forEach(v => {
        result.push({
          value: v.number,
          label: `${v.number}. ${v.name} (${v.totalPages} ${$t('pageCommonToc.pages')})`
        })
      })
      return result
    })

    // volume
    const volume = ref(null)
    watch(volume, function () {
      if (volume.value) {
        $store.commit(
          'commonToc/setVolume',
          volume.value.value
        )
      }
    })

    return {
      dataSnapshot,
      variables,
      tipitakaEditionSelection,
      tipitakaEdition,
      volumeSelection,
      volume,
      viewMode
    }
  }
}
</script>

<style scoped>
.dropdown-width {
  width: 300px;
}
</style>
