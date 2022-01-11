<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 col-md-4">
      <q-select
        outlined readonly
        v-model="datatable.selectedRow.tipitakaEdition"
        :options="selection.tipitakaEdition"
        :label="$t('pageTipitakaPreservation.tipitakaEdition')"
        emit-value
        map-options
      />
    </div>

    <div class="col-12 col-md-6">
      <q-select
        outlined bottom-slots readonly
        v-model="variables.volume"
        :options="selection.volume"
        :label="$t('pageTipitakaPreservation.volumeNumber')"
        emit-value
        map-options
      >
        <template v-slot:hint>
          {{ variables.totalPages }} {{ $t('pageTipitakaPreservation.pages') }}
        </template>
      </q-select>
    </div>

    <div class="col-12 col-md-2">
      <q-select
        outlined
        readonly
        v-model="datatable.selectedRow.pageNumber"
        :options="selection.pages"
        :label="$t('pageTipitakaPreservation.pageNumber')"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    // composable
    const $store = useStore()

    // init vars
    const selection = computed(() => { return $store.getters['preservation/getSelection'] })

    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    return {
      selection,
      variables,
      datatable
    }
  }
}
</script>
