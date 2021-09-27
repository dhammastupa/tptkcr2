import store from 'src/store'
import _ from 'lodash'

const n = 5
let i = 0
export function requiresPermission (requirePermission, to, next) {
  function keepTrying () {
    i++
    if (_.intersection(
      store.state.auth.authPermission.permission,
      requirePermission).length) {
      return next()
    } else {
      if (i < n) {
        console.log('try again in 1 seconds')
        setTimeout(keepTrying, 1000) // try again in 1 seconds
      } else {
        next('/Error403')
      }
    }
  }
  keepTrying()
}
