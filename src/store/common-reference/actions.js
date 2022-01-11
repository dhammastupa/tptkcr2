import { db, storage, Timestamp } from 'src/boot/firebase.js'
import { getPromiseDoc, getPromiseDocs, createDoc, deleteDoc, updateDoc } from 'src/functions/manage-data.js'
import { isEmpty, find } from 'lodash'
import { i18n } from 'src/boot/i18n.js'
const { t } = i18n.global

// ------------
// dataSnapshot
// ------------
// ---- fetchTipitakaEdition
export async function fetchTipitakaEdition ({ commit }) {
  // fetch tipitakaEdition rows and save in dataSnapshot
  const tipitakaEdition = await getPromiseDocs(
    db.collection('tipitakaEdition').orderBy('sequence')
  )
  commit('setDataSnapshotTipitakaEdition', tipitakaEdition)
  commit('setArchiveMenuTipitakaEditionSelection',
    tipitakaEdition.map(i => {
      return {
        value: i.code,
        label: `${i.name} ${i.volumes} ${t('pageCommonReference.volumes')}`
      }
    })
  )
}
// ---- fetchTcrSet
export async function fetchTcrSet ({ rootState, commit }) {
  // tcrSet rows
  const tcrSet = await getPromiseDocs(db.collection('tcrSet'))
  commit('setDataSnapshotTcrSet', tcrSet)
  commit('setTcrSetDoc', find(tcrSet, { docId: rootState.settings.route.params.id }))
}

// -------
// toolbar
// -------
// -- tcrItemMenu
// ---- changeParent
export function changeParent ({ state, commit }) {
  commit('setUpdateTreeAfterChangeParent', true)
}
// -- tcrItemMenu
// ---- updateListOrder
export function updateListOrder ({ state, commit }, payload) {
  getPromiseDocs(
    db.collection('tcrItem')
      .where('docId', 'in', [payload.selectedId, payload.targetId])
  ).then(docs => {
    Promise.all([
      updateDoc(db.collection('tcrItem').doc(docs[0].docId), { sequence: docs[1].sequence }),
      updateDoc(db.collection('tcrItem').doc(docs[1].docId), { sequence: docs[0].sequence })
    ]).then(() => {
      commit('setSelectedDownward', false)
      commit('setUpdateTreeAfterReorder', true)
    })
  })
}
// ---- deleteTcrItem
export async function deleteTcrItem ({ state, commit }) {
  state.tcrItem.tickedTcrItem.forEach(
    async (i) => {
      const hasChild = await getPromiseDocs(
        db.collection('tcrItem')
          .where('parent', '==', i)
      )
      if (isEmpty(hasChild)) {
        await deleteDoc(db.collection('tcrItem').doc(i))
        commit('setUpdateTreeAfterDelete', true)
      }
    }
  )
}

