<template>
  <q-card class="q-mb-sm">
    <q-card-section class="bg-deep-purple-2 text-black">
      <div class="">{{ $t('pageProfile.group') }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="q-gutter-sm">
        <q-chip v-for="i in authPermission.group" :key="i">{{ i }}</q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {

  setup () {
    // composable
    const $store = useStore()

    // getters: auth/authPermission
    const authPermission = computed(() => { return $store.getters['auth/authPermission'] })

    return {
      authPermission
    }
  }
}
</script>
