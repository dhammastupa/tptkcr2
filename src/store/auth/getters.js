export function userName (state) {
  return state.firstName + ' ' + state.lastName
}

export function isLogin (state) {
  return state.loggedIn
}

export function authInfo (state) {
  return state.authInfo
}

export function authPermission (state) {
  return state.authPermission
}
