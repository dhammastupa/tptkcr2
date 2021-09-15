import { find, range } from 'lodash'
import { getDocs } from 'src/functions/manage-data.js'
import { db, storage } from 'src/boot/firebase'

// ====================
// header action
// ====================
export async function headerAction ({ state, commit, dispatch }, payload) {
  // tipitakaEdition selection
  const tipitakaEditionSelection = []
  const tipitakaEditionRows = await getDocs(db.collection('tipitakaEdition'))

  tipitakaEditionRows.forEach((doc) => {
    tipitakaEditionSelection.push({
      value: doc.code,
      label: doc.name
    })
  })
  commit('setTipitakaEditionSelection', tipitakaEditionSelection)

  // --------------------
  // selected Edtion
  // --------------------
  const selectedEdition = find(
    tipitakaEditionRows,
    { code: payload }
  )
  commit('setTipitakaEdition', selectedEdition)

  // --------------------
  // volume selection
  // --------------------
  const volumeSelection = []
  selectedEdition.volume.forEach(el => {
    volumeSelection.push({
      value: el.number,
      label: el.number + ') ' + el.name,
      pages: parseInt(el.totalPages)
    })
  })
  commit('setVolumeSelection', [])
  commit('setVolumeSelection', volumeSelection)

  // --------------------
  // get total pages in selected volume
  // --------------------
  dispatch('findTotalPages')
}

// ====================
// on volume change
// ====================
export function onVolumeChange ({ state, commit, dispatch }, payload) {
  commit('setVolume', payload)
  commit('setPageRange', state.variables.defaultPageRange)
  dispatch('findTotalPages')
}

// ====================
// find total pages
// ====================
export function findTotalPages ({ state, commit }) {
  const result = find(
    state.selection.volume,
    ['value', state.variables.volume]
  )
  commit('setTotalPages', result.pages)
  commit('setPageSelection',
    range(1, result.pages + 1)
  )
}

// ====================
// get image url
// ====================
export function getImageUrl ({ state, commit }) {
  const row = state.datatable.selectedRow

  if (row) {
    storage.ref()
      .child(`${row.imageReference}`)
      .getDownloadURL()
      .then(url => {
        commit('setImageUrl', url)
      })
  }
}
