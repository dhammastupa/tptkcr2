<template>
  <q-btn-dropdown stretch flat :label="locale">
    <q-list>
      <q-item
        v-for="n in langOptions" :key="n.value"
        clickable v-close-popup
        @click="onLocaleChange(n.value)"
        v-model="locale">
        <q-item-section>
          <q-item-label>{{ n.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  setup () {
    const $store = useStore()
    const $q = useQuasar()
    const { locale } = useI18n()

    const langOptions = ref([
      { value: 'en-US', label: 'English' },
      { value: 'th', label: 'ไทย' }
    ])

    function onLocaleChange (val) {
      locale.value = val
      $store.dispatch('settings/saveLocale', val)

      import(`quasar/lang/${val}`
      ).then(lang => {
        $q.lang.set(lang.default)
      })
    }

    return {
      locale,
      langOptions,
      onLocaleChange
    }
  }
}
</script>
