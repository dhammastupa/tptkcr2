<template>
  <div class="col q-pa-sm">
    {{$t('pageTipitakaPreservation.image')}}
  </div>

  <!-- toolbar -->
  <q-banner inline-actions class="bg-grey-3">
    <div class="q-gutter">
      <!-- ปุ่มเปิดลิงค์ภาพ -->
      <q-btn
        flat round
        icon="launch"
        type="a"
        :href="form.imageUrl"
        target="_blank"
      >
        <q-tooltip>
          {{ $t('pageTipitakaPreservation.showImage') }}
        </q-tooltip>
      </q-btn>
      <!-- ปุ่มแสดงไม้บรรทัด -->
      <q-btn
        flat round
        icon="straighten"
        :color="form.ruler.active ? 'purple' : 'black'"
        @click="setRulerActive"
        >
        <q-tooltip>
          {{ $t('pageTipitakaPreservation.showRuler') }}
        </q-tooltip>
        </q-btn>
    </div>

    <template v-slot:action>
      <div class="q-gutter">
        <!-- ปุ่มเปลี่ยนภาพ -->
        <q-btn
          v-if="hasPermission('tipitaka-deleteAction')"
          flat round
          icon="upload_file"
          @click="replaceImageRef = !replaceImageRef"
        >
        <q-tooltip>
          {{ $t('pageTipitakaPreservation.replceImage') }}
        </q-tooltip>
        </q-btn>
      </div>
    </template>
  </q-banner>

  <!-- upload image -->
  <div v-if="replaceImageRef"
    class="row q-py-lg">
    <div class="col-12 col-md-6 offset-md-3">
      <q-firebase-uploader
        style="width: 100%"
        :label="$t('pageTipitakaPreservation.uploadImage')"
        accept=".jpg"
        :path="`${datatable.selectedRow.tipitakaEdition}/${datatable.selectedRow.volumeNumber}/${datatable.selectedRow.pageNumber}.jpg`"
        @uploaded="getImageInfo"
      />
    </div>
  </div>

  <!-- image scan -->
  <q-img v-if="datatable.selectedRow.imageReference"
    :src="form.imageUrl"
    spinner-color="white"
  />
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import QFirebaseUploader from 'src/pages/preservation/components/firebaseUploader.vue'

export default {
  components: {
    QFirebaseUploader
  },

  setup () {
    // composable
    const $store = useStore()

    // getters datatable
    const datatable = computed(() => { return $store.getters['preservation/getDatatable'] })

    // getters form
    const form = computed(() => { return $store.getters['preservation/getForm'] })

    // function show/hide ruler
    function setRulerActive () {
      $store.commit(
        'preservation/setRulerActive',
        !form.value.ruler.active
      )
    }

    // function for check permission
    function hasPermission (rqPermission) {
      return $store.dispatch('auth/hasPermission', rqPermission)
    }

    // replaceImageRef
    const replaceImageRef = ref(false)

    // function for replace image scan
    function getImageInfo (val) {
      $store.commit(
        'preservation/setImageUrl',
        val.downloadURL
      )
      replaceImageRef.value = false
    }

    return {
      datatable,
      form,
      replaceImageRef,
      setRulerActive,
      hasPermission,
      getImageInfo
    }
  }
}
</script>
