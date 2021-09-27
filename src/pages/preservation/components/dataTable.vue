<template>
  <div>
    <q-table
      row-key="id"
      :grid="$q.screen.xs"
      :title="$t($options.name)"
      :rows="datatable.rows"
      :columns="datatable.columns"
      :filter="datatable.filter"
      :pagination="datatable.pagination"
      :loading="datatable.loading"
      @row-click="selectedRow"
    >
      <template v-slot:top-right>
        <q-input borderless
          dense debounce="300"
          v-model="datatable.filter"
          :placeholder="$t('system.search')">
          <template v-slot:append>

            <!-- search -->
            <q-icon name="search" />

            <!-- add -->
            <q-btn
              color="white"
              text-color="primary"
              round
              icon="add"
              class="q-ma-md"
              @click="createData"
            >
              <q-tooltip>
                {{ $t('pageTipitakaPreservation.createPage') }}
              </q-tooltip>
            </q-btn>

          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { db } from 'src/boot/firebase.js'
import { useLiveData } from 'src/functions/manage-data.js'
import { useI18n } from 'vue-i18n'
import useHasPermission from 'src/hooks/has-permission.js'

export default {
  name: 'mainNavigation.tipitakaPreservation',

  setup () {
    // composable
    const $t = useI18n().t
    const $store = useStore()

    // ---------
    // variables
    // ---------
    const collection = db.collection('tipitaka')

    // getters selection
    const selection = computed(() => { return $store.getters['preservation/getSelection'] })

    // getters variable
    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    // route
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // tipitakaEditionID
    const tipitakaEditionID = computed(() => {
      return route.value.params.id
    })

    const volume = computed(() => {
      return variables.value.volume
    })

    const pageRange = computed(() => {
      return variables.value.pageRange
    })

    // datatable
    const datatable = reactive({
      filter: '',
      rows: [],
      columns: [
        {
          name: 'pageNumber',
          field: 'pageNumber',
          label: $t('pageTipitakaPreservation.pageNumber'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'text',
          field: 'text',
          label: $t('pageTipitakaPreservation.text'),
          sortable: true,
          align: 'left',
          classes: 'bg-blue-grey-1 ellipsis',
          style: 'max-width: 250px',
          headerStyle: 'max-width: 250px'
        },
        {
          name: 'proofread',
          field: 'proofread',
          format: val => (val === true) ? '✓' : '',
          label: $t('pageTipitakaPreservation.proofread'),
          sortable: false,
          align: 'center'
        }
      ],
      pagination: {
        sortBy: 'pageNumber',
        descending: false,
        rowsPerPage: 20
      },
      loading: false
    })

    // -----------------------------------------
    // function get datatable rows from databaes
    // -----------------------------------------
    function getRows () {
      datatable.loading = true
      datatable.rows = useLiveData(
        collection
          .where('tipitakaEdition', '==', tipitakaEditionID.value)
          .where('volumeNumber', '==', variables.value.volume)
          .where('pageNumber', '>=', variables.value.pageRange.min)
          .where('pageNumber', '<=', variables.value.pageRange.max)
          .orderBy('pageNumber', 'asc'))
      setTimeout(function () { datatable.loading = false }, 1000)
    }
    getRows()

    // watch
    watch(datatable, function () {
      $store.commit(
        'preservation/setQuerySnapshot',
        datatable.rows
      )
    })

    watch(tipitakaEditionID, function () {
      if (tipitakaEditionID.value) {
        getRows()
      }
    })

    watch([volume, pageRange], function () {
      getRows()
    })

    // --------------------------
    // function create new record
    // --------------------------
    function createData () {
      $store.commit(
        'preservation/setCreateForm',
        {
          active: true
        }
      )
    }

    // --------------------------
    // function selectedRow
    // --------------------------
    function selectedRow (evt, row) {
      $store.commit(
        'preservation/setSelectedRow',
        row
      )
      $store.commit(
        'preservation/setDataForm',
        {
          active: true
        })
      $store.dispatch(
        'preservation/getImageUrl'
      )
    }

    // ------
    // return
    // ------
    return {
      selection,
      variables,
      datatable,
      useHasPermission,
      createData,
      selectedRow
    }
  }
}
</script>
