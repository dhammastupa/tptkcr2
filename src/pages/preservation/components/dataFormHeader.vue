<template>
  <q-banner inline-actions
    :class="{ 'text-white': true, 'bg-primary': true }">
    <!-- icon: show action type -->
    <q-icon name="drive_file_rename_outline" size="sm" />
    <!-- form name -->
    {{ $t($options.name) }}
    <!-- execution function icon -->
    <template v-slot:action>
      <div class="q-gutter-sm">
        <!-- go prev -->
        <q-btn
          flat
          :disable="previousPage"
          round icon="arrow_back"
          @click="previousDoc">
        </q-btn>
        <!-- go next -->
        <q-btn
          flat
          :disable="nextPage"
          round icon="arrow_forward"
          @click="nextDoc">
        </q-btn>
        <!-- close / not save -->
        <q-btn
          flat
          icon="close"
          @click="closeForm">
        </q-btn>
        <!-- close / save -->
        <q-btn
          flat
          icon="save"
          :disable="proofreadRef"
          @click="submitThenCloseForm">
        </q-btn>
      </div>
    </template>
  </q-banner>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { db } from 'src/boot/firebase.js'
import { updateDoc } from 'src/functions/manage-data.js'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

export default {
  name: 'system.update',

  setup () {
    // ----------
    // composable
    // ----------
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // -------
    // getters
    // -------
    // getters datatable
    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    // getters selectedRow
    const selectedRow = computed(() => { return $store.getters['preservation/getSelectedRow'] })

    // proofread
    const proofreadRef = ref(selectedRow.value.proofread) // proofread field

    // getters variables
    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    // -------------
    // buttom status
    // -------------
    // previous btn
    const previousPage = computed(() => {
      if (datatable.value.selectedRow) {
        if (datatable.value.selectedRow.pageNumber > 1) {
          return false
        }
      }
      return true
    })

    // next btn
    const nextPage = computed(() => {
      if (datatable.value.selectedRow) {
        if (datatable.value.selectedRow.pageNumber < variables.value.totalPages) {
          return false
        }
      }
      return true
    })

    function previousDoc () {
      const rowIndex = _.findIndex(
        datatable.value.querySnapshot,
        {
          pageNumber: datatable.value.selectedRow.pageNumber
        }
      )
      const row = datatable.value.querySnapshot[rowIndex - 1]
      $store.commit(
        'preservation/setSelectedRow',
        row
      )
      $store.dispatch(
        'preservation/getImageUrl'
      )
    }

    function nextDoc () {
      const rowIndex = _.findIndex(
        datatable.value.querySnapshot,
        {
          pageNumber: datatable.value.selectedRow.pageNumber
        }
      )
      const row = datatable.value.querySnapshot[rowIndex + 1]
      $store.commit(
        'preservation/setSelectedRow',
        row
      )
      $store.dispatch(
        'preservation/getImageUrl'
      )
    }

    function closeForm () {
      $store.commit(
        'preservation/setDataForm',
        {
          active: false
        }
      )
    }

    async function submitThenCloseForm () {
      console.log('submitThenCloseForm')
      const data = datatable.value.updateData
      const doc = db.collection('tipitaka').doc(data.id)
      await updateDoc(doc, data)
        .then(() => {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
          closeForm()
        })
        .catch((error) => {
          $q.notify({
            icon: 'error',
            color: 'negative',
            message: $t('system.error')
          })
          console.log(error.code)
        })
    }

    return {
      proofreadRef,
      previousDoc,
      nextDoc,
      closeForm,
      submitThenCloseForm,
      previousPage,
      nextPage
    }
  }
}
</script>
