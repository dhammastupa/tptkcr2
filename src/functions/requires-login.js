import store from 'src/store'

const n = 2
let i = 0
export function requiresLogin (to, next) {
  function keepTrying () {
    i++
    if (store.state.auth.loggedIn) {
      console.log('islogin')
      return next()
    } else {
      if (i < n) {
        console.log('try again in 1 seconds', store.state.auth.loggedIn)
        setTimeout(keepTrying, 1000) // try again in 1 seconds
      } else {
        next('users/login')
      }
    }
  }
  keepTrying()
}
