import { auth, db } from 'src/boot/firebase'
import { LocalStorage, Loading } from 'quasar'
import { showMessage } from 'src/functions/show-message.js'
import { includes, uniq } from 'lodash'

// ผู้ใช้งานเข้าระบบ
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
          showMessage('systemMessage.errorTitle', 'storeAuth.wrongPassword')
          break
        case 'auth/user-not-found':
          showMessage('systemMessage.errorTitle', 'storeAuth.userNotFound')
          break
        default:
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
      }
      console.log('error: ', error)
    })
  Loading.hide()
  return result
}

// ลงทะเบียนผู้ใช้งาน
export const registerUser = async ({ commit, dispatch }, payload) => {
  Loading.show()
  await auth.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      // ส่งอีเมลเพื่อการยืนยัน
      auth.currentUser.sendEmailVerification()
        .then(() => {
          // แสดงข้อความให้เปิดอีเมลเพื่อทำการยืนยัน
          showMessage('systemMessage.infoTitle', 'storeAuth.sendEmailVerification')
        })
        .catch(error => {
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
          console.log('error: ', error)
        })
      // ทำการล็อกเอ๊าท์
      dispatch('logoutUser')
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          showMessage('systemMessage.errorTitle', 'storeAuth.emailAlreadyInUse')
          break
        default:
          showMessage('systemMessage.errorTitle', 'systemMessage.error')
      }
      console.log('error: ', error)
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
      showMessage('systemMessage.errorTitle', 'systemMessage.error')
      console.log('error: ', error)
    })
  return result
}

// เมื่อมีการเปลี่ยน state การ login / logout
export const handleAuthStateChange = async ({ state, commit, dispatch }) => {
  await auth.onAuthStateChanged(user => {
    console.log('state changed')
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
      firstName: '',
      lastName: ''
    }
    // รายละเอียดสิทธิ์
    const userRightPayload = {
      group: [],
      permission: []
    }
    // กระบวนการตรวจสอบ
    if (user) {
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
      db.collection('user').doc(user.uid).get()
        .then(snapshot => {
          const documents = snapshot.data()
          userInfoPayload.firstName = documents.firstName
          userInfoPayload.lastName = documents.lastName
          commit('setUserInfo', userInfoPayload)
        })
      db.collection('group').where('user', 'array-contains-any', [user.uid])
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

// ตรวจสอบสิทธฺืการใช้งาน
export const hasPermission = ({ state }, payload) => {
  return includes(state.authPermission.permission, payload)
}