// -- archiveMenu
// ---- addReference
export async function addReference ({ rootGetters, state, commit, dispatch }, payload) {
  console.log('hi')
  const tcrDataRec = await getPromiseDocs(
    db.collection('tcrData')
      .where('tcrItem', '==', payload.selectedTcrItemRow.docId)
      .where('tipitakaEdition', '==', payload.tipitakaEdition.value)
  )
  const beginWordIndex = payload.selectWordRange[0].wordIndex
  const endWordIndex = payload.selectWordRange[1].wordIndex
  const wordRange = payload.selectWordRange
  let samplePhrase = ''
  const start = await getPromiseDocs(db.collection('wordList')
    .where('wordIndex', '>=', wordRange[0].wordIndex)
    .orderBy('wordIndex', 'asc')
    .limit(4)
  )
  start.forEach(element => {
    samplePhrase = samplePhrase + ' ' + element.word
  })
  samplePhrase = samplePhrase + ' ... '
  const end = await getPromiseDocs(db.collection('wordList')
    .where('wordIndex', '<=', wordRange[1].wordIndex)
    .orderBy('wordIndex', 'asc')
    .startAt(`${wordRange[1].wordIndex.substring(0, 13)}-001`)
  )
  end.slice(Math.max(end.length - 4, 1)).forEach(element => {
    samplePhrase = samplePhrase + ' ' + element.word
  })

  if (isEmpty(tcrDataRec)) {
    const newDoc = await db.collection('tcrData').doc()
    await createDoc(
      newDoc,
      {
        docId: newDoc.id,
        tcrItem: payload.selectedTcrItemRow.docId,
        tcrItemDoc: payload.selectedTcrItemRow,
        tipitakaEdition: payload.tipitakaEdition.value,
        beginWordId: payload.selectWordRange[0].docId,
        beginWordIndex: beginWordIndex,
        endWordId: payload.selectWordRange[1].docId,
        endWordIndex: endWordIndex,
        wordRange: wordRange,
        samplePhrase: samplePhrase,
        note: '',
        // logs
        createdOn: Timestamp.now(),
        createdBy: rootGetters['auth/userName'],
        updatedOn: Timestamp.now(),
        updatedBy: rootGetters['auth/userName']
      }
    )
  } else {
    await updateDoc(
      db.collection('tcrData').doc(tcrDataRec[0].docId),
      {
        tcrItem: payload.selectedTcrItemRow.docId,
        tcrItemDoc: payload.selectedTcrItemRow,
        tipitakaEdition: payload.tipitakaEdition.value,
        beginWordId: payload.selectWordRange[0].docId,
        beginWordIndex: beginWordIndex,
        endWordId: payload.selectWordRange[1].docId,
        endWordIndex: endWordIndex,
        wordRange: wordRange,
        samplePhrase: samplePhrase,
        note: '',
        // logs
        updatedOn: Timestamp.now(),
        updatedBy: rootGetters['auth/userName']
      }
    )
  }
  commit('setUpdateTcrData', true)
}

// -------
// tcrItem
// -------
// ---- fetchSelectedTcrItem
export async function fetchSelectedTcrItem ({ state, commit }, payload) {
  try {
    if (payload) {
      const data = await getPromiseDoc(db.collection('tcrItem'), payload)
      commit('setSelectedTcrItemRow', data)
    } else {
      commit('setSelectedTcrItemRow', {})
    }
  } catch (error) {
    console.log(error)
  }
}

// -----------
// tcrData
// -----------

// -------
// archive
// -------
// imageScan
// ---- fetchTipitaka
export async function fetchTipitaka ({ state, commit, dispatch }, payload) {
  function clearStateValue () {
    commit('setImageScanPage', {})
    commit('setImageWordList', [])
    commit('setImageScanUrl', '')
  }
  try {
    const data = await getPromiseDocs(
      db.collection('tipitaka')
        .where('tipitakaEdition', '==', state.archiveMenu.tipitakaEdition.value)
        .where('volumeNumber', '==', state.archiveMenu.volume.value)
        .where('pageNumber', '==', payload)
    )
    if (!isEmpty(data)) {
      commit('setImageScanPage', data[0])
      commit('setPageNumber', payload)
      dispatch('fetchImageUrl', data[0].docId)
      dispatch('fetchWordList', data[0].docId)
    } else {
      clearStateValue()
    }
  } catch (error) {
    clearStateValue()
  }
}
// imageScan
// ---- fetchImageUrl
export async function fetchImageUrl ({ state, commit }) {
  if (!isEmpty(state.imageScan.page)) {
    try {
      const url = await storage.ref()
        .child(`${state.imageScan.page.imageReference}`)
        .getDownloadURL()
      commit('setImageScanUrl', url)
    } catch {
      commit('setImageScanUrl', '')
    }
  }
}
// imageScan
// ---- fetchWordList
export async function fetchWordList ({ commit }, payload) {
  const data = await getPromiseDocs(
    db.collection('wordList')
      .where('tipitakaRecordId', '==', payload)
      .orderBy('wordIndex')
  )
  if (!isEmpty(data)) {
    commit('setImageWordList', data)
  } else {
    commit('setImageWordList', [])
  }
}

// ----
// form
// ----
// ---- createTcrItem
