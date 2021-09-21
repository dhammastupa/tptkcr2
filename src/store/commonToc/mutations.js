import { find, isEmpty } from 'lodash'

// dataSnapshot
export const setTipitakaEditionSelection = (state, payload) => {
  state.dataSnapshot.tipitakaEdition = payload
}

export const setVolumeSelection = (state, payload) => {
  const result = find(
    state.dataSnapshot.tipitakaEdition, { code: payload }
  )
  state.variables.volumes = result.volume
}

export const setTocSetSelection = (state, payload) => {
  state.dataSnapshot.tocSet = payload
}

// variables
export const setTocSet = (state, payload) => {
  if (state.dataSnapshot.tocSet) {
    const tocSetDoc = find(
      state.dataSnapshot.tocSet, payload
    )
    state.variables.tocSet = tocSetDoc
  }
}
export const setTipitakaEdition = (state, payload) => {
  const result = find(
    state.dataSnapshot.tipitakaEdition, { code: payload.value }
  )
  state.variables.tipitakaEdition = result
}

export const setVolume = (state, payload) => {
  if (payload) {
    const result = find(
      state.variables.volumes, { number: payload }
    )
    state.variables.volume = result
  } else {
    state.variables.volume = {}
  }
}

export const setPage = (state, payload) => {
  state.variables.page = payload
}

export const setWordList = (state, payload) => {
  state.variables.wordList = payload
}

export const setImageUrl = (state, payload) => {
  state.variables.imageUrl = payload
}

export const setSelectWord = (state, payload) => {
  state.variables.selectWord = payload
}
export const setSelectWordRange = (state, payload) => {
  state.variables.selectWordRange = payload
}

// commonToc : selected
export const setSelectedToc = (state, payload) => {
  state.commonToc.selected = payload
}

// commonToc : selectedRow
export const setSelectedRow = (state, payload) => {
  state.commonToc.selectedRow = payload
}

// commonToc : initialParentNode
export const initialParentNode = (state) => {
  state.commonToc.parentNode = ['']
}

// commonToc : setParentNode
export const setParentNode = (state, payload) => {
  state.commonToc.parentNode = payload
}

// commonToc : setNodeRows
export const setNodeRows = (state, payload) => {
  state.commonToc.nodeRows = payload
}

// commonToc : setSelectedSibling
export const setSelectedSibling = (state, payload) => {
  state.commonToc.selectedSibling = payload
}

// commonToc : selectedLevel
export const setSelectedLevel = (state, payload) => {
  state.commonToc.selectedLevel = payload
}

// commonToc : setSelectedSiblingIndex
export const setSelectedSiblingIndex = (state, payload) => {
  state.commonToc.selectedSiblingIndex = payload
}

// commonToc : ticked
export const setTickedToc = (state, payload) => {
  state.commonToc.ticked = payload
}

// commonToc : tickedLevel
export const setTickedLevel = (state, payload) => {
  state.commonToc.tickedLevel = payload
}

// commonToc : setShowReference
export const setShowReference = (state, payload) => {
  state.commonToc.showReference = payload
}

// setMenuItems
export const setMenuItems = (state) => {
  // set update menu item status
  if (isEmpty(state.commonToc.selected)) {
    state.commonToc.update = false
  } else {
    state.commonToc.update = true
  }
  // set upward menu item status
  if (state.commonToc.selected && state.commonToc.selectedSiblingIndex > 0) {
    state.commonToc.upward = true
  } else {
    state.commonToc.upward = false
  }
  // set downward menu item status
  if (state.commonToc.selected &&
    (state.commonToc.selectedSiblingIndex < state.commonToc.selectedSibling.length - 1)) {
    state.commonToc.downward = true
  } else {
    state.commonToc.downward = false
  }
  // set change parent menu item status
  if (isEmpty(state.commonToc.selected)) {
    state.commonToc.changeParent = false
  } else {
    if (state.commonToc.tickedLevel >= state.commonToc.selectedLevel) {
      state.commonToc.changeParent = true
    } else {
      state.commonToc.changeParent = false
    }
  }

  // set delete menu item status
  if (state.commonToc.ticked.length > 0) {
    state.commonToc.delete = true
  } else {
    state.commonToc.delete = false
  }
}

// form
export const setForm = (state, payload) => {
  state.form = payload
}

// pageFinderMenu
export const setViewMode = (state, payload) => {
  state.pageFinderMenu.viewMode = payload
}
