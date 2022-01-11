<template>
  <q-dialog
    v-model="dialog"
    position="right"
    :maximized="true"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="card-dialog-500">
      <q-banner
        inline-actions
        :class="{
          'text-white': true,
          'bg-primary': action === 'update',
          'bg-secondary': action === 'add',
        }"
      >
        <q-icon v-if="action === 'add'" name="add" size="sm" />
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
            :label="$t('pageTipitakaEdition.sequence')"
            type="number"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-input
            filled
            :readonly="action === 'update'"
            v-model="form.code"
            :label="$t('pageTipitakaEdition.code')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-input
            filled
            v-model="form.name"
            :label="$t('pageTipitakaEdition.name')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-editor
            v-model="form.description"
            :placeholder="$t('pageTipitakaEdition.description')"
            min-height="5rem"
          />

          <q-input
            filled
            type="number"
            v-model="form.yearOfPublication"
            :label="$t('pageTipitakaEdition.yearOfPublication')"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('system.notValid')]"
          >
            <template v-slot:hint>
              {{ $t("pageTipitakaEdition.buddhistEra") }}
            </template>
          </q-input>

          <q-select
            filled
            v-model="form.language"
            :options="opt.language"
            :label="$t('pageTipitakaEdition.language')"
            emit-value
            map-options
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-select
            filled
            v-model="form.script"
            :options="opt.script"
            :label="$t('pageTipitakaEdition.script')"
            emit-value
            map-options
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-input
            filled
            type="number"
            v-model="form.volumes"
            :label="$t('pageTipitakaEdition.volumes')"
          />

          <q-card class="my-card">
            <q-card-section class="bg-grey-2">
              <div class="text-h6">{{ $t("pageTipitakaEdition.volume") }}</div>
            </q-card-section>

            <q-card-section v-for="(v, index) in opt.volume" :key="index">
              <div class="rounded-borders">
                <div class="q-gutter-md row items-start">
                  <q-input
                    filled
                    dense
                    style="width: 150px"
                    type="number"
                    v-model="v.number"
                    :label="$t('pageTipitakaEdition.number')"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || $t('system.requiredField'),
                    ]"
                  />
                  <q-input
                    filled
                    dense
                    style="width: 150px"
                    type="number"
                    v-model="v.totalPages"
                    :label="$t('pageTipitakaEdition.totalPages')"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || $t('system.requiredField'),
                    ]"
                  />
                </div>
                <q-input
                  filled
                  dense
                  v-model="v.name"
                  :label="$t('pageTipitakaEdition.name')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || $t('system.requiredField'),
                  ]"
                />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                @click="onAddVolume"
                flat
                round
                color="primary"
                icon="add"
              />
            </q-card-actions>
          </q-card>

          <q-input
            v-model="form.publisher"
            filled
            :label="$t('pageTipitakaEdition.publisher')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />

          <q-select
            filled
            v-model="form.country"
            :options="opt.country"
            :label="$t('pageTipitakaEdition.country')"
            emit-value
            map-options
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />
          <q-field
            v-if="action === 'add'"
            disable
            filled
            :label="$t('system.createdOn')"
            stack-label
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ $filters.timeStampToDate(form.createdOn) }}
              </div>
            </template>
          </q-field>
          <q-input
            v-if="action === 'add'"
            disable
            v-model="form.createdBy"
            filled
            :label="$t('system.createdBy')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />
          <q-field
            v-if="action === 'update'"
            disable
            filled
            :label="$t('system.updatedOn')"
            stack-label
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ $filters.timeStampToDate(form.updatedOn) }}
              </div>
            </template>
          </q-field>
          <q-input
            v-if="action === 'update'"
            disable
            v-model="form.updatedBy"
            filled
            :label="$t('system.updatedBy')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('system.requiredField'),
            ]"
          />
          <div align="right">
            <q-checkbox
              v-if="action === 'update'"
              v-model="deleteAction"
              :label="$t('system.checkToDelete')"
              class="q-pr-lg"
              color="red"
              keep-color
            />

            <!-- submit btn -->
            <q-btn :label="$t('system.submit')" type="submit" color="primary" />

            <!-- reset btn -->
            <q-btn
              v-if="action === 'add'"
              :label="$t('system.reset')"
              type="reset"
              color="primary"
              flat
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
import { createDoc, updateDoc, deleteDoc } from 'src/functions/manage-data.js'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.tipitakaEdition',

  props: ['formAction'],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const $q = useQuasar()
    const { dialog, action, document, form, formRef, deleteAction, userName } =
      useCrudForm()

    // optons variables
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
      ],
      country: [
        {
          value: 'thai',
          label: $t('system.thai')
        },
        {
          value: 'sriLanka',
          label: $t('system.sriLanka')
        },
        {
          value: 'myanmar',
          label: $t('system.myanmar')
        }
      ],
      volume: [
        {
          number: '',
          name: '',
          totalPages: ''
        }
      ]
    })

    watch(
      props,
      function () {
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
        code: '',
        name: '',
        description: '',
        yearOfPublication: '',
        language: 'pali',
        script: '',
        volumes: '',
        volume: [
          {
            number: '',
            name: '',
            totalPages: ''
          }
        ],
        publisher: '',
        country: '',
        createdOn: Timestamp.now(),
        createdBy: userName.value,
        updatedOn: Timestamp.now(),
        updatedBy: userName.value
      }
      opt.volume = [
        {
          number: '',
          name: '',
          totalPages: ''
        }
      ]
    }

    // function openForm
    function openForm (document) {
      initialForm()
      form.value = document
      if (document.volume) {
        opt.volume = document.volume
      }
    }

    // function onAddVolume
    function onAddVolume () {
      opt.volume.push({
        number: '',
        name: '',
        totalPages: ''
      })
    }

    function submit () {
      // update form before save data
      form.value.volume = opt.volume
      form.value.updatedOn = Timestamp.now()
      form.value.updatedBy = userName.value
      formRef.value.validate().then((success) => {
        if (success) {
          // create
          if (action.value === 'add') {
            const newDoc = db
              .collection('tipitakaEdition')
              .doc(form.value.code)
            const newDocId = newDoc.id
            const data = { ...{ docId: newDocId }, ...form.value }
            createDoc(newDoc, { ...data })
              .then(() => {
                $q.notify({
                  icon: 'done',
                  color: 'positive',
                  message: $t('system.success')
                })
                dialog.value = false
                initialForm()
              })
              .catch((error) => {
                $q.notify({
                  icon: 'error',
                  color: 'negative',
                  message: $t('system.error')
                })
                console.log(error.code)
              })
            // update
          } else if (action.value === 'update') {
            const doc = db.collection('tipitakaEdition').doc(form.value.docId)
            // in case want to delete document
            if (deleteAction.value === true) {
              $q.dialog({
                title: $t('system.confirm'),
                message: $t('system.confirmToDelete'),
                cancel: true,
                persistent: true
              })
                .onOk(() => {
                  deleteDoc(doc)
                    .then(() => {
                      deleteAction.value = false
                      dialog.value = false
                    })
                    .catch((error) => {
                      $q.notify({
                        icon: 'error',
                        color: 'negative',
                        message: $t('system.error')
                      })
                      console.log(error)
                    })
                })
                .onOk(() => {
                  console.log('>>>> second OK catcher')
                })
                .onCancel(() => {
                  console.log('>>>> Cancel')
                })
                .onDismiss(() => {
                  console.log('I am triggered on both OK and Cancel')
                })
            } else {
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
            } // end check update/delete doc
          } // end check form action
        } // end form valid
      }) // end form validate
    }

    return {
      dialog,
      action,
      form,
      opt,
      formRef,
      deleteAction,
      initialForm,
      onAddVolume,
      submit
    }
  }
}
</script>
