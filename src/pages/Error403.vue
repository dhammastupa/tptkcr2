<template>
  <div class="fullscreen bg-red text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 20vh">
        403
      </div>

      <div v-if="$route.query.backUrl"
        class="text-h3" style="opacity:.4">
        {{ $t('system.checkPermissions') }}
      </div>
      <div v-else
        class="text-h3" style="opacity:.4">
        {{ $t('system.page403') }}
      </div>
      <q-btn
        class="q-ma-md"
        color="white"
        text-color="red"
        unelevated
        to="/"
        icon="home"
        no-caps
      />
      <q-btn
        v-if="$route.query.backUrl"
        class="q-ma-md"
        color="blue"
        text-color="white"
        unelevated
        :to="$route.query.backUrl"
        icon="undo"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { useRouter } from 'vue-router'

const $router = useRouter()

export default {
  name: 'Error403',
  computed: {
    ...mapState('auth', ['permission'])
  },
  watch: {
    permission () {
      $router.push(this.$route.query.backUrl)
    }
  }
}
</script>
