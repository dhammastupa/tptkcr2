<template>
  <q-toolbar
    class="col-3 text-white q-gutter-xs">
    <!-- add node -->
    <q-btn
      flat round dense
      text-color="secondary"
      icon="add_circle_outline"
      :disable="!commonToc.create"
      @click="createNode"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.createNode') }}
      </q-tooltip>
    </q-btn>
    <!-- edit node -->
    <q-btn
      flat round dense
      text-color="primary"
      icon="edit_note"
      :disable="!commonToc.update"
      @click="editNode"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.editNode') }}
      </q-tooltip>
    </q-btn>
    <!-- upward -->
    <q-btn
      flat round dense
      text-color="deep-purple-9"
      icon="arrow_upward"
      :disable="!commonToc.upward"
      @click="upward"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.upward') }}
      </q-tooltip>
    </q-btn>
    <!-- downward -->
    <q-btn
      flat round dense
      text-color="deep-purple-9"
      icon="arrow_downward"
      :disable="!commonToc.downward"
      @click="downward"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.downward') }}
      </q-tooltip>
    </q-btn>
    <!-- changeParent -->
    <q-btn
      flat round dense
      text-color="teal-9"
      icon="escalator_warning"
      :disable="!commonToc.changeParent"
      @click="changeParent"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.changeParent') }}
      </q-tooltip>
    </q-btn>
    <!-- clearAll -->
    <q-btn
      flat round dense
      text-color="grey-1"
      icon="clear_all"
      :disable="!commonToc.unselectNode"
      @click="unselectNode"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.unselectNode') }}
      </q-tooltip>
    </q-btn>
    <!-- deleteNode -->
    <q-btn
      flat round dense
      icon="clear"
      text-color="red"
      :disable="!commonToc.delete"
      @click="deleteNode"
    >
      <q-tooltip>
        {{ $t('pageCommonToc.deleteNode') }}
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { db, Timestamp } from 'src/boot/firebase.js'
import { updateDoc, getPromiseDocs, deleteDoc } from 'src/functions/manage-data.js'
import { isEmpty } from 'lodash'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default {
  setup () {
    // initial composible
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // initial getters commonToc
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // function createNode
    function createNode () {
      $store.commit('commonToc/setForm', {
        createForm: true,
        updateForm: false
      })
    }

    // function editNode
    function editNode () {
      $store.commit('commonToc/setForm', {
        createForm: false,
        updateForm: true
      })
    }

    // function upward
    function upward () {
      // clear selection
      $store.commit('commonToc/setSelectedToc', '')
      // reset header menu
      $store.commit('commonToc/setMenuItems')
      // move up/downward process
      const currentIndex = commonToc.value.selectedSibling[commonToc.value.selectedSiblingIndex]
      const previousIndex = commonToc.value.selectedSibling[commonToc.value.selectedSiblingIndex - 1]
      updateDoc(
        db.collection('commonToc').doc(currentIndex.id),
        {
          sequence: previousIndex.sequence,
          updatedOn: Timestamp.now(),
          updatedBy: userName.value
        })
      updateDoc(
        db.collection('commonToc').doc(previousIndex.id),
        {
          sequence: currentIndex.sequence,
          updatedOn: Timestamp.now(),
          updatedBy: userName.value
        })
    }

    // function downward
    function downward () {
      // clear selection
      $store.commit('commonToc/setSelectedToc', '')
      // reset header menu
      $store.commit('commonToc/setMenuItems')
      // move up/downward process
      const currentIndex = commonToc.value.selectedSibling[commonToc.value.selectedSiblingIndex]
      const nextIndex = commonToc.value.selectedSibling[commonToc.value.selectedSiblingIndex + 1]
      updateDoc(
        db.collection('commonToc').doc(currentIndex.id),
        {
          sequence: nextIndex.sequence,
          updatedOn: Timestamp.now(),
          updatedBy: userName.value
        })
      updateDoc(
        db.collection('commonToc').doc(nextIndex.id),
        {
          sequence: currentIndex.sequence,
          updatedOn: Timestamp.now(),
          updatedBy: userName.value
        })
    }

    // function changeParent
    function changeParent () {
      const batch = db.batch()
      commonToc.value.ticked.forEach(i => {
        const recRef = db.collection('commonToc').doc(i)
        batch.update(recRef, { parent: commonToc.value.selected })
      })
      batch.commit().then(() => {
        console.log('commited')
      })
    }

    // function unselectNode
    function unselectNode () {
      $store.commit('commonToc/setSelectedToc', '')
      $store.commit('commonToc/setTickedToc', [])
      $store.commit('commonToc/setMenuItems')
    }

    // function deleteNode
    function deleteNode () {
      $q.dialog({
        title: $t('system.confirm'),
        message: $t('system.confirmToDelete'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        commonToc.value.ticked.forEach(
          async (i) => {
            const hasChild = await getPromiseDocs(
              db.collection('commonToc')
                .where('parent', '==', i)
            )
            if (isEmpty(hasChild)) {
              deleteDoc(db.collection('commonToc').doc(i))
            }
          }
        )
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
        unselectNode()
      })
    }

    return {
      commonToc,
      createNode,
      editNode,
      upward,
      downward,
      changeParent,
      unselectNode,
      deleteNode
    }
  }
}
</script>
