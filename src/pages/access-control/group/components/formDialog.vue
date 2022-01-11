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
          'bg-secondary': action==='add',
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
          @submit="submit(form.role)"
          @reset="initialForm"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="form.role"
            :label="$t('pageAccessControl.role')"
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

          <q-select
            filled multiple use-chips
            v-model="form.permission"
            :options="permissionOption"
            :label="$t('pageAccessControl.permissionList')"
          />

          <q-select
            filled multiple use-chips
            v-model="form.user"
            :options="userOption"
            :label="$t('pageAccessControl.userList')"
            emit-value
            map-options
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
import { ref, watch } from 'vue'
import { db, Timestamp } from 'src/boot/firebase.js'
import { getPromiseDocs } from 'src/functions/manage-data.js'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.accesscontrolGroup',

  props: [
    'formAction'
  ],

  setup (props, context) {
    // collection
    const collection = db.collection('group')

    // composable
    const { dialog, action, document, form, formRef, deleteAction, userName, submit } = useCrudForm(collection)

    // variables
    const userOption = ref([])
    const permissionOption = ref([])
    // user(s) for selction
    getPromiseDocs(db.collection('user').orderBy('email', 'asc')).then(user => {
      user.forEach(element => {
        userOption.value.push({
          value: element.uid,
          label: element.email
        })
      })
    })
    // permission(s) for selction
    getPromiseDocs(db.collection('permission').orderBy('permission', 'asc')).then(permission => {
      permission.forEach(element => {
        permissionOption.value.push(element.permission)
      })
    })

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
        role: '',
        description: '',
        user: [],
        permission: [],
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

    return {
      userOption,
      permissionOption,
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
