import { computed } from 'vue'
import { useStore } from 'vuex'
import { includes } from 'lodash'

export default function useHasPermission (requirePermission) {
  const $store = useStore()

  const authPermission = computed(() => {
    return $store.getters['auth/authPermission']
  })

  const permission = authPermission.value.permission

  let result = false

  if (includes(permission, requirePermission)) {
    result = true
  }

  return result
}
