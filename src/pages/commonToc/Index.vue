<template>
  <!-- page -->
  <q-page class="q-gutter-xs">
    <!-- headerBar -->
    <commontoc-header></commontoc-header>

    <!-- createForm -->
    <create-form></create-form>

    <!-- updateForm -->
    <update-form></update-form>

    <!-- splitter -->
    <q-splitter
      v-model="splitterModel"
      style="height: 83vh">

      <!-- left side -->
      <template v-slot:before>
        <q-splitter v-model="insideModel" horizontal>
          <!-- tableOfContents -->
          <template v-slot:before>
            <table-of-contents></table-of-contents>
          </template>

          <!-- settingAndInfo -->
          <template v-slot:after>
            <setting-and-info></setting-and-info>
          </template>
        </q-splitter>
      </template>

      <!-- right side -->
      <template v-slot:after>
        <!-- pageFinder -->
        <page-finder></page-finder>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'
import createForm from 'src/pages/commonToc/components/createForm.vue'
import updateForm from 'src/pages/commonToc/components/updateForm.vue'

export default {
  name: 'mainNavigation.commonReference',

  components: {
    commontocHeader: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/headerBar.vue')),
    tableOfContents: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/tableOfContents.vue')),
    settingAndInfo: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/settingAndInfo.vue')),
    pageFinder: defineAsyncComponent(() => import(
      'src/pages/commonToc/components/pageFinder.vue')),
    createForm,
    updateForm
  },

  setup () {
    // variables
    const splitterModel = ref(40)
    const insideModel = ref(60)

    return {
      splitterModel,
      insideModel
    }
  }
}
</script>
