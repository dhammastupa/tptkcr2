<template>
  <div class="col q-pa-sm">{{$t('pageTipitakaPreservation.text')}}</div>
  <q-banner inline-actions class="bg-grey-3">

    <!-- font size -->
    <q-select
      v-model="fontSize" dense
      :options="['14px', '15px', '16px', '17px', '18px']"
      style="width: 90px;"
      :label="$t('system.fontSize')" />

    <template v-slot:action>
      <div class="q-gutter">
        <!-- remove extra space -->
        <q-btn
          flat round
          icon="margin"
          :disable="proofreadRef"
          @click="removeExtraSpace"
        >
          <q-tooltip>
            {{ $t('pageTipitakaPreservation.removeExtraSpace') }}
          </q-tooltip>
        </q-btn>
        <!-- proofread -->
        <q-toggle
          v-if="useHasPermission('tipitaka-proofread')"
          v-model="proofreadRef"
          checked-icon="check"
          color="red"
          unchecked-icon="clear"
          @update:model-value="proofread"
        >
          <q-tooltip>
            {{ $t('pageTipitakaPreservation.proofread') }}
          </q-tooltip>
        </q-toggle>
        <!-- delete record -->
        <q-btn
          v-if="useHasPermission('tipitaka-deleteAction')"
          flat round
          icon="delete"
          color="red"
          :disable="proofreadRef"
          @click="deleteRecord"
        >
          <q-tooltip>
            {{ $t('system.deleteRecord') }}
          </q-tooltip>
        </q-btn>
        <!-- save record -->
        <q-btn
          flat round
          icon="save"
          :disable="proofreadRef"
          @click="submit"
        >
          <q-tooltip>
            {{ $t('system.saveRecord') }}
          </q-tooltip>
        </q-btn>
      </div>
    </template>
  </q-banner>

  <div class="q-pa-md q-gutter-sm">
    <!-- first line control -->
    <q-slider
      v-model="firstLine"
      @change="val => { firstLine = val }"
      :min="form.editor.firstLine.min"
      :max="form.editor.firstLine.max"
      :step="form.editor.firstLine.step"
      :color="form.editor.firstLine.color"
      :label-value="$t('pageTipitakaPreservation.firstLine') +': ' + firstLine + 'px'"
      label-always
    />

    <!-- editor -->
    <prism-editor
      v-model="textRef"
      class="editor"
      :style="style"
      :highlight="highlighter"
      :line-numbers="true"
      :readonly="proofreadRef"
    >
    </prism-editor>

    <!-- line height -->
    <q-slider
      v-model="lineHeight"
      @change="val => { lineHeight = val }"
      :min="form.editor.lineHeight.min"
      :max="form.editor.lineHeight.max"
      :step="form.editor.lineHeight.step"
      :color="form.editor.lineHeight.color"
      :label-value="$t('pageTipitakaPreservation.lineSpacing') +': ' + lineHeight + 'px'"
      label-always
    />

    <!-- note -->
    <div class="q-py-md">{{ $t('system.note') }}</div>
    <q-editor v-model="noteRef" min-height="5rem" />
  </div>
</template>

<script>
import _ from 'lodash'
import { useStore } from 'vuex'
import useHasPermission from 'src/hooks/has-permission.js'
import { db, storage, Timestamp } from 'src/boot/firebase.js'
import { updateDoc, deleteDoc } from 'src/functions/manage-data.js'
import { ref, computed, watch } from 'vue'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import { useQuasar, format } from 'quasar'
import { useI18n } from 'vue-i18n'

const { pad } = format

