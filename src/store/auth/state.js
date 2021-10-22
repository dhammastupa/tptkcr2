export default function () {
  return {
    loggedIn: false,
    uid: '',
    firstName: '',
    lastName: '',
    invitationIDs: [],
    friendList: [],
    authInfo: {
      loggedIn: false,
      uid: '',
      email: '',
      userEmailVerified: false
    },
    authPermission: {
      group: [],
      permission: []
    },
    defaultGroup: 'staff'
  }
}
