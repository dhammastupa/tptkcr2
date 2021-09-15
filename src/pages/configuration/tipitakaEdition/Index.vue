<template>
  <q-page>
    <!-- datatable -->
    <data-table
      @onCreateBtnClick="createDocument"
      @openTableRowClick="updateDocument"
    ></data-table>

    <!-- form-dialog -->
    <form-dialog
      :formAction="formAction"
    ></form-dialog>
  </q-page>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.tipitakaEdition',

  components: {
    dataTable: defineAsyncComponent(() => import(
      'src/pages/configuration/tipitakaEdition/components/dataTable.vue')),
    formDialog: defineAsyncComponent(() => import(
      'src/pages/configuration/tipitakaEdition/components/formDialog.vue'))
  },

  setup () {
    // initial variables
    const { formAction, createDocument, updateDocument } = useCrudForm()

    return {
      formAction,
      createDocument,
      updateDocument
    }
  }
}
</script>

<style scope>
</style>
