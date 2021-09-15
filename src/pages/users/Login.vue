<template>
  <q-page
    class="row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-sm text-center">{{ $t('pageLogin.pageName') }}</h4>
          </q-card-section>

          <div>
            <q-card-section>
              <q-form class="q-px-sm q-pt-xl">
                <q-input
                  ref="emailRef"
                  square clearable
                  v-model="user.email" type="email"
                  lazy-rules
                  :rules="[ val => isValidEmailAddress(val) || $t('pageLogin.notValidEmail')]"
                  :label="$t('pageLogin.email')">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-input
                  ref="passwordRef"
                  square clearable
                  v-model="user.password" type="password"
                  lazy-rules
                  :rules="[ val => val.length >= 6 || $t('pageLogin.atLeast6Char')]"
                  :label="$t('pageLogin.password')">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>

            <q-card-actions class="q-px-lg">
              <q-btn
                unelevated size="lg"
                color="purple-4"
                class="full-width text-white"
                :label="$t('system.submit')"
                @click="submitForm"/>
            </q-card-actions>

            <q-card-section class="text-center q-pa-sm">
              <p class="text-grey-6">
                <q-btn
                  to="/users/forgot-password"
                  flat size="sm"
                  text-color="black"
                  :label="$t('pageLogin.forgotPassword')" />
              </p>
            </q-card-section>

          </div>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { isValidEmailAddress } from 'src/functions/check-valid-email.js'

export default {
  name: 'Login',
  setup () {
    const $store = useStore()
    const $router = useRouter()
    const $q = useQuasar()
    const $t = useI18n().t

    const user = reactive({
      email: '',
      password: ''
    })

    const emailRef = ref('')
    const passwordRef = ref('')

    async function submitForm () {
      const errorMsg = $t('system.error')
      const successMsg = $t('system.welcome')
      emailRef.value.validate()
      passwordRef.value.validate()

      if (emailRef.value.hasError || passwordRef.value.hasError) {
        // form has error
        $q.notify({
          icon: 'error',
          color: 'positive',
          message: `${errorMsg}`
        })
      } else {
        const result = await $store.dispatch('auth/loginUser', user)
        if (result.success) {
          $router.push('/')
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: `${successMsg}`
          })
        }
      }
    }

    return {
      user,
      emailRef,
      passwordRef,
      isValidEmailAddress,
      submitForm
    }
  }
}
</script>

<style>
</style>
