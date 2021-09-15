<template>
  <!-- page -->
  <q-page class="q-gutter-xs">

    <!-- header -->
    <preservation-header></preservation-header>

    <!-- datatable -->
    <data-table></data-table>

    <!-- createForm -->
    <create-form></create-form>

    <!-- dataForm -->
    <data-form></data-form>

  </q-page>
</template>

<script>
// components
import { defineAsyncComponent } from 'vue'
import createForm from 'src/pages/preservation/components/createForm.vue'

export default {
  name: 'mainNavigation.tipitakaPreservation',
  components: {
    preservationHeader: defineAsyncComponent(() => import(
      'src/pages/preservation/components/headerBar.vue')),
    dataTable: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataTable.vue')),
    dataForm: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataForm.vue')),
    createForm
  },
  setup () {
    return {
    }
  }

}
</script>

<style>
</style>
