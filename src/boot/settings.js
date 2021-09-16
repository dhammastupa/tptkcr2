import { boot } from 'quasar/wrappers'
import { DraggablePlugin } from '@braks/revue-draggable'

// set route
export default boot(({ app, router, store }) => {
  router.beforeEach((to, from, next) => {
    store.commit('settings/SET_ROUTE', to)
    next()
  })

  app.use(DraggablePlugin)
})
