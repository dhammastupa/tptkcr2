export const setLoggedIn = (state, value) => {
  state.loggedIn = value
}

export const setAuthInfo = (state, payload) => {
  state.authInfo = payload
}

export const setUserRight = (state, payload) => {
  state.authPermission = payload
}

export const setUserInfo = (state, payload) => {
  state.firstName = payload.firstName
  state.lastName = payload.lastName
}
