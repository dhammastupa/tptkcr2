<template>
  <div>
    <q-banner inline-actions class="">
      <div class="text-h6">{{ variables.tipitakaEdition.name }}</div>
      {{ variables.tipitakaEdition.description }} {{ variables.tipitakaEdition.volumes }} {{ $t('pageTipitakaPreservation.volumesSet') }}
      <template v-slot:action>
        <q-select
          flat bottom-slots
          v-model="selectedVolume"
          :options="selection.volume"
          :label="$t('pageTipitakaPreservation.selectVolume')"
          emit-value
          map-options
        >
          <template v-slot:hint>
            {{ variables.totalPages }} {{ $t('pageTipitakaPreservation.pages') }}
          </template>
        </q-select>
      </template>
    </q-banner>

    <q-banner inline-actions class="q-px-lg">
      <q-range
        v-if="selectedVolume"
        v-model="pRange"
        :min="1"
        :max="variables.totalPages"
        :step="10"
        label-always
        drag-only-range
        @change = pageRangeChange
      />
    </q-banner>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    // initial composible
    const $store = useStore()

    // get route
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // init vars
    const tipitakaEditionID = computed(() => {
      let result = null
      if (route.value.name === 'tipitakaPreservation') {
        result = route.value.params.id
      }
      return result
    })

    $store.dispatch(
      'preservation/headerAction',
      tipitakaEditionID.value
    )

    // getters selection
    const selection = computed(() => { return $store.getters['preservation/getSelection'] })

    // getters variables
    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    // variables
    const selectedVolume = ref(variables.value.volume)

    const pRange = ref(variables.value.pageRange)

    // watch
    watch(tipitakaEditionID, function () {
      if (tipitakaEditionID.value) {
        $store.dispatch(
          'preservation/headerAction',
          tipitakaEditionID.value
        )
        selectedVolume.value = variables.value.volume
        $store.commit(
          'preservation/setVolume',
          $store.state.preservation.variables.defaultVolume
        )
        $store.commit(
          'preservation/setPageRange',
          $store.state.preservation.variables.defaultPageRange
        )
        selectedVolume.value = variables.value.volume
        pRange.value = variables.value.pageRange
      }
    })

    watch(selectedVolume, function () {
      if (selectedVolume.value) {
        $store.dispatch(
          'preservation/onVolumeChange',
          selectedVolume.value
        )
        pRange.value = variables.value.pageRange
      }
    })

    function pageRangeChange (val) {
      $store.commit(
        'preservation/setPageRange',
        pRange.value
      )
    }

    return {
      selection,
      variables,
      tipitakaEditionID,
      selectedVolume,
      pRange,
      pageRangeChange
    }
  }
}
</script>
