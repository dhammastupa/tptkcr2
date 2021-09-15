<template>
  <div>
    <q-dialog
      v-model="form.active"
      :maximized="true"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <!-- header -->
        <form-header></form-header>

        <!-- ruler -->
        <ruler-bar
          v-if="form.ruler.active"
        >
          <template v-slot:header>
            <q-icon name="touch_app" style="font-size: 2em;"/>
          </template>
          <template v-slot:main >
            <q-range
              v-model="range"
              :min="0"
              :max="100"
              drag-range
            />
          </template>
        </ruler-bar>

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
      'src/pages/Preservation/Components/dataFormHeader.vue')),
    rulerBar: defineAsyncComponent(() => import(
      'src/pages/Preservation/Components/dataFormRulerBar.vue')),
    infoBar: defineAsyncComponent(() => import(
      'src/pages/Preservation/Components/dataFormInfoBar.vue')),
    imageScan: defineAsyncComponent(() => import(
      'src/pages/Preservation/Components/dataFormImageScan.vue')),
    textInput: defineAsyncComponent(() => import(
      'src/pages/Preservation/Components/dataFormTextInput.vue'))
  },

  setup () {
    // composable
    const $store = useStore()

    // init vars
    const range = ref({
      min: 25,
      max: 75
    })

    // getters datatable
    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    const form = computed(() => { return $store.getters['preservation/getForm'] })

    const splitterModel = ref(50)

    function hasPermission (rqPermission) {
      return $store.dispatch('auth/hasPermission', rqPermission)
    }

    return {
      splitterModel,
      range,
      form,
      datatable,
      hasPermission
    }
  }
}
</script>
