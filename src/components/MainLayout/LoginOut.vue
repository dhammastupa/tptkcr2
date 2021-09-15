<template>
  <q-btn v-if="!isLogin"
    to="/users/login"
    stretch
    icon-right="account_circle"
    :label="$t('system.login')"
    flat
  />

  <q-btn v-else
    @click="logoutUser"
    stretch
    icon-right="account_circle"
    :label="$t('system.logout')"
    flat
  />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {

  setup () {
    // initial composible
    const $store = useStore()

    const isLogin = computed(() => {
      return $store.getters['auth/isLogin']
    })

    function logoutUser () {
      $store.dispatch('auth/logoutUser')
    }

    return {
      isLogin,
      logoutUser
    }
  }
}
</script>
