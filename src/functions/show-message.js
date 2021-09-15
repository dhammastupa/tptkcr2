import { Dialog, Loading } from 'quasar'

export function showMessage (type, message) {
  Loading.hide()
  const dialog = Dialog.create({
    title: type,
    message: message,
    html: true
  })

  setTimeout(() => {
    dialog.hide()
  }, 1500)
}
