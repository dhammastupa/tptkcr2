<template>
  <q-dialog
    v-model="form.update"
    position="right"
    :maximized="true"
    persistent
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="card-dialog-500">
      <q-banner inline-actions
        class="text-white bg-primary">
        <q-icon name="edit_note" size="sm" />

        {{ $t('mainNavigation.commonReference') }} {{ tcrItem.selectedTcrItemRow.label }}

        <template v-slot:action>
          <q-btn
            round flat icon="close"
            @click="closeForm"
          >
          </q-btn>
        </template>
      </q-banner>

      <q-card-section>
        <q-form
          ref="formRef"
          @submit="submit"
          class="q-gutter-md"
        >
          <q-input
            filled autofocus
            v-model="inputForm.label"
            :label="$t('pageCommonReference.topic')"
            lazy-rules
            :rules="[
              val =>
                (val && val.length > 0) || $t('system.requiredField')
            ]"
          />

          <div align="right">
            <q-btn
              :label="$t('system.submit')"
              type="submit"
              color="primary" />
          </div>
        </q-form>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { updateDoc } from 'src/functions/manage-data.js'
import { db, Timestamp } from 'src/boot/firebase.js'
import useLogMeritMaking from 'src/hooks/merit-making.js'

export default {

  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // --------------------------
    // getters (global variables)
    // --------------------------
    // form
    const form = computed(() => { return $store.getters['commonReference/getForm'] })
    // tcrItem
    const tcrItem = computed(() => { return $store.getters['commonReference/getTcrItem'] })
    // userName
    const userName = computed(() => { return $store.getters['auth/userName'] })
    // uid
    const userID = computed(() => { return $store.getters['auth/uid'] })

    // ---------------
    // local variables
    // ---------------
    const formRef = ref(null)
    const inputForm = ref({
      label: ''
    })
    watch(tcrItem.value, function () {
      if (tcrItem.value.selectedTcrItemRow) {
        inputForm.value.label = tcrItem.value.selectedTcrItemRow.label
      }
    })

    // function closeForm
    function closeForm () { $store.commit('commonReference/setFormUpdate', false) }

    // function submit
    function submit () {
      formRef.value.validate().then(async success => {
        if (success) {
          const data = {
            label: inputForm.value.label,
            // log
            updatedOn: Timestamp.now(),
            updatedBy: userName.value
          }
          await updateDoc(
            db.collection('tcrItem').doc(tcrItem.value.selectedTcrItem),
            { ...data }
          )
          $store.commit('commonReference/setUpdateTreeAfterUpdate', true)
          useLogMeritMaking(
            'tcrItem',
            { ...data },
            'updateTcr',
            userID.value,
            userName.value
          )
          closeForm()
        }
      })
    }

    return {
      // global vars
      form,
      tcrItem,
      // local vars
      formRef,
      inputForm,
      // function
      closeForm,
      submit
    }
  }
}
</script>
