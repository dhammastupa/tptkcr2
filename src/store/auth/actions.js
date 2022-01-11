import { auth, db, func } from 'src/boot/firebase'
import { LocalStorage, Loading } from 'quasar'
import { showMessage } from 'src/functions/show-message.js'
import { uniq } from 'lodash'

// เข้าระบบ
export const loginUser = async ({ context }, payload) => {
  Loading.show()
  let result = {}
  await auth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      result = { success: true, response: response }
    })
    .catch(error => {
      result = { success: false, response: error }
      switch (error.code) {
        case 'auth/wrong-password':
          showMessage('system.errorTitle', 'system.wrongPassword')
          break
        case 'auth/user-not-found':
          showMessage('system.errorTitle', 'system.userNotFound')
          break
        default:
          showMessage('system.errorTitle', 'system.error')
      }
      console.log('error: ', error)
    })
  Loading.hide()
  return result
}

// ลงทะเบียน
export const registerUser = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((userCredential) => {
        auth.currentUser.sendEmailVerification()
        const createProfile = func.httpsCallable('createProfile')
        createProfile({
          uid: userCredential.user.uid,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          inviterUid: payload.inviterUid,
          inviterCode: payload.inviterCode
        }).then(() => {
          resolve(userCredential)
        })
      })
      .catch(error => {
        console.log(error.code)
        reject(error)
      })
  })
}

// ล็อกเอาท์ผู้ใช้งาน
export const logoutUser = async () => {
  await auth.signOut().then(() => {
    console.log('logged out')
  })
}

// เปลี่ยนรหัสผ่าน
export const resetPassword = async ({ context }, payload) => {
  let result = {}
  await auth.sendPasswordResetEmail(payload.email)
    .then(response => {
      // แสดงข้อความให้เปิดอีเมลเพื่อทำการยืนยัน
      result = { success: true, response: response }
    })
    .catch(error => {
      result = { success: false, response: error }
      showMessage('system.errorTitle', 'system.error')
      console.log('error: ', error)
    })
  return result
}

// เมื่อมีการเปลี่ยน state การ login / logout
export const handleAuthStateChange = async ({ state, commit, dispatch }) => {
  await auth.onAuthStateChanged(user => {
    Loading.hide()
    // ผู้ใช้ระบบ
    let authPayload = {
      loggedIn: false,
      uid: '',
      email: '',
      userEmailVerified: false
    }
    // รายละเอียดผู้ใช้งาน
    const userInfoPayload = {
      uid: '',
      firstName: '',
      lastName: '',
      invitationIDs: []
    }
    // รายละเอียดสิทธิ์
    const userRightPayload = {
      group: [],
      permission: []
    }
    // กระบวนการตรวจสอบ
    if (user) {
      // get info from firebase auth
      authPayload = {
        loggedIn: true,
        uid: user.uid,
        email: user.email,
        userEmailVerified: user.emailVerified
      }
      commit('setLoggedIn', authPayload.loggedIn)
      commit('setAuthInfo', authPayload)
      dispatch('settings/createNavigationMenu', {}, { root: true })
      for (const property in authPayload) {
        LocalStorage.set(property, authPayload[property])
      }
      // get info from user db
      db.collection('user').doc(user.uid).get()
        .then(snapshot => {
          // check if user in db is exists
          if (snapshot.exists) {
            const documents = snapshot.data()
            userInfoPayload.uid = documents.uid
            userInfoPayload.firstName = documents.firstName
            userInfoPayload.lastName = documents.lastName
            userInfoPayload.invitationIDs = documents.invitationIDs || []
            commit('setUserInfo', userInfoPayload)
            dispatch('friendList', user.uid)
          } else {
            // if not exists then loguser out
            dispatch('logoutUser')
          }
        })
      // get user groups
      db.collection('group')
        .where('user', 'array-contains-any', [user.uid])
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach((doc) => {
            const element = doc.data()
            userRightPayload.group.push(element.role)
            element.permission.forEach(i => {
              userRightPayload.permission.push(i)
            })
          })
          userRightPayload.permission = uniq(userRightPayload.permission)
          commit('setUserRight', userRightPayload)
        })
    } else {
      commit('setLoggedIn', authPayload.loggedIn)
      commit('setAuthInfo', authPayload)
      commit('setUserInfo', userInfoPayload)
      commit('setUserRight', userRightPayload)
      dispatch('settings/createNavigationMenu', {}, { root: true })
      LocalStorage.set('loggedIn', false)
      for (const property in authPayload) {
        LocalStorage.set(property, authPayload[property])
      }
    }
  })
}

// ส่งอีเมล์ยืนยันอีกครั้ง
export const resendEmail = ({ dispatch }) => {
  auth.currentUser.sendEmailVerification()
  dispatch('logoutUser')
}

// // ตรวจสอบสิทธฺืการใช้งาน
// export const hasPermission = ({ state }, payload) => {
//   return includes(state.authPermission.permission, payload)
// }

// เพื่อนอาสา
export const friendList = ({ commit }, payload) => {
  db.collection('user')
    .where('inviterUid', '==', payload)
    .get()
    .then(docs => {
      const result = docs.empty ? [] : docs.docs.map(doc => doc.data())
      commit('setFriendList', result)
    })
}
