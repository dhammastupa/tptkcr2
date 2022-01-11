<template>
  <!-- page -->
  <q-page class="q-gutter-xs">
    <!-- headerBar -->
    <header-toolbar></header-toolbar>

    <!-- createForm -->
    <create-form></create-form>

    <!-- updateForm -->
    <update-form></update-form>

    <!-- splitter -->
    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 100px)">

      <!-- left side -->
      <template v-slot:before>
        <q-splitter v-model="insideModel" horizontal>
          <!-- tcrItem -->
          <template v-slot:before>
            <tcr-item></tcr-item>
          </template>

          <!-- tcrData -->
          <template v-slot:after>
            <tcr-data></tcr-data>
          </template>
        </q-splitter>
      </template>

      <!-- right side -->
      <template v-slot:after>
        <!-- pageFinder -->
        <archive></archive>
      </template>
    </q-splitter>
  </q-page>
</template>

<script>
/*  README
    1 add permission 'common-reference' and assign to USER GROUP
    2 add roles in firestore.rules as follow:
    match /commonReference/{id} {
      allow read, write: if isAuthenticated()
    }
    match /dataContainer/{id} {
      allow read, write: if isAuthenticated()
    }
*/

import { ref, computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import createForm from 'src/pages/common-reference/components/createForm.vue'
import updateForm from 'src/pages/common-reference/components/updateForm.vue'

export default {
  name: 'mainNavigation.commonReference',

  components: {
    headerToolbar: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/toolbar/index.vue')),
    tcrItem: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/tcrItem.vue')),
    tcrData: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/tcrData.vue')),
    archive: defineAsyncComponent(() => import(
      'src/pages/common-reference/components/archive/index.vue')),
    createForm,
    updateForm
  },

  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()
    // --------------------------
    // getters (global variables)
    // --------------------------
    // setting
    const settings = computed(() => { return $store.getters['commonReference/getSettings'] })

    // ---------------
    // local variables
    // ---------------
    const splitterModel = ref(40)
    const insideModel = ref(60)

    const fontSize = computed(() => { return settings.value.fontSize })

    return {
      // global vars
      settings,
      // local vars
      splitterModel,
      insideModel,
      fontSize
    }
  }
}
</script>

<style>
  .customFontSize {
    font-size: v-bind(fontSize);
  }
</style>
