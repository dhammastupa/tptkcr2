<template>
  <q-layout view="hhh lpR fFf">

    <Header @toggleLeftDrawer="toggleLeftDrawer"/>

    <q-drawer elevated v-model="leftDrawerOpen" side="left" overlay bordered>
      <Navigator />
    </q-drawer>

    <q-page-container
      style="background: linear-gradient(#ffffff, #f1ebff);"
    >
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed, watch, ref, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  components: {
    Header: defineAsyncComponent(() => import('src/components/MainLayout/Header.vue')),
    Navigator: defineAsyncComponent(() => import('src/components/MainLayout/Navigator.vue'))
  },

  setup () {
    // initial composible
    const $q = useQuasar()
    const $store = useStore()
    const $router = useRouter()

    const leftDrawerOpen = ref(false)
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    watch(() => $q.dark.isActive, val => {
      console.logg(val ? 'On dark mode' : 'On light mode')
    })

    const loggedIn = computed(() => {
      return $store.getters['auth/isLogin']
    })

    watch(loggedIn, function () {
      if (loggedIn.value === false) {
        $router.push('/')
      }
    })

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      loggedIn
    }
  }
}
</script>

<style>
table.q-table th {
  background-color: #d1c4e9 !important;
  font-weight: bold;
}
</style>>
