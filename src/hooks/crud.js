import { ref, computed } from 'vue'
import { Timestamp } from 'src/boot/firebase.js'
import { useStore } from 'vuex'
import { createDoc, updateDoc, deleteDoc, useLiveData } from 'src/functions/manage-data.js'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default function useCrudForm (collection = null) {
  // composable
  const $q = useQuasar()
  const $store = useStore()
  const $t = useI18n().t

  // getters userName
  const userName = computed(() => { return $store.getters['auth/userName'] })

  // formAction
  const formAction = ref({
    openDialog: false,
    action: 'add',
    document: {}
  })

  // form variables
  const dialog = ref(null)
  const action = ref(null)
  const document = ref(null)
  const form = ref({})
  const formRef = ref(null)
  const deleteAction = ref(false)
  const filter = ref(null)
  const rows = collection ? useLiveData(collection) : []

  // function onCreateBtnClick
  function createDocument () {
    formAction.value = {
      openDialog: true,
      action: 'add',
      document: {}
    }
  }

  // function openUpdateForm
  function updateDocument (row) {
    formAction.value = {
      openDialog: true,
      action: 'update',
      document: row
    }
  }

  function submit () {
    // update form before save data
    form.value.updatedOn = Timestamp.now()
    form.value.updatedBy = userName.value
    formRef.value.validate().then(success => {
      if (success) {
        // create
        if (action.value === 'add') {
          const newDoc = collection.doc()
          const newDocId = newDoc.id
          const data = { ...{ id: newDocId }, ...form.value }
          createDoc(newDoc, { ...data })
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
            })
          // update
        } else if (action.value === 'update') {
          const doc = collection.doc(form.value.id)
          // in case want to delete document
          if (deleteAction.value === true) {
            $q.dialog({
              title: $t('system.confirm'),
              message: $t('system.confirmToDelete'),
              cancel: true,
              persistent: true
            }).onOk(() => {
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
            }).onOk(() => {
              console.log('>>>> second OK catcher')
            }).onCancel(() => {
              console.log('>>>> Cancel')
            }).onDismiss(() => {
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
    filter,
    document,
    formAction,
    dialog,
    action,
    form,
    formRef,
    deleteAction,
    userName,
    rows,
    createDocument,
    updateDocument,
    submit
  }
}
