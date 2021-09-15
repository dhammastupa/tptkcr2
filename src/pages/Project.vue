<template>
  <q-page padding>
    <Suspense>
      <template #default>
        <web-content
          :routeName='route.name'
        ></web-content>
      </template>
      <template #fallback>
        <div class="text-center">
          <q-spinner-tail
            color="primary"
            size="2em"
          />
        </div>
      </template>
    </Suspense>
  </q-page>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    webContent: defineAsyncComponent(() => import(
      'src/components/webContent.vue'))
  },

  setup () {
    // initial composible
    const $store = useStore()
    const route = computed(() => { return $store.getters['settings/getRoute'] })

    return {
      route
    }
  }
}
</script>
