export function getRoute (state) {
  return state.route
}

export function userName (state) {
  return state.firstName + ' ' + state.lastName
}

export function profileMenu (state) {
  return state.profileMenu
}

export function nonRestrictedMenu (state) {
  return state.nonRestrictedMenu
}

export function preservationMenu (state) {
  return state.preservationMenu
}

export function commonReferenceMenu (state) {
  return state.commonReferenceMenu
}

export function configurationMenu (state) {
  return state.configurationMenu
}

export function accessControlMenu (state) {
  return state.accessControlMenu
}
