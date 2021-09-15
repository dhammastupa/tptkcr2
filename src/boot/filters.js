import { boot } from 'quasar/wrappers'
import { date } from 'quasar'

export default boot(({ app }) => {
  app.config.globalProperties.$filters = {
    timeStampToDate (value) {
      if (value) {
        let dateVal = new Date(value.toDate())
        dateVal = date.formatDate(dateVal, 'YYYY-MM-DD HH:mm:ss')
        return dateVal
      } else {
        return date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
      }
    }
  }
})
