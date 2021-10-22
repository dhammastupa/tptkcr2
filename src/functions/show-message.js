import { Dialog, Loading } from 'quasar'
import { i18n } from 'src/boot/i18n.js'

export function showMessage (type, message) {
  const { t } = i18n.global
  Loading.hide()
  const dialog = Dialog.create({
    title: t(type),
    message: t(message),
    html: true
  })

  setTimeout(() => {
    dialog.hide()
  }, 3000)
}
