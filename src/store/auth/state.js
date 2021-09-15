export default function () {
  return {
    loggedIn: false,
    authInfo: {
      loggedIn: false,
      uid: '',
      email: '',
      userEmailVerified: false
    },
    authPermission: {
      group: [],
      permission: []
    }
  }
}
