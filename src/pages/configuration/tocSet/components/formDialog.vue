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
            filled
            v-model="form.sequence"
            :label="$t('pageTocSet.sequence')"
            type="number"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-input
            filled
            v-model="form.name"
            :label="$t('pageTocSet.name')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-editor
            v-model="form.description"
            :placeholder="$t('pageTocSet.description')"
            min-height="5rem"
          />

          <q-select
            filled
            v-model="form.language"
            :options="opt.language"
            :label="$t('pageTocSet.language')"
            emit-value
            map-options
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-select
            filled
            v-model="form.script"
            :options="opt.script"
            :label="$t('pageTocSet.script')"
            emit-value
            map-options
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
import { reactive, watch } from 'vue'
import { db, Timestamp } from 'src/boot/firebase.js'
import { useI18n } from 'vue-i18n'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.tocSet',

  props: [
    'formAction'
  ],

  setup (props, context) {
    // collection
    const collection = db.collection('tocSet')

    // composable
    const $t = useI18n().t
    const { dialog, action, document, form, formRef, deleteAction, userName, submit } = useCrudForm(collection)

    // options variables
    const opt = reactive({
      language: [
        {
          value: 'pali',
          label: $t('system.pali')
        }
      ],
      script: [
        {
          value: 'burmese',
          label: $t('system.burmese')
        },
        {
          value: 'devanagari',
          label: $t('system.devanagari')
        },
        {
          value: 'khmer',
          label: $t('system.khmer')
        },
        {
          value: 'lanna',
          label: $t('system.lanna')
        },
        {
          value: 'laos',
          label: $t('system.laos')
        },
        {
          value: 'roman',
          label: $t('system.roman')
        },
        {
          value: 'sinhala',
          label: $t('system.sinhala')
        },
        {
          value: 'thai',
          label: $t('system.thai')
        }
      ]
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
    },
    { immediate: true }
    )

    // function initialForm
    function initialForm () {
      form.value = {
        sequence: 0,
        name: '',
        description: '',
        language: 'pali',
        script: '',
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

    return {
      dialog,
      action,
      form,
      opt,
      formRef,
      deleteAction,
      initialForm,
      submit
    }
  }
}
</script>
