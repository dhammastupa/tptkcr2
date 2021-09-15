import { computed } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'

export default function useRequiresPermission (navs) {
  const $store = useStore()

  const authInfo = computed(() => {
    return $store.getters['auth/authInfo']
  })
  const authPermission = computed(() => {
    return $store.getters['auth/authPermission']
  })
  const loggedIn = authInfo.value.loggedIn
  const userEmailVerified = authInfo.value.userEmailVerified
  const permission = authPermission.value.permission
  const result = []

  navs.forEach(nav => {
    // ต้องล็อกอินไหม
    if (nav.loggedIn) {
      // ตรวจการล็อกอิน
      if (loggedIn) {
        // ต้องยืนยันตัวตนไหม
        if (nav.userEmailVerified) {
          if (userEmailVerified) {
            // ต้องระบุสิทธิ์ไหม
            if (nav.havePermission) {
              if (_.includes(permission, nav.havePermission)) {
                result.push(nav)
              }
            // ต้องล็อกอิน ต้นยืนยันตัวตน แต่ไม่ต้องระบุสิทธิ์
            } else {
              result.push(nav)
            }
          }
        // ต้องล็อกอิน แต่ไม่ต้องยืนยันตัวตน
        } else {
          result.push(nav)
        }
      }
    // ไม่ต้องล็อกอิน
    } else {
      result.push(nav)
    }
  })

  return result
}
