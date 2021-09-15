import { LocalStorage, Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const selectedLocale = LocalStorage.getItem('locale') || 'en-US'
const i18n = createI18n({
  locale: selectedLocale,
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
}

import(`quasar/lang/${selectedLocale}`
).then(lang => {
  Quasar.lang.set(lang.default)
})

export { i18n }
