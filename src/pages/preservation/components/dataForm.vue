<template>
  <div>
    <q-dialog
      v-model="form.active"
      :maximized="true"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <!------------>
        <!-- header -->
        <!------------>
        <form-header></form-header>

        <q-separator />

        <!----------->
        <!-- ruler -->
        <!----------->
        <ruler-bar
          :rulerActive="form.ruler.active"
        ></ruler-bar>

        <!---------------------->
        <!-- form -------------->
        <!---------------------->
        <q-card-section>
          <!-- form -->
          <q-form
            ref="formRef"
            class="q-gutter-md"
          >
            <!-- info: edition / volumeNumber / pageNumber -->
            <info-bar></info-bar>

            <!-- digitizing -------->
            <div class="ro q-py-lg">
              <div class="col-12">
                <q-splitter v-model="splitterModel">

                  <!-- image scan -->
                  <template v-slot:before>
                    <image-scan></image-scan>
                  </template>
                  <!-- text -->

                  <template v-slot:after>
                    <text-input></text-input>
                  </template>

                </q-splitter>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-section>
          {{ $t('system.updatedOn') }} : {{ $filters.timeStampToDate(datatable.selectedRow.updatedOn) }}
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'system.update',

  components: {
    FormHeader: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataFormHeader.vue')),
    infoBar: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataFormInfoBar.vue')),
    rulerBar: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataFormRulerBar.vue')),
    imageScan: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataFormImageScan.vue')),
    textInput: defineAsyncComponent(() => import(
      'src/pages/preservation/components/dataFormTextInput.vue'))
  },

  setup () {
    // composable
    const $store = useStore()

    // getters datatable
    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    const form = computed(() => { return $store.getters['preservation/getForm'] })

    const splitterModel = ref(50)

    function hasPermission (rqPermission) {
      return $store.dispatch('auth/hasPermission', rqPermission)
    }

    return {
      splitterModel,
      form,
      datatable,
      hasPermission
    }
  }
}
</script>

<style scoped>
</style>
