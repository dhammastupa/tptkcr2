<template>
  <div class="col q-pa-sm">{{$t('pageTipitakaPreservation.text')}}</div>
  <q-banner inline-actions class="bg-grey-3">
    <!--------------->
    <!-- font size -->
    <!--------------->
    <q-select
      v-model="fontSize" dense
      :options="['14px', '15px', '16px', '17px', '18px']"
      :label="$t('system.fontSize')"
      style="width: 100px"
    />

    <!----------------->
    <!-- actoin slot -->
    <!----------------->
    <template v-slot:action>
      <div class="q-gutter">
        <!-- floatingControl -->
        <q-btn
          flat round
          icon="tune"
          :color="controlPanel ? 'purple' : 'black'"
          @click="controlPanel = !controlPanel"
          >
          <q-tooltip>
            {{ $t('pageTipitakaPreservation.lineControlPanel') }}
          </q-tooltip>
        </q-btn>
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

  <!------------------------>
  <!-- line control panel -->
  <!------------------------>
  <div class="q-pa-md">
    <div
      v-if="controlPanel"
      v-draggable="{ axis: 'y', positionOffset: {x: 45, y: -20} }"
      style="width:80%"
      class="z-top absolute"
    >
      <q-card>
        <q-card-section style="cursor: pointer" class="bg-grey-11">
          <div class="row items-center no-wrap">
            <div class="col">
              <div>{{ $t('pageTipitakaPreservation.lineControlPanel') }}</div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="close" @click="controlPanel = !controlPanel" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
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
            class="q-mt-xl"
          />
        </q-card-section>
      </q-card>
    </div>

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

    <q-splitter
      v-model="splitterModel"
      disable
      unit="px"
    >
      <!-- lineNumber -->
      <template v-slot:before>
        <ol
          :style="{
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            margin: '0px',
            paddingTop: style.paddingTop
          }"
        >
          <li v-for="i in lineCount" :key="i" />
        </ol>
      </template>

      <!-- editor -->
      <template v-slot:after>
        <q-input
          type="textarea"
          v-model="textRef"
          :readonly="proofreadRef"
          wrap="off" bottom-slots
          :input-style="style"
          style="overflow-y: hidden"
        >
          <template v-slot:hint>
            {{ wordCount }}
            <img style="height: 12px" src="~assets/system-images/buddha-statue.png"/>
          </template>
        </q-input>
      </template>
    </q-splitter>

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
      class="q-mt-xl"
    />

    <!-- note -->
    <div class="q-py-md">{{ $t('system.note') }}</div>
    <q-editor v-model="noteRef" min-height="5rem" />
  </div>
</template>

<script>
import _ from 'lodash'
import { useStore } from 'vuex'
import { db, storage, Timestamp } from 'src/boot/firebase.js'
import { updateDoc, deleteDoc, getPromiseDocs } from 'src/functions/manage-data.js'
import { ref, computed, watch } from 'vue'
import { useQuasar, format } from 'quasar'
import { useI18n } from 'vue-i18n'
import useHasPermission from 'src/hooks/has-permission.js'
import useLogMeritMaking from 'src/hooks/merit-making.js'

const { pad } = format

