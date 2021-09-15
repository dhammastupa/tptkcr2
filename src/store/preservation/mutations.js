// selection

export const setTipitakaEditionSelection = (state, payload) => {
  state.selection.tipitakaEdition = payload
}

export const setVolumeSelection = (state, payload) => {
  state.selection.volume = payload
}

export const setPageSelection = (state, payload) => {
  state.selection.pages = payload
}

// variables
export const setTipitakaEdition = (state, payload) => {
  state.variables.tipitakaEdition = payload
}

export const setVolume = (state, payload) => {
  state.variables.volume = payload
}

export const setTotalPages = (state, payload) => {
  state.variables.totalPages = payload
}

export const setPageRange = (state, payload) => {
  state.variables.pageRange = payload
}

export const setTipitaka = (state, payload) => {
  state.variables.tipitaka = payload
}

// datatable
export const setQuerySnapshot = (state, payload) => {
  state.datatable.querySnapshot = payload
}

export const setSelectedRow = (state, payload) => {
  state.datatable.selectedRow = payload
}

export const setUpdateData = (state, payload) => {
  state.datatable.updateData = payload
}

// form
export const setDataForm = (state, payload) => {
  state.form.active = payload.active
}

export const setImageUrl = (state, payload) => {
  state.form.imageUrl = payload
}

export const setRulerActive = (state, payload) => {
  state.form.ruler.active = payload
}

export const setFirstLine = (state, payload) => {
  state.form.editor.firstLine.initial = payload
}

export const setLineHeight = (state, payload) => {
  state.form.editor.lineHeight.initial = payload
}

export const setFontSize = (state, payload) => {
  state.form.editor.fontSize = payload
}

// create
export const setCreateForm = (state, payload) => {
  state.create.active = payload.active
}
