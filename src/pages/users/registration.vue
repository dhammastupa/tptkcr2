<template>
  <q-page
    class="row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;">

          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md text-center">{{ $t('pageLogin.registration') }}</h4>
          </q-card-section>

          <div>
            <q-card-section>
              <q-form
                ref="formRef"
                @submit="submitForm"
                class="q-px-sm q-pt-sm"
              >

                <!-- inviterName -->
                <q-input
                  class="q-pb-md"
                  v-model="user.inviterName"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="record_voice_over" />
                  </template>
                </q-input>

                <!-- email -->
                <q-input
                  tabindex="1"
                  square clearable
                  v-model="user.email" type="email"
                  lazy-rules
                  :rules="[ val => isValidEmailAddress(val) || $t('pageLogin.notValidEmail')]"
                  :label="$t('pageLogin.email')">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <!-- password -->
                <q-input
                  tabindex="2"
                  square clearable
                  v-model="user.password" type="password"
                  lazy-rules
                  :rules="[ val => val.length >= 6 || $t('pageLogin.atLeast6Char')]"
                  :label="$t('pageLogin.password')">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <!-- firstName -->
                <q-input
                  filled
                  v-model="user.firstName"
                  :label="$t('pageProfile.firstName')"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
                />
                <!-- lastName -->
                <q-input
                  filled
                  v-model="user.lastName"
                  :label="$t('pageProfile.lastName')"
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || $t('system.requiredField')]"
                />
                <!-- submit -->
                <q-card-actions class="q-px-lg">
                  <q-btn
                    unelevated size="lg"
                    color="purple-4"
                    class="full-width text-white"
                    :label="$t('system.submit')"
                    type="submit"
                  />
                </q-card-actions>
              </q-form>
            </q-card-section>

          </div>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { func } from 'src/boot/firebase.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar, Loading } from 'quasar'
import { useI18n } from 'vue-i18n'
import { isValidEmailAddress } from 'src/functions/check-valid-email.js'
import { isEmpty, head } from 'lodash'

export default {
  name: 'Login',
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t
    const $router = useRouter()

    // getters route
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    // initial variables
    // user
    const user = ref({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      inviterCode: '',
      inviterUid: '',
      inviterName: ''
    })

    // inviterInfo
    const inviterInfo = ref({})

    Loading.show()

    // form reference for validation
    const formRef = ref(null)

    // function find inviter
    watch(route, async () => {
      const getInviterInfo = func.httpsCallable('getInviterInfo')
      await getInviterInfo({ id: route.value.params.id })
        .then((docs) => {
          // uninvited
          if (isEmpty(docs.data)) {
            $q.notify({
              icon: 'error',
              color: 'negative',
              message: $t('system.notInvited')
            })
            $router.push('/')
            Loading.hide()
          } else {
            // invited
            Loading.hide()
            inviterInfo.value = head(docs.data)
            user.value.inviterUid = inviterInfo.value.uid
            user.value.inviterName = `${inviterInfo.value.firstName} ${inviterInfo.value.lastName}`
            user.value.inviterCode = route.value.params.id
          }
        })
        .catch(error => {
          console.log(error)
        })
    }, { immediate: true })

    async function submitForm () {
      formRef.value.validate().then((success) => {
        if (success) {
          $store.dispatch('auth/registerUser', user.value)
            .then((userCredential) => {
              $q.dialog({
                title: $t('system.ok'),
                message: $t('system.sendEmailVerification'),
                persistent: true
              }).onOk(() => {
                $store.dispatch('auth/logoutUser')
              }).onOk(() => {
                // console.log('>>>> second OK catcher')
              }).onCancel(() => {
                // console.log('>>>> Cancel')
              }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
              })
            })
            .catch((error) => {
              console.log(error.code)
              switch (error.code) {
                case 'auth/email-already-in-use':
                  $q.notify({
                    icon: 'done',
                    color: 'positive',
                    message: $t('system.emailAlreadyInUse')
                  })
                  break
                default:
                  $q.notify({
                    icon: 'done',
                    color: 'positive',
                    message: $t('system.error')
                  })
                  break
              }
            })
        }
      })
    }

    return {
      user,
      formRef,
      isValidEmailAddress,
      submitForm
    }
  }
}
</script>

<style>
</style>
