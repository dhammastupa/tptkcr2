<template>
  <q-dialog
    v-model="dataForm.updateForm"
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

        {{ $t('mainNavigation.commonReference') }} {{ commonToc.selectedRow.label }}

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
            ref="formTopicRef"
            filled autofocus
            v-model="inputForm"
            :label="$t('pageCommonToc.topic')"
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
import { db, Timestamp } from 'src/boot/firebase.js'
import { updateDoc } from 'src/functions/manage-data.js'
import useLogMeritMaking from 'src/hooks/merit-making.js'

export default {

  setup () {
    // composable
    const $store = useStore()

    // getters userName
    const userID = computed(() => { return $store.getters['auth/uid'] })

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // getters dataForm
    const dataForm = computed(() => { return $store.getters['commonToc/getForm'] })

    // getters commonToc
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // init vars
    const collection = db.collection('commonToc')
    const formRef = ref(null)
    const formTopicRef = ref(null)

    // inputForm
    const inputForm = ref('')
    watch(commonToc.value, function () {
      if (commonToc.value.selectedRow) {
        inputForm.value = commonToc.value.selectedRow.label
      }
    })

    // function closeForm
    function closeForm () {
      $store.commit('commonToc/setForm', {
        createForm: false,
        updateForm: false
      })
    }

    // function submit
    async function submit () {
      formRef.value.validate().then(success => {
        if (success) {
          const data = {
            label: inputForm.value,
            // log
            updatedOn: Timestamp.now(),
            updatedBy: userName.value
          }
          updateDoc(collection.doc(commonToc.value.selected), { ...data }).then(() => {
            useLogMeritMaking(
              'commonToc',
              { ...data },
              'updateToc',
              userID.value,
              userName.value
            )
          })
          closeForm()
        } else {
          console.log('error')
        }
      })
    }

    return {
      userName,
      dataForm,
      commonToc,
      inputForm,
      formRef,
      formTopicRef,
      closeForm,
      submit
    }
  }
}

</script>
