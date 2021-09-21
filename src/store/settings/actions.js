import { LocalStorage } from 'quasar'
import { db } from 'src/boot/firebase'
const dateFormattedString = (new Date()).toISOString().split('T')[0]

export function saveLocale ({ commit }, payload) {
  LocalStorage.set('locale', payload)
}

export function createNavigationMenu ({ dispatch }) {
  dispatch('createProfileMenu')
  dispatch('createNonRestrictedMenu')
  dispatch('createPreservationMenu')
  dispatch('createCommonReferenceMenu')
  dispatch('createConfigurationMenu')
  dispatch('createAccessControlMenu')
}

export function createProfileMenu ({ rootState, commit }) {
  let result = []

  result = [
    {
      icon: 'face',
      label: rootState.auth.authInfo.email,
      caption: dateFormattedString,
      to: '/users/profile',
      class: 'text-white bg-deep-purple-6',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: ''
    }
  ]

  commit('setProfileMenu', result)
}

export function createNonRestrictedMenu ({ commit }) {
  const result = [
    {
      label: 'mainNavigation.home',
      icon: 'home',
      to: '/',
      class: 'text-black'
    },
    {
      label: 'mainNavigation.project',
      icon: 'history_edu',
      to: '/project',
      class: 'text-black'
    }
  ]
  commit('setNonRestrictedMenu', result)
}

export function createPreservationMenu ({ rootState, commit }) {
  const result = []
  if (rootState.auth.loggedIn) {
    db.collection('tipitakaEdition')
      .orderBy('sequence', 'asc')
      .get()
      .then(querySnapshot => {
        result.push({
          icon: 'auto_stories',
          label: 'mainNavigation.tipitakaPreservation',
          to: '/',
          class: 'q-pt-lg text-blue-grey',
          title: true,
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'tipitaka'
        })
        querySnapshot.forEach((doc) => {
          result.push({
            icon: 'remove',
            label: doc.data().name,
            caption: doc.data().description,
            to: '/preservation/' + doc.id,
            loggedIn: true,
            userEmailVerified: true,
            havePermission: 'tipitaka'
          })
        })
        commit('setPreservationMenu', result)
      })
      .catch(err => {
        commit('setPreservationMenu', [])
        console.log(err)
      })
  } else {
    commit('setPreservationMenu', [])
  }
}

export function createCommonReferenceMenu ({ rootState, commit }, payload) {
  const result = []
  if (rootState.auth.loggedIn) {
    db.collection('tocSet')
      .orderBy('sequence', 'asc')
      .get()
      .then(querySnapshot => {
        result.push({
          icon: 'account_tree',
          label: 'mainNavigation.commonReference',
          to: '/',
          class: 'q-pt-lg text-blue-grey',
          title: true,
          loggedIn: true,
          userEmailVerified: true,
          havePermission: 'common-toc'
        })
        querySnapshot.forEach((doc) => {
          result.push({
            icon: 'remove',
            label: doc.data().name,
            caption: doc.data().description,
            to: '/common-toc/' + doc.id,
            loggedIn: true,
            userEmailVerified: true,
            havePermission: 'tipitaka'
          })
        })
        commit('setCommonReferenceMenu', result)
      })
      .catch(err => {
        commit('setCommonReferenceMenu', [])
        console.log(err)
      })
  } else {
    commit('setCommonReferenceMenu', [])
  }
}

export function createConfigurationMenu ({ commit }, payload) {
  const result = [
    {
      icon: 'settings_suggest',
      label: 'mainNavigation.configuration',
      to: '/',
      class: 'q-pt-lg text-blue-grey',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'auto_stories',
      label: 'mainNavigation.tipitakaEdition',
      to: '/configuration/tipitaka-edition',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'account_tree',
      label: 'mainNavigation.tocSet',
      to: '/configuration/toc-set',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    },
    {
      icon: 'wysiwyg',
      label: 'mainNavigation.webContent',
      to: '/configuration/web-content',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'configuration'
    }
  ]
  commit('setConfigurationMenu', result)
}

export function createAccessControlMenu ({ commit }, payload) {
  const result = [
    {
      icon: 'verified_user',
      label: 'mainNavigation.accessControl',
      to: '/',
      class: 'q-pt-lg text-blue-grey',
      title: true,
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'people',
      label: 'mainNavigation.user',
      to: '/setting/access-control/user',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'supervised_user_circle',
      label: 'mainNavigation.group',
      to: '/setting/access-control/group',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    },
    {
      icon: 'flaky',
      label: 'mainNavigation.permission',
      to: '/setting/access-control/permission',
      class: 'text-black',
      loggedIn: true,
      userEmailVerified: true,
      havePermission: 'accessControl'
    }
  ]
  commit('setAccessControlMenu', result)
}
