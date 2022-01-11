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

  // form variables
  const dialog = ref(null)
  const action = ref(null)
  const document = ref(null)
  const form = ref({})
  const formRef = ref(null)
  const deleteAction = ref(false)
  const filter = ref(null)
  const rows = collection ? useLiveData(collection) : []

  // initial formAction
  const formAction = ref({
    openDialog: false,
    action: 'add',
    document: {}
  })

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

  function submit (docId = null) {
    // update form before save data
    form.value.updatedOn = Timestamp.now()
    form.value.updatedBy = userName.value
    formRef.value.validate().then(success => {
      if (success) {
        // -------------------
        // create
        // new record with uid
        // -------------------
        if (action.value === 'add') {
          let doc = null
          if (docId) {
            doc = collection.doc(docId)
          } else {
            doc = collection.doc()
          }
          const data = { ...{ docId: doc.id }, ...form.value }
          createDoc(doc, { ...data })
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
        // ----------------
        // update || delete
        // ----------------
        } else if (action.value === 'update') {
          const doc = collection.doc(docId)
          if (deleteAction.value === true) {
          // delete
          // ------
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
          // update
          // ------
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