export default {
  components: {
    PrismEditor
  },

  setup () {
    // ----------
    // composable
    // ----------
    const $store = useStore()
    const $t = useI18n().t
    const $q = useQuasar()

    // -------
    // getters
    // -------
    // getters datatable
    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    // getters selectedRow
    const selectedRow = computed(() => { return $store.getters['preservation/getSelectedRow'] })

    // getters form
    const form = computed(() => { return $store.getters['preservation/getForm'] })

    // getters authInfo
    const authInfo = computed(() => { return $store.getters['auth/authInfo'] })

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // ----------
    // input vars
    // ----------
    const data = ref({}) // for submit data
    const textRef = ref(selectedRow.value.text) // textbox field show in editor
    const noteRef = ref(selectedRow.value.note) // note field
    const proofreadRef = ref(selectedRow.value.proofread) // proofread field

    // --------------
    // slider control
    // --------------
    const firstLine = ref(0) // first line ref
    const lineHeight = ref(0) // line height ref
    const modifyFirstLine = ref(false) // modify firstLine flag ref
    const modifyLineHeight = ref(false) // modify lineHeight flag ref

    // watch slider firstLine / lineHeight change
    watch(firstLine, function () {
      updateData()
      softSubmit()
    })
    watch(lineHeight, function () {
      // change line height for line number
      const all = document.getElementsByClassName('prism-editor__line-numbers')
      for (let i = 0; i < all.length; i++) {
        all[i].style['line-height'] = lineHeight.value + 'px'
      }
      updateData()
      softSubmit()
    })

    // -----------------------------------
    // personnel setting ref get from data
    // -----------------------------------
    const ps = computed(() => {
      return _.find(
        selectedRow.value.personalSetting,
        ['uid', authInfo.value.uid]
      )
    })
    // watch personnel setting ref change
    watch(ps, function () {
      console.log('ps change')
      setSlider()
    })

    // -------------
    // font size ref
    // -------------
    const fontSize = ref(form.value.editor.fontSize)
    // watch fontSize change
    watch(fontSize, function () {
      $store.commit(
        'preservation/setFontSize',
        fontSize.value
      )
    })

    // -------------
    // editor style config
    // -------------
    const style = computed(() => {
      const result = {
        fontSize: form.value.editor.fontSize,
        lineHeight: lineHeight.value + 'px',
        padding: form.value.editor.padding,
        paddingTop: firstLine.value + 'px',
        paddingBottom: form.value.editor.paddingBottom
      }
      return result
    })

    watch(selectedRow, function () {
      textRef.value = selectedRow.value.text
      noteRef.value = selectedRow.value.note
      proofreadRef.value = selectedRow.value.proofread
    })

    watch([textRef, noteRef, proofreadRef], function () {
      updateData()
    })

    // initial updateData
    // ------------------
    setSlider()
    updateData()

    // -----------------------------------------
    // function set slider
    // -----------------------------------------
    function setSlider () {
      if (ps.value) {
        if (!modifyFirstLine.value) {
          firstLine.value = ps.value.paddingTop
        } else {
          firstLine.value = form.value.editor.firstLine.initial
        }
        if (!modifyLineHeight.value) {
          lineHeight.value = ps.value.lineHeight
        } else {
          lineHeight.value = form.value.editor.lineHeight.initial
        }
      } else {
        firstLine.value = form.value.editor.firstLine.initial
        lineHeight.value = form.value.editor.lineHeight.initial
      }
    }

    // --------------------
    // function PrismEditor
    // --------------------
    function highlighter (textRef) {
      return highlight(textRef, languages.plaintext)
    }

    // ---------------------------
    // function remove extra space
    // ---------------------------
    function removeExtraSpace () {
      const textTrimmed = textRef.value.replace(/^\s*$(?:\r\n?|\n)/gm, '')
      const splitLines = _.without(_.split(textTrimmed, '\n'), '')
      const removeExtraSpaceArray = []
      splitLines.forEach(eachLine => {
        removeExtraSpaceArray.push(eachLine.replace(/\s+/g, ' ').trim())
      })
      textRef.value = _.join(removeExtraSpaceArray, '\n')
      console.log()
    }

    // -----------------------------------------
    // function proofread create/delete wordList
    // -----------------------------------------
    function proofread (value, evt) {
      removeExtraSpace()
      $q.dialog({
        title: $t('system.confirm'),
        message: proofreadRef.value ? $t('pageTipitakaPreservation.confirmToCreateWrodlist') : $t('pageTipitakaPreservation.confirmToRemoveWrodlist'),
        persistent: true,
        ok: {
          flat: true,
          color: 'negative',
          label: $t('system.confirm')
        },
        cancel: {
          flat: true,
          color: 'secondary',
          label: $t('system.cancel')
        }
      }).onOk(() => {
        if (value) {
          createWordList()
        } else {
          removeWordList()
        }
        submit()
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        proofreadRef.value = !proofreadRef.value
      })
    }

    // ------------------------
    // function create WordList
    // ------------------------
    function createWordList () {
      console.log('createWordList')
      if (textRef.value) {
        const batch = db.batch()
        const lines = textRef.value.split('\n')
        let lineNumber = 0
        let wordNumber = 0
        lines.forEach(line => {
          lineNumber++
          const words = line.split(' ')
          words.forEach(word => {
            wordNumber++
            const newDoc = db.collection('wordList').doc()
            batch.set(
              db.collection('wordList').doc(newDoc.id), {
                id: newDoc.id,
                word: word,
                lineNumber: lineNumber,
                wordNumber: wordNumber,
                // reference
                tipitakaReference: db.collection('tipitaka').doc(`${selectedRow.value.id}`),
                tipitakaRecordId: selectedRow.value.id,
                tipitakaEdition: selectedRow.value.tipitakaEdition,
                volumeNumber: selectedRow.value.volumeNumber,
                pageNumber: selectedRow.value.pageNumber,
                imageReference: selectedRow.value.imageReference,
                wordIndex: `${selectedRow.value.tipitakaEdition}-${pad(selectedRow.value.volumeNumber, 3)}-${pad(selectedRow.value.pageNumber, 4)}-${pad(wordNumber, 3)}`
              }
            )
          })
        })
        batch.commit().then(() => {
          console.log('commited')
        })
      }
    }

    // ------------------------
    // function remove WordList
    // ------------------------
    function removeWordList () {
      console.log('removeWordList')
      const batch = db.batch()
      db.collection('wordList')
        .where('tipitakaRecordId', '==', selectedRow.value.id)
        .get()
        .then(docs => {
          docs.forEach((doc) => {
            batch.delete(db.collection('wordList').doc(doc.id))
          })
          batch.commit().then(() => {
            console.log('commited')
          })
        })
    }

    // ----------------------
    // function delete record
    // ----------------------
    function deleteRecord () {
      $q.dialog({
        title: $t('system.confirm'),
        message: $t('system.confirmToDelete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('>>>> OK')
        // delete image
        // Create a reference to the file to delete
        const desertRef = storage.ref().child(selectedRow.value.imageReference)
        // Delete the file
        desertRef.delete()
          .then(() => {
            console.log('deleted image')
          }).catch((error) => {
            console.log(error.code)
          })
        // delete record
        const doc = db.collection('tipitaka').doc(selectedRow.value.id)
        deleteDoc(doc)
          .then(() => {
            $q.notify({
              icon: 'done',
              color: 'positive',
              message: $t('system.success')
            })
            $store.commit(
              'preservation/setDataForm',
              {
                active: false
              }
            )
          }).catch((error) => {
            $q.notify({
              icon: 'error',
              color: 'negative',
              message: $t('system.error')
            })
            console.log(error.code)
          })
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    }

    // -------------------
    // function updateData
    // -------------------
    function updateData () {
      const ps = []
      if (selectedRow.value.personalSetting.length) {
        selectedRow.value.personalSetting.forEach(item => {
          if (item.uid === authInfo.value.uid) {
            ps.push({
              lineHeight: lineHeight.value,
              paddingTop: firstLine.value,
              uid: authInfo.value.uid
            })
          } else {
            ps.push({ ...item })
          }
        })
      } else {
        ps.push({
          lineHeight: lineHeight.value,
          paddingTop: firstLine.value,
          uid: authInfo.value.uid
        })
      }
      data.value = {
        id: selectedRow.value.id,
        text: textRef.value,
        note: noteRef.value,
        proofread: proofreadRef.value,
        personalSetting: ps,
        updatedBy: userName.value,
        updatedOn: Timestamp.now()
      }
      $store.commit(
        'preservation/setUpdateData',
        data.value
      )
    }

    // --------------------
    // function submit data
    // --------------------
    async function submit () {
      const data = datatable.value.updateData
      const doc = db.collection('tipitaka').doc(data.id)
      await updateDoc(doc, data)
        .then(() => {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
        })
        .catch((error) => {
          $q.notify({
            icon: 'error',
            color: 'negative',
            message: $t('system.error')
          })
          console.log(error.code)
        })
    }

    // --------------------
    // function softSubmit data
    // --------------------
    async function softSubmit () {
      const data = datatable.value.updateData
      const doc = db.collection('tipitaka').doc(data.id)
      await updateDoc(doc, {
        personalSetting: data.personalSetting
      })
    }

    // ------
    // return
    // ------
    return {
      // getters
      selectedRow,
      form,
      // variable
      ps,
      style,
      firstLine,
      lineHeight,
      fontSize,
      textRef,
      noteRef,
      proofreadRef,
      // function
      highlighter,
      useHasPermission,
      removeExtraSpace,
      proofread,
      deleteRecord,
      submit
    }
  }
}
</script>

<style>
  /* required class */
  .editor-night {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #2d2d2d;
    color: #ccc;
    word-spacing: 1em;
  }

  .editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: white;
    color: black;
    /* letter-spacing: 1px; */
    word-spacing: 1em;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea {
    width: 999px !important;
    word-spacing: 1em;
  }
  .prism-editor__textarea:focus {
    outline: none;
    word-spacing: 1em;
  }
  .prism-editor__editor {
    white-space: pre !important;
    word-spacing: 1em;
  }
  .prism-editor__container {
    overflow-x: scroll !important;
  }
</style>
