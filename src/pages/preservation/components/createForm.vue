<template>
  <div>
    <q-dialog
      v-model="create.active"
      :maximized="false"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card class="card-dialog-500">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ variables.tipitakaEdition.name }}</div>
              <div class="text-subtitle2">
                {{ $t('pageTipitakaPreservation.volumeNumber') }} {{ volumeName.label }}
                ({{ volumeName.pages }} {{ $t('pageTipitakaPreservation.pages') }})
              </div>
            </div>
            <div class="col-auto">
              <q-btn
                color="grey-7"
                round flat icon="close"
                @click="closeCreateForm"
              >
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section class="q-py-lg text-h5 text-center">
          <span v-if="pageNumber">{{ $t('pageTipitakaPreservation.createNewPage') }} {{ pageNumber }}</span>
          <span v-else>{{ $t('pageTipitakaPreservation.allPagesCreated') }}</span>
        </q-card-section>

        <q-separator />

        <q-card-actions vertical align="center">
          <q-btn
            v-if="pageNumber"
            flat
            @click="createNewPage"
          >
            {{ $t('system.create') }}
          </q-btn>
          <q-btn
            v-else
            flat
            @click="closeCreateForm"
          >
            {{ $t('system.close') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { db, Timestamp } from 'src/boot/firebase'
import { getPromiseDocs, createDoc } from 'src/functions/manage-data'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

export default {
  name: 'system.create',

  setup () {
    // composable
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    const userName = computed(() => { return $store.getters['auth/userName'] })

    // getters create
    const create = computed(() => { return $store.getters['preservation/getCreate'] })

    // getters selection
    const selection = computed(() => { return $store.getters['preservation/getSelection'] })

    // getters variables
    const variables = computed(() => { return $store.getters['preservation/getVariables'] })

    // getters route
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // tipitakaEditionId
    const tipitakaEditionID = computed(() => {
      return route.value.params.id
    })

    // volume name
    const volumeName = computed(() => {
      return _.find(selection.value.volume, ['value', variables.value.volume])
    })

    const pageNumber = ref(null)

    // function find pageNumber to create
    async function findPageNumber () {
      const documents = await getPromiseDocs(
        db.collection('tipitaka')
          .where('tipitakaEdition', '==', tipitakaEditionID.value)
          .where('volumeNumber', '==', variables.value.volume)
      )

      // เอาข้อมูลของฉบับและเล่มที่เลือกมา เพื่อดูว่าทำหน้าไหนไปแล้วบ้าง
      const createdPages = _.map(documents, 'pageNumber')
      // จากนั้นให้ทำการกรองออกให้เหลือเฉพาะที่ยังไม่มี
      const filtered = _.filter(selection.value.pages, function (o) { return !createdPages.includes(o) })
      // ตรวจสอบว่ายังคงมีหน้าเหลือในการสร้างใหม่หรือไม่
      if (filtered.length) {
        pageNumber.value = filtered[0]
      }
    }
    findPageNumber()

    // function closeCreateForm
    function closeCreateForm () {
      $store.commit(
        'preservation/setCreateForm',
        {
          active: false
        })
    }

    // function createNewPage
    async function createNewPage () {
      const newDoc = db.collection('tipitaka').doc()
      const newDocId = newDoc.id
      const details = ref({
        id: newDocId,
        tipitakaEdition: tipitakaEditionID.value,
        volumeNumber: variables.value.volume,
        pageNumber: pageNumber.value,
        imageReference: `${tipitakaEditionID.value}/${variables.value.volume}/${pageNumber.value}.jpg`,
        text: '',
        wordBoxs: [],
        personalSetting: [],
        note: '',
        proofread: false,
        createdOn: Timestamp.now(),
        createdBy: userName.value,
        updatedOn: Timestamp.now(),
        updatedBy: userName.value
      })
      const data = { ...{ docId: newDocId }, ...details.value }
      await createDoc(newDoc, { ...data })
        .then(() => {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
          closeCreateForm()
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

    return {
      create,
      selection,
      variables,
      volumeName,
      pageNumber,
      closeCreateForm,
      findPageNumber,
      createNewPage
    }
  }
}
</script>
