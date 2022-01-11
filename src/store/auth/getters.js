import { sortBy } from 'lodash'

export function uid (state) {
  return state.uid
}

export function userName (state) {
  return state.firstName + ' ' + state.lastName
}

export function firstName (state) {
  return state.firstName
}

export function lastName (state) {
  return state.lastName
}

export function invitationIDs (state) {
  return state.invitationIDs
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

export function getFriendList (state) {
  return sortBy(state.friendList, ['firstName'])
}