export default {
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

    // getters uid
    const userID = computed(() => { return $store.getters['auth/uid'] })

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
    // all control
    // --------------
    const controlPanel = ref(false)
    const splitterModel = ref(40) // spliter for show line number start at 150px
    const firstLine = ref(0) // first line ref
    const lineHeight = ref(1) // line height ref
    // text area height
    const textAreaHeight = computed(() => {
      return firstLine.value + (_.split(textRef.value, '\n').length * lineHeight.value) + 100
    })
    const modifyFirstLine = ref(false) // modify firstLine flag ref
    const modifyLineHeight = ref(false) // modify lineHeight flag ref
    // line count
    const lineCount = computed(() => {
      const textTrimmed = textRef.value.replace(/^\s*$(?:\r\n?|\n)/gm, '')
      const splitLines = _.without(_.split(textTrimmed, '\n'), '')
      return splitLines.length
    })
    // word count
    const wordCount = computed(() => {
      let wordCount = 0
      const textTrimmed = textRef.value.replace(/^\s*$(?:\r\n?|\n)/gm, '')
      const splitLines = _.without(_.split(textTrimmed, '\n'), '')
      const removeExtraSpace = []
      splitLines.forEach(eachLine => {
        removeExtraSpace.push(eachLine.replace(/\s+/g, ' ').trim())
      })
      removeExtraSpace.forEach(eachLine => {
        wordCount += _.split(eachLine, ' ').length
      })
      return `${wordCount} ${$t('pageTipitakaPreservation.words')}`
    })

    // ------------------------------
    // watch slider firstLine change
    // ------------------------------
    watch(firstLine, function () {
      updateData()
      softSubmit()
    })

    // ------------------------------
    // watch slider lineHeight change
    // ------------------------------
    watch(lineHeight, function () {
      // change line height for line number
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

    // -------------------
    // editor style config
    // -------------------
    const style = computed(() => {
      const result = {
        fontSize: form.value.editor.fontSize,
        lineHeight: lineHeight.value + 'px',
        padding: form.value.editor.padding,
        paddingTop: firstLine.value + 'px',
        paddingBottom: form.value.editor.paddingBottom,
        wordSpacing: '1em',
        height: textAreaHeight.value + 'px'
      }
      return result
    })

    // -----------
    // selectedRow
    // -----------
    watch(selectedRow, function () {
      textRef.value = selectedRow.value.text
      noteRef.value = selectedRow.value.note
      proofreadRef.value = selectedRow.value.proofread
    })

    // ------------------
    // warch and reactive
    // ------------------
    watch([textRef, noteRef, proofreadRef], function () {
      updateData()
    })

    // ------------------
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
    }

    // -----------------------------------------------
    // $$ function proofread create/delete WordList $$
    // -----------------------------------------------
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
          // create WordList & // logging
          createWordList()
          useLogMeritMaking(
            'tipitaka',
            selectedRow.value,
            'createWordList',
            userID.value,
            userName.value
          )
        } else {
          // remvoe WordList & // logging
          removeWordList()
          useLogMeritMaking(
            'tipitaka',
            selectedRow.value,
            'removeWordList',
            userID.value,
            userName.value
          )
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
        let reference = []
        lines.forEach(line => {
          lineNumber++
          const words = line.split(' ')
          words.forEach(word => {
            const newDoc = db.collection('wordList').doc()
            switch (word.charAt(0)) {
              case ('[' || '๑' || '๒' || '๓' || '๔' || '๕' || '๖' || '๗' || '๘' || '๙' || '๐'):
                reference.push(word)
                break
              default:
                wordNumber++
                batch.set(
                  db.collection('wordList').doc(newDoc.id), {
                    docId: newDoc.id,
                    word: word,
                    lineNumber: lineNumber,
                    wordNumber: wordNumber,
                    // reference
                    // tipitakaReference: db.collection('tipitaka').doc(`${selectedRow.value.docId}`),
                    tipitakaRecordId: selectedRow.value.docId,
                    tipitakaEdition: selectedRow.value.tipitakaEdition,
                    volumeNumber: selectedRow.value.volumeNumber,
                    pageNumber: selectedRow.value.pageNumber,
                    imageReference: selectedRow.value.imageReference,
                    wordIndex: `${selectedRow.value.tipitakaEdition}-${pad(selectedRow.value.volumeNumber, 3)}-${pad(selectedRow.value.pageNumber, 4)}-${pad(wordNumber, 3)}`,
                    reference: reference
                  }
                )
                reference = []
                break
            }
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
    async function removeWordList () {
      console.log('removeWordList', selectedRow.value.docId)
      const batch = db.batch()
      const docs = await getPromiseDocs(db.collection('wordList')
        .where('tipitakaRecordId', '==', selectedRow.value.docId)
      )
      docs.forEach((doc) => {
        batch.delete(db.collection('wordList').doc(doc.docId))
      })
      batch.commit().then(() => {
        console.log('commited')
      })
    }

    // ----------------------------
    // $$ function delete record $$
    // ----------------------------
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
        const imageRef = storage.ref().child(selectedRow.value.imageReference)
        // Delete the file
        imageRef.delete()
          .then(() => {
            console.log('deleted image')
          }).catch((error) => {
            console.log(error.code)
          })
        // delete record
        const doc = db.collection('tipitaka').doc(selectedRow.value.docId)
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
        // logging
        useLogMeritMaking(
          'tipitaka',
          selectedRow.value,
          'deleteRecord',
          userID.value,
          userName.value
        )
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
        docId: selectedRow.value.docId,
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

    // --------------------------
    // $$ function submit data $$
    // --------------------------
    function submit () {
      const data = datatable.value.updateData
      const doc = db.collection('tipitaka').doc(data.docId)
      updateDoc(doc, data)
        .then(() => {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
          // logging
          useLogMeritMaking(
            'tipitaka',
            selectedRow.value,
            'updateRecord',
            userID.value,
            userName.value
          )
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

    // ------------------------
    // function softSubmit data
    // ------------------------
    function softSubmit () {
      const data = datatable.value.updateData
      const doc = db.collection('tipitaka').doc(data.docId)
      updateDoc(doc, {
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
      controlPanel,
      splitterModel,
      firstLine,
      textAreaHeight,
      lineCount,
      lineHeight,
      wordCount,
      fontSize,
      textRef,
      noteRef,
      proofreadRef,
      // function
      useHasPermission,
      removeExtraSpace,
      proofread,
      deleteRecord,
      submit
    }
  }
}
</script>
