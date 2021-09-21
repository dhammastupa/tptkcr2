import { getDocs } from 'src/functions/manage-data.js'
import { db, storage } from 'src/boot/firebase.js'
import { isEmpty, find } from 'lodash'
// import { i18n } from 'src/boot/i18n.js'
// const { t } = i18n.global

// =========
// headerBar
// =========
export async function fetchTocSetRows ({ rootState, commit, dispatch }, payload) {
  // tocSet rows
  const tocSetRows = await getDocs(db.collection('tocSet'))
  commit('setTocSetSelection', tocSetRows)
  commit('setTocSet', { id: rootState.settings.route.params.id })
}

export async function fetchTipitakaEdition ({ state, commit, dispatch }, payload) {
  // tipitakaEdition rows
  const tipitakaEditionRows = await getDocs(
    db.collection('tipitakaEdition').orderBy('sequence'))

  // const tipitakaEditionSelection = []
  // tipitakaEditionRows.forEach((doc) => {
  //   tipitakaEditionSelection.push({
  //     value: doc.code,
  //     label: `${doc.name} ${doc.volumes} ${t('pageCommonToc.volumes')}`
  //   })
  // })
  commit('setTipitakaEditionSelection', tipitakaEditionRows)
}

export function fetchTipitaka ({ state, commit, dispatch }, payload) {
  function clearStateValue () {
    commit('setPage', {})
    commit('setWordList', [])
    commit('setImageUrl', '')
  }
  try {
    getDocs(
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', state.variables.tipitakaEdition.code)
        .where('volumeNumber', '==', state.variables.volume.number)
        .where('pageNumber', '==', payload)
    ).then(data => {
      if (!isEmpty(data)) {
        commit('setPage', data[0])
        dispatch('fetchWordList', data[0].id)
        dispatch('fetchImageUrl', data[0].id)
      } else {
        clearStateValue()
      }
    })
  } catch (error) {
    clearStateValue()
  }
}

export function fetchWordList ({ state, commit }, payload) {
  getDocs(
    db.collection('wordList')
      .where('tipitakaRecordId', '==', payload)
      .orderBy('wordIndex')
  ).then(data => {
    if (!isEmpty(data)) {
      commit('setWordList', data)
    } else {
      commit('setWordList', [])
    }
  })
}

export function fetchImageUrl ({ state, commit }) {
  if (!isEmpty(state.variables.page)) {
    storage.ref()
      .child(`${state.variables.page.imageReference}`)
      .getDownloadURL()
      .then(url => {
        commit('setImageUrl', url)
      })
  }
}

export function fetchNodeRows ({ state, commit }, payload) {
  db.collection('commonToc')
    .where('tocSetId', '==', payload.tocSetId)
    .where('parent', 'in', state.commonToc.parentNode)
    .orderBy('sequence', 'asc')
    .onSnapshot(snapshot => {
      commit('setNodeRows', snapshot.docs.map(doc => ({ ...doc.data() })))
      commit('setSelectedRow', find(state.commonToc.nodeRows, ['id', state.commonToc.selected]))
    })
}
