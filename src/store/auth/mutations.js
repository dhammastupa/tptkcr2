import { remove } from 'lodash'

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
  state.uid = payload.uid
  state.firstName = payload.firstName
  state.lastName = payload.lastName
  state.invitationIDs = payload.invitationIDs
}

export const updateInvitationsIDs = (state, payload) => {
  state.invitationIDs.push(payload)
}

export const removeInvitationsIDs = (state, payload) => {
  remove(state.invitationIDs, function (n) {
    return n === payload
  })
}

export const setFriendList = (state, payload) => {
  state.friendList = payload
}
