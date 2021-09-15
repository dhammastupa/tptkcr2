import store from 'src/store'
import _ from 'lodash'

const n = 3
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
        next({
          path: '/Error403/',
          query: {
            backUrl: to.fullPath
          }
        })
      }
    }
  }
  keepTrying()
}
