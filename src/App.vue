<template>
  <router-view />
</template>
<script>
import { onMounted, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',

  setup () {
    const $store = useStore()

    onMounted(function () {
      $store.dispatch('auth/handleAuthStateChange')
    })
  }
})
</script>
