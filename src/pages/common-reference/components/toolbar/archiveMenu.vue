<template>
  <q-toolbar
    class="col-9 text-deep-purple-4 q-gutter-xs">
    <q-space />

    <div>
      <!-- view mode -->
      <q-btn-toggle
        v-model="viewMode"
        flat
        toggle-color="purple"
        :options="archiveMenu.viewModeSelection"
      >
        <template v-slot:imageScan>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonReference.imageScan') }}</q-tooltip>
          </div>
          <q-icon name="auto_stories"></q-icon>
        </template>
        <template v-slot:imageWordList>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonReference.imageWordList') }}</q-tooltip>
          </div>
          <q-icon name="chrome_reader_mode"></q-icon>
        </template>
        <template v-slot:referenceWordList>
          <div class="text-center q-anchor--skip">
            <q-tooltip>{{ $t('pageCommonReference.referenceWordList') }}</q-tooltip>
          </div>
          <q-icon name="account_tree"></q-icon>
        </template>
      </q-btn-toggle>
    </div>
    <!-- font size -->
    <q-btn flat
      icon="format_size"
      color="deep-purple-3"
      text-color="purple"
      @click="setFontSize"
    >
      <q-tooltip>{{ $t('system.fontSize') }}</q-tooltip>
    </q-btn>
    <!-- select tipitaka -->
    <q-btn-dropdown
      flat stretch
      color="purple"
      :label="$t('pageCommonReference.openTipitaka')"
    >
      <div class="dropdown-width no-wrap q-pa-md">
        <div class="col">
          <q-select
            v-model="tipitakaEdition"
            :options="archiveMenu.tipitakaEditionSelection"
            :label="$t('pageCommonReference.tipitakaEdtion')"
          />
        </div>
      </div>

      <div class="dropdown-width no-wrap q-pa-md">
        <div class="col">
          <q-select
            v-model="volume"
            :options="archiveMenu.volumeSelection"
            :label="$t('pageCommonReference.volume')"
          />
        </div>
      </div>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { isEmpty } from 'lodash'

export default {
  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // --------------------
    // fetchTipitakaEdition
    // --------------------
    $store.dispatch('commonReference/fetchTipitakaEdition')

    // -------
    // getters
    // -------
    // dataSnapshot
    const dataSnapshot = computed(() => { return $store.getters['commonReference/getDataSnapshot'] })
    // archiveMenu
    const archiveMenu = computed(() => { return $store.getters['commonReference/getArchiveMenu'] })
    watch(archiveMenu.value, function (n, o) {
      // == viewMode ==
      if (archiveMenu.value.viewMode === 'referenceWordList') {
        if (viewMode.value !== 'referenceWordList') {
          viewMode.value = 'referenceWordList'
        }
      }
      if (archiveMenu.value.viewMode === 'imageWordList') {
        if (viewMode.value !== 'imageWordList') {
          viewMode.value = 'imageWordList'
        }
      }
      // == tipitakaEdition ==
      // case assign value from tcrData
      if (isEmpty(tipitakaEdition.value)) {
        if (!isEmpty(archiveMenu.value.tipitakaEdition)) {
          tipitakaEdition.value = archiveMenu.value.tipitakaEdition
          volume.value = null
        }
        // case tcrData change and not equal to local var
      } else {
        if (n.tipitakaEdition !== tipitakaEdition.value) {
          tipitakaEdition.value = archiveMenu.value.tipitakaEdition
          volume.value = null
        }
      }
      // == volume ==
      // case assign value from tcrData }
      if (isEmpty(volume.value)) {
        if (!isEmpty(archiveMenu.value.volume)) {
          volume.value = archiveMenu.value.volume
        }
        // case tcrData change and not equal to local var
      } else {
        if (n.volume !== volume.value) {
          volume.value = archiveMenu.value.volume
        }
      }
    })
    // settings
    const settings = computed(() => { return $store.getters['commonReference/getSettings'] })

    // ---------
    // variables
    // ---------
    // searchText
    const searchInput = ref(null)
    const searchText = ref('')
    // viewMode
    const viewMode = ref(archiveMenu.value.viewMode)
    watch(viewMode, function (n, o) {
      $store.commit('commonReference/setArchiveMenuViewMode', n)
    })

    // tipitakaEdition
    const tipitakaEdition = ref(null)
    watch(tipitakaEdition, function (n, o) {
      $store.commit('commonReference/setArchiveMenuTipitakaEdition', n)
      $store.commit('commonReference/setArchiveMenuVolumeSelection', n.value)
      volume.value = null
    })

    // volume
    const volume = ref('')
    watch(volume, function (n, o) {
      if (n) {
        $store.commit('commonReference/setArchiveMenuVolume', n)
      }
    })

    // --------
    // function
    // --------
    function setFontSize () {
      switch (settings.value.fontSize) {
        case '14px':
          $store.commit('commonReference/setFontSize', '18px')
          break
        case '18px':
          $store.commit('commonReference/setFontSize', '21px')
          break
        case '21px':
          $store.commit('commonReference/setFontSize', '14px')
          break
      }
    }

    return {
      // global variables
      dataSnapshot,
      archiveMenu,
      // local variables
      searchInput,
      searchText,
      viewMode,
      tipitakaEdition,
      volume,
      // functions
      setFontSize
    }
  }
}
</script>

<style scoped>
.dropdown-width {
  width: 300px;
}
</style>
