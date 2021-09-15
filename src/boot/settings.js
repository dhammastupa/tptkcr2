import { boot } from 'quasar/wrappers'

// set route
export default boot(({ router, store }) => {
  router.beforeEach((to, from, next) => {
    store.commit('settings/SET_ROUTE', to)
    next()
  })
})
