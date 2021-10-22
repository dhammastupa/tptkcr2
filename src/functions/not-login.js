import store from 'src/store'

const n = 1
let i = 0
export function notLogin (to, next) {
  function keepTrying () {
    i++
    if (store.getters['auth/isLogin']) {
      console.log('islogin')
      return next('/')
    } else {
      if (i < n) {
        console.log('try again in 1 seconds', store.getters['auth/isLogin'])
        setTimeout(keepTrying, 1000) // try again in 1 seconds
      } else {
        next()
      }
    }
  }
  keepTrying()
}
