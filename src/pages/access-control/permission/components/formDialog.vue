<template>
  <q-dialog
    v-model="dialog"
    position="right"
    :maximized="true"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="card-dialog-500">
      <q-banner inline-actions
        :class="{
          'text-white': true,
          'bg-primary': action==='update',
          'bg-secondary': action==='add'
        }">

        <q-icon v-if="action==='add'" name="add" size="sm" />
        <q-icon v-else name="drive_file_rename_outline" size="sm" />

        {{ $t($options.name) }}

        <template v-slot:action>
          <q-btn dense flat icon="close" v-close-popup />
        </template>
      </q-banner>

      <q-card-section>
        <q-form
          ref="formRef"
          @submit="submit(form.permission)"
          @reset="initialForm"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="form.permission"
            :label="$t('pageAccessControl.permission')"
            :readonly="action == 'update'"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-input
            filled
            v-model="form.description"
            :label="$t('pageAccessControl.description')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-field
            v-if="action==='add'" disable
            filled :label="$t('system.createdOn')" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ $filters.timeStampToDate(form.createdOn) }}
              </div>
            </template>
          </q-field>

          <q-input
            v-if="action==='add'" disable
            v-model="form.createdBy"
            filled
            :label="$t('system.createdBy')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-field
            v-if="action==='update'" disable
            filled :label="$t('system.updatedOn')" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ $filters.timeStampToDate(form.updatedOn) }}
              </div>
            </template>
          </q-field>

          <q-input
            v-if="action==='update'" disable
            v-model="form.updatedBy"
            filled
            :label="$t('system.updatedBy')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <div align="right">
            <q-checkbox
              v-if="action==='update'"
              v-model="deleteAction"
              :label="$t('system.checkToDelete')"
              class="q-pr-lg"
              color="red" keep-color
            />

            <!-- submit btn -->
            <q-btn
              :label="$t('system.submit')"
              type="submit"
              color="primary"
            />

            <!-- reset btn -->
            <q-btn
              v-if="action==='add'"
              :label="$t('system.reset')"
              type="reset"
              color="primary" flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { watch } from 'vue'
import { db, Timestamp } from 'src/boot/firebase.js'
import { updateDoc } from 'src/functions/manage-data.js'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.accesscontrolPermission',

  props: [
    'formAction'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const $q = useQuasar()
    const { dialog, action, document, form, formRef, deleteAction, userName } = useCrudForm()

    watch(props, function () {
      dialog.value = props.formAction.openDialog
      action.value = props.formAction.action
      document.value = props.formAction.document
      // check form action
      if (action.value === 'add') {
        initialForm()
      } else if (action.value === 'update') {
        openForm(document.value)
      }
    }, { immediate: true })

    // function initialForm
    function initialForm () {
      form.value = {
        permission: '',
        description: '',
        createdOn: Timestamp.now(),
        createdBy: userName,
        updatedOn: Timestamp.now(),
        updatedBy: userName
      }
    }

    // function openForm
    function openForm (document) {
      initialForm()
      form.value = document
    }

    function submit () {
      // update form before save data
      form.value.updatedOn = Timestamp.now()
      form.value.updatedBy = userName.value
      formRef.value.validate().then(success => {
        if (success) {
          const doc = db.collection('permission').doc(form.value.permission)

          // update document
          updateDoc(doc, { ...form.value })
            .then(() => {
              $q.notify({
                icon: 'done',
                color: 'positive',
                message: $t('system.success')
              })
              dialog.value = false
            })
            .catch((error) => {
              $q.notify({
                icon: 'error',
                color: 'negative',
                message: $t('system.error')
              })
              console.log(error.code)
            }) // end update doc
        }
      })
    }

    return {
      dialog,
      action,
      form,
      formRef,
      deleteAction,
      initialForm,
      submit
    }
  }
}
</script>
