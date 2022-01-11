<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-card class="">
          <q-banner inline-actions
            class="text-white bg-primary">

            <q-icon name="drive_file_rename_outline" size="sm" />

            {{ $t($options.name) }}

            <template v-slot:action>
              {{ authInfo.email }}
            </template>
          </q-banner>

          <q-card-section>
            <q-form
              ref="formRef"
              @submit="submit"
              class="q-gutter-md"
            >

              <q-input
                filled
                v-model="form.firstName"
                :label="$t('pageProfile.firstName')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
              />

              <q-input
                filled
                v-model="form.lastName"
                :label="$t('pageProfile.lastName')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
              />

              <q-field
                disable
                filled :label="$t('system.updatedOn')" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ $filters.timeStampToDate(form.updatedOn) }}
                  </div>
                </template>
              </q-field>

              <q-input
                disable
                v-model="form.updatedBy"
                filled
                :label="$t('system.updatedBy')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
              />

              <div align="right">
                <!-- submit btn -->
                <q-btn
                  :label="$t('system.submit')"
                  type="submit"
                  color="primary"
                />

              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
        <generate-link v-if="useHasPermission('invitation')"></generate-link>

        <user-group></user-group>

        <user-permission></user-permission>

        <merit-book></merit-book>

        <merit-chart></merit-chart>
      </div>
    </div>

  </q-page>
</template>

<script>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { db, Timestamp } from 'src/boot/firebase.js'
import { updateDoc } from 'src/functions/manage-data'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useHasPermission from 'src/hooks/has-permission.js'

export default {
  name: 'mainNavigation.profile',

  components: {
    userGroup: defineAsyncComponent(() => import(
      'src/pages/users/profile/components/userGroup.vue')
    ),
    userPermission: defineAsyncComponent(() => import(
      'src/pages/users/profile/components/userPermission.vue')
    ),
    generateLink: defineAsyncComponent(() => import(
      'src/pages/users/profile/components/generateLink.vue')
    ),
    meritBook: defineAsyncComponent(() => import(
      'src/pages/users/profile/components/meritBook.vue')
    ),
    meritChart: defineAsyncComponent(() => import(
      'src/pages/users/profile/components/meritChart.vue')
    )
  },

  setup () {
    // composable
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })
    const firstName = computed(() => { return $store.getters['auth/firstName'] })
    const lastName = computed(() => { return $store.getters['auth/lastName'] })
    const authInfo = computed(() => { return $store.getters['auth/authInfo'] })
    const authPermission = computed(() => { return $store.getters['auth/authPermission'] })

    // initial variables
    const form = ref({})
    const formRef = ref(null)

    // function initial form
    function initialForm () {
      form.value = {
        id: authInfo.value.uid,
        firstName: firstName.value,
        lastName: lastName.value,
        updatedOn: Timestamp.now(),
        updatedBy: userName.value
      }
    }

    watch([authInfo, firstName], function () {
      initialForm()
    }, { immediate: true })

    // function submit
    function submit () {
    // update form before save data
      form.value.updatedOn = Timestamp.now()
      form.value.updatedBy = userName.value
      formRef.value.validate().then(success => {
        if (success) {
          const doc = db.collection('user').doc(form.value.docId)
          // update document
          updateDoc(doc, { ...form.value })
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
            }) // end update doc
        } // end check update/delete doc
      })
    }

    return {
      formRef,
      form,
      authInfo,
      authPermission,
      submit,
      useHasPermission
    }
  }
}
</script>

<style scope>
</style>
