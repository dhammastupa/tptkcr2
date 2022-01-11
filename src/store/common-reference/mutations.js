import { find, last, isEmpty } from 'lodash'
import { i18n } from 'src/boot/i18n.js'
const { t } = i18n.global

// ------------
// dataSnapshot
// ------------
// setDataSnapshotTipitakaEdition
export const setDataSnapshotTipitakaEdition = (state, payload) => {
  state.dataSnapshot.tipitakaEdition = payload
}
// setDataSnapshotTcrSet
export const setDataSnapshotTcrSet = (state, payload) => {
  state.dataSnapshot.tcrSet = payload
}

// -------
// toolbar
// -------
// -- tcrItemMenu
// ---- setTcrItemMenu
export const setTcrItemMenu = (state) => {
  // create
  // -- allways active
  // update
  if (isEmpty(state.tcrItem.selectedTcrItem)) {
    state.tcrItemMenu.update = false
  } else {
    state.tcrItemMenu.update = true
  }
  // upward
  if (state.tcrItem.selectedTcrItem &&
      state.tcrItem.selectedSibling.index > 1) {
    state.tcrItemMenu.upward = true
  } else {
    state.tcrItemMenu.upward = false
  }
  // downward
  if (state.tcrItem.selectedTcrItem &&
      (state.tcrItem.selectedSibling.index < state.tcrItem.selectedSibling.length)) {
    state.tcrItemMenu.downward = true
  } else {
    state.tcrItemMenu.downward = false
  }
  // changeParent
  if (!isEmpty(state.tcrItem.selectedTcrItem) && !isEmpty(state.tcrItem.tickedTcrItem)) {
    state.tcrItemMenu.changeParent = true
  } else {
    state.tcrItemMenu.changeParent = false
  }
  // unselectItem
  // -- allways active
  // delete
  if (isEmpty(state.tcrItem.tickedTcrItem)) {
    state.tcrItemMenu.delete = false
  } else {
    state.tcrItemMenu.delete = true
  }
}
// setSelectedUpward
export const setSelectedUpward = (state, payload) => {
  state.tcrItem.selectedUpward = payload
}
// setSelectedUpward
export const setSelectedDownward = (state, payload) => {
  state.tcrItem.selectedDownward = payload
}

// -- archiveMenu
// ---- setArchiveMenuViewMode
export const setArchiveMenuViewMode = (state, payload) => {
  state.archiveMenu.viewMode = payload
}
// -- archiveMenu
// ---- tipitakaEditionSelection
export const setArchiveMenuTipitakaEditionSelection = (state, payload) => {
  state.archiveMenu.tipitakaEditionSelection = payload
}
// -- archiveMenu
// ---- tipitakaEdition
export const setArchiveMenuTipitakaEdition = (state, payload) => {
  state.archiveMenu.tipitakaEdition = payload
}
// -- archiveMenu
// ---- volumeSelection
export const setArchiveMenuVolumeSelection = (state, payload) => {
  const volume = find(state.dataSnapshot.tipitakaEdition,
    function (o) { return o.code === payload }).volume
  state.archiveMenu.volumeSelection = volume.map(i => {
    return {
      value: i.number,
      label: `${t('pageCommonReference.volume')}
        ${i.number}. ${i.name} (${i.totalPages} ${t('pageCommonReference.pages')})`,
      totalPages: i.totalPages
    }
  })
  // state.archiveMenu.volume = {}
}
// -- archiveMenu
// ---- volume
export const setArchiveMenuVolume = (state, payload) => {
  state.archiveMenu.volume = payload
}

// -------
// tcrItem
// -------
// ---- setTcrSet
export const setTcrSet = (state, payload) => {
  state.tcrItem.tcrSet = payload
}
// ---- setTcrSetDoc
export const setTcrSetDoc = (state, payload) => {
  state.tcrItem.tcrSetDoc = payload
}
// ---- setSelectedTcrItem
export const setSelectedTcrItem = (state, payload) => {
  state.tcrItem.selectedTcrItem = payload
}
// ---- setSelectedTcrItemRow
export const setSelectedTcrItemRow = (state, payload) => {
  state.tcrItem.selectedTcrItemRow = payload
}
// ---- setSelectedSiblingIndex
export const setSelectedSibling = (state, payload) => {
  state.tcrItem.selectedSibling.index = payload.index
  state.tcrItem.selectedSibling.length = payload.length
}
// ---- setTickedTcrItem
export const setTickedTcrItem = (state, payload) => {
  state.tcrItem.tickedTcrItem = payload
}
// ---- setUpdateTreeAfterCreate
export const setUpdateTreeAfterCreate = (state, payload) => {
  state.tcrItem.updateTreeAfterCreate = payload
}
// ---- setUpdateTreeAfterUpdate
export const setUpdateTreeAfterUpdate = (state, payload) => {
  state.tcrItem.updateTreeAfterUpdate = payload
}
// ---- setUpdateTreeAfterDelete
export const setUpdateTreeAfterDelete = (state, payload) => {
  state.tcrItem.updateTreeAfterDelete = payload
}
// setUpdateTreeAfterChangeParent
export const setUpdateTreeAfterChangeParent = (state, payload) => {
  state.tcrItem.updateTreeAfterChangeParent = payload
}
// setUpdateTreeAfterReorder
export const setUpdateTreeAfterReorder = (state, payload) => {
  state.tcrItem.updateTreeAfterReorder = payload
}

// -----------
// tcrData
// -----------
// ---- setUpdateTcrData
export const setUpdateTcrData = (state, payload) => {
  state.tcrData.updateTcrData = payload
}
export const setSelectedTcrData = (state, payload) => {
  state.tcrData.selectedTcrData = payload
}
export const setGotoWord = (state, payload) => {
  state.tcrData.gotoWord = payload
}

// -------
// archive
// -------
// -- imageScan
// ---- setImageScanPage
export const setImageScanPage = (state, payload) => {
  state.imageScan.page = payload
}
// -- imageScan
// ---- setPageNumber
export const setPageNumber = (state, payload) => {
  state.imageScan.pageNumber = payload
}
// -- imageScan
// ---- setImageScanUrl
export const setImageScanUrl = (state, payload) => {
  state.imageScan.imageUrl = payload
}
// -- imageWordList
// ---- setImageWordList
export const setImageWordList = (state, payload) => {
  state.imageWordList.wordList = payload
  state.imageWordList.numberOfLine = payload.length ? last(payload).lineNumber : 0
}
// -- imageWordList
// ---- setSelectWord
export const setSelectWord = (state, payload) => {
  state.imageWordList.selectWord = payload
}
// -- imageWordList
// ---- setSelectWordRange
export const setSelectWordRange = (state, payload) => {
  state.imageWordList.selectWordRange = payload
}
// -- imageWordList
// ---- setUpdateSelectWord
export const setUpdateSelectWord = (state, payload) => {
  state.imageWordList.updateSelectWord = payload
}

// -----------------
// referenceWordList
// -----------------
export const setFetchReferenceWordList = (state, payload) => {
  state.referenceWordList.fetchReferenceWordList = payload
}

// ----
// form
// ----
export const setFormCreate = (state, payload) => {
  state.form.create = payload
}
export const setFormUpdate = (state, payload) => {
  state.form.update = payload
}

// -------
// setting
// -------
export const setFontSize = (state, payload) => {
  state.settings.fontSize = payload
}
