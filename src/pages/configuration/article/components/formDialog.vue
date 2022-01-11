<template>
  <q-dialog
    v-model="dialog"
    position="right"
    :maximized="true"
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="card-dialog-max">
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
          @submit="submit(form.docId)"
          @reset="initialForm"
          class="q-gutter-md"
        >
          <q-input
            filled disable
            v-model="form.sequence"
            :label="$t('pageArticle.sequence')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-input
            filled
            v-model="form.title"
            :label="$t('pageArticle.title')"
            lazy-rules
            :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
          />

          <q-select
            v-model="form.taxonomy"
            :label="$t('pageArticle.taxonomy')"
            filled use-input use-chips multiple
            input-debounce="0"
            :options="filterOptions"
            @filter="filterFn"
          />

          <q-editor
            v-model="form.body"
            :placeholder="$t('pageArticle.body')"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource']
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana'
            }"
            min-height="5rem"
          />

          <q-date
            v-model="form.publishedOn"
            :title="$t('pageArticle.publishedOn')"
            color="deep-purple-3"
            multiple
            lazy-rules
            class="justify-center"
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
import { ref, watch } from 'vue'
import { db, Timestamp } from 'src/boot/firebase.js'
import { date } from 'quasar'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.article',

  props: [
    'formAction'
  ],

  setup (props, context) {
    // collection
    const collection = db.collection('article')

    // composable
    const { dialog, action, document, form, formRef, deleteAction, userName, submit } = useCrudForm(collection)

    // local variables
    const stringOptions = [
      'ความรู้เรื่องพระไตรปิฎก',
      'ข้อความน่ารู้จากพระไตรปิฎก',
      'ความย่อแห่งพระไตรปิฎก'
    ]
    const filterOptions = ref(stringOptions)

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
        sequence: parseInt(date.formatDate(Date.now(), 'x')),
        title: '',
        taxonomy: [],
        body: '',
        publishedOn: [],
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

    // function fulterFn
    function filterFn (val, update) {
      update(() => {
        if (val === '') {
          filterOptions.value = stringOptions
        } else {
          const needle = val.toLowerCase()
          filterOptions.value = stringOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
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
      submit,
      filterOptions,
      filterFn
    }
  }
}
</script>
