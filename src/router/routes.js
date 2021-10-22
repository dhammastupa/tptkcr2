// import { requiresLogin } from 'src/functions/requires-login'
import { notLogin } from 'src/functions/not-login'
import { requiresPermission } from 'src/functions/requires-permission'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/index.vue')
      },
      // registration
      {
        path: '/users/registration/:id',
        name: 'registrationPage',
        component: () => import('src/pages/users/registration.vue'),
        beforeEnter: (to, from, next) => notLogin(to, next)
      },
      // login
      {
        path: '/users/login',
        name: 'loginPage',
        component: () => import('src/pages/users/Login.vue'),
        beforeEnter: (to, from, next) => notLogin(to, next)
      },
      // reset password
      {
        path: '/users/forgot-password',
        name: 'forgotPasswordPage',
        component: () => import('src/pages/users/ForgotPassword.vue'),
        beforeEnter: (to, from, next) => notLogin(to, next)
      },
      // project
      {
        path: '/project',
        name: 'project',
        component: () => import('src/pages/project.vue')
      },
      // tipitaka preservation
      {
        path: '/preservation/:id',
        name: 'tipitakaPreservation',
        component: () => import('src/pages/preservation/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['tipitaka'], to, next)
      },
      // table of content
      {
        path: '/common-toc/:id',
        name: 'common-toc',
        component: () => import('src/pages/commonToc/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['common-toc'], to, next)
      },
      // configuration
      // tipitaka-edition
      {
        path: '/configuration/tipitaka-edition',
        name: 'tipitakaEditionPage',
        component: () => import('src/pages/configuration/tipitakaEdition/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      // tocset
      {
        path: '/configuration/toc-set',
        name: 'tocSet',
        component: () => import('src/pages/configuration/tocSet/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      // webContent
      {
        path: '/configuration/web-content',
        name: 'webContent',
        component: () => import('src/pages/configuration/webContent/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['configuration'], to, next)
      },
      // utility
      {
        path: '/configuration/utility',
        name: 'utility',
        component: () => import('src/pages/configuration/utility/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['utility'], to, next)
      },
      // users
      // profile
      {
        path: '/users/profile',
        name: 'profile',
        component: () => import('src/pages/users/profile/index.vue')
      },
      // access-control
      // user
      {
        path: '/access-control/user',
        name: 'usertable',
        component: () => import('src/pages/access-control/user/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      },
      // group
      {
        path: '/access-control/group',
        name: 'grouptable',
        component: () => import('src/pages/access-control/group/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      },
      // permission
      {
        path: '/access-control/permission',
        name: 'permissiontable',
        component: () => import('src/pages/access-control/permission/index.vue'),
        beforeEnter: (to, from, next) => requiresPermission(['accessControl'], to, next)
      }
    ]
  },
  {
    path: '/Error403',
    component: () => import('src/pages/Error403.vue')
  },
  {
    path: '/sample',
    component: () => import('src/pages/sample.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
