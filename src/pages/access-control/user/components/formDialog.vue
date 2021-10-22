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
          @submit="submit"
          @reset="initialForm"
          class="q-gutter-md"
        >
          <q-input
            filled readonly
            v-model="form.email"
            :label="$t('pageAccessControl.email')"
            type="email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-input
            filled
            v-model="form.firstName"
            :label="$t('pageAccessControl.firstName')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-input
            filled
            v-model="form.lastName"
            :label="$t('pageAccessControl.lastName')"
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

            <!-- submit btn -->
            <q-btn
              :label="$t('system.submit')"
              type="submit"
              color="primary"
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
  name: 'mainNavigation.accesscontrolUser',

  props: [
    'formAction'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const $q = useQuasar()
    const { dialog, action, document, form, formRef, userName } = useCrudForm()

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
        email: '',
        firstName: '',
        lastName: '',
        createdOn: Timestamp.now(),
        createdBy: userName.value,
        updatedOn: Timestamp.now(),
        updatedBy: userName.value
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
          const doc = db.collection('user').doc(form.value.uid)

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
      initialForm,
      submit
    }
  }
}
</script>
