<template>
  <div padding class="q-pt-lg">
    <div v-if="loading">
      <q-spinner-hourglass
        color="deep-purple"
        size="2em"
      />
    </div>

    <div v-else>
      <div
        v-for="tcrData in tcrDataList" :key="tcrData.docId"
        class="q-pa-sm"
      >
        <span class="text-h6">{{ tipitakaEditionName(tcrData.tipitakaEdition) }}</span>
        <q-fab flat
          color="deep-purple"
          icon="keyboard_arrow_right"
          direction="right"
          padding="xs"
        >
          <q-fab-action
            padding="4px"
            flat
            @click="gotoWord(tcrData.wordRange[0])"
            icon="skip_previous"
            :label="$t('system.start')"
          />
          <q-fab-action
            padding="4px"
            flat
            @click="gotoWord(tcrData.wordRange[1])"
            icon="skip_next"
            :label="$t('system.end')"
          />
          <q-fab-action
            padding="4px"
            flat
            class="text-red-6"
            @click="deleteTcrDataRecord(tcrData.docId)"
            icon="delete_outline"
            :label="$t('system.delete')"
          />
        </q-fab>
        <div
            class="hover-pointer"
            @click="openReferenceWordList(tcrData)"
          >
            {{ tcrData.samplePhrase }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { find } from 'lodash'
import { getPromiseDocs, deleteDoc } from 'src/functions/manage-data'
import { db } from 'src/boot/firebase.js'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default {
  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // --------------------------
    // getters (global variables)
    // --------------------------
    // dataSnapshot
    const dataSnapshot = computed(() => { return $store.getters['commonReference/getDataSnapshot'] })
    // tcrItem
    const tcrItem = computed(() => { return $store.getters['commonReference/getTcrItem'] })
    // tcrData
    const tcrData = computed(() => { return $store.getters['commonReference/getTcrData'] })
    // archiveMenu
    const archiveMenu = computed(() => { return $store.getters['commonReference/getArchiveMenu'] })
    // ---------------
    // local variables
    // ---------------
    const selectedTcrItem = ref('')
    const tcrDataList = ref([])
    const loading = ref(false)

    // -----
    // watch
    // -----
    watch(tcrData.value, async function () {
      if (tcrData.value.updateTcrData) {
        await updateTcrData()
      }
    })

    // --------
    // funciton
    // --------
    // updateTcrData
    async function updateTcrData () {
      console.log('hi')
      loading.value = true
      selectedTcrItem.value = tcrItem.value.selectedTcrItem
      // tcrDataList
      tcrDataList.value = await getPromiseDocs(
        db.collection('tcrData')
          .where('tcrItem', '==', tcrItem.value.selectedTcrItem)
      )
      $store.commit('commonReference/setSelectedTcrData', {})
      loading.value = false
      $store.commit('commonReference/setUpdateTcrData', false)
    }

    // tipitakaEditionName
    function tipitakaEditionName (code) {
      return find(dataSnapshot.value.tipitakaEdition, { code: code }).description
    }

    // openReferenceWordList
    function openReferenceWordList (tcrData) {
      // set viewMode
      $store.commit('commonReference/setArchiveMenuViewMode', 'referenceWordList')
      $store.commit('commonReference/setSelectedTcrData', tcrData)
      $store.commit('commonReference/setFetchReferenceWordList', true)
      // gotoWord
      // $store.commit('commonReference/setGotoWord', {})
    }

    // gotoWord
    function gotoWord (doc) {
      // set viewMode
      $store.commit('commonReference/setArchiveMenuViewMode', 'imageWordList')
      // tipitakaEdition
      $store.commit('commonReference/setArchiveMenuTipitakaEdition',
        find(archiveMenu.value.tipitakaEditionSelection, { value: doc.tipitakaEdition })
      )
      $store.commit('commonReference/setArchiveMenuVolumeSelection', doc.tipitakaEdition)
      // volume
      $store.commit('commonReference/setArchiveMenuVolume',
        find(archiveMenu.value.volumeSelection, { value: doc.volumeNumber }))
      // gotoWord
      $store.commit('commonReference/setGotoWord', doc)
      $store.commit('commonReference/setUpdateTcrData', true)
    }

    // deleteTcrDataRecord
    async function deleteTcrDataRecord (itemId) {
      $q.dialog({
        title: $t('system.confirm'),
        message: $t('system.confirmToDelete'),
        persistent: true,
        ok: {
          label: $t('system.ok'),
          flat: true,
          color: 'negative'
        },
        cancel: {
          label: $t('system.cancel'),
          flat: true
        }
      }).onOk(async () => {
        await deleteDoc(db.collection('tcrData').doc(itemId))
        await updateTcrData()
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    }

    return {
      // methods
      find,
      // global vars
      dataSnapshot,
      tcrItem,
      archiveMenu,
      // local vars
      selectedTcrItem,
      tcrDataList,
      loading,
      // functions
      tipitakaEditionName,
      deleteTcrDataRecord,
      openReferenceWordList,
      gotoWord
    }
  }
}
</script>

<style scoped>
.hover-pointer {
  cursor: pointer;
}
</style>
