export default function () {
  return {
    // ------------
    // dataSnapshot
    // ------------
    dataSnapshot: {
      tipitakaEdition: [],
      tcrSet: []
    },

    // -------
    // toolbar
    // -------
    // - tcrItemMenu
    tcrItemMenu: {
      create: true,
      update: false,
      upward: false,
      downward: false,
      changeParent: false,
      unselectItem: true,
      delete: false
    },
    // - archiveMenu
    archiveMenu: {
      viewModeSelection: [
        { value: 'imageScan', slot: 'imageScan' },
        { value: 'imageWordList', slot: 'imageWordList' },
        { value: 'referenceWordList', slot: 'referenceWordList' }
      ],
      viewMode: 'imageScan',
      tipitakaEditionSelection: [],
      tipitakaEdition: {},
      volumeSelection: [],
      volume: {}
    },

    // -------
    // tcrItem
    // -------
    tcrItem: {
      tcrSet: {},
      tcrSetDoc: {},
      setRootNode: [],
      selectedTcrItem: '',
      selectedTcrItemRow: {},
      selectedSibling: {
        index: 0,
        length: 0
      },
      tickedTcrItem: [],
      updateTreeAfterCreate: false,
      updateTreeAfterUpdate: false,
      updateTreeAfterDelete: false,
      updateTreeAfterChangeParent: false,
      updateTreeAfterReorder: false,
      selectedUpward: false,
      selectedDownward: false
    },

    // -----------
    // tcrData
    // -----------
    tcrData: {
      updateTcrData: false,
      selectedTcrData: {},
      gotoWord: {}
    },

    // ---------
    // archive
    // ---------
    // imageScan
    imageScan: {
      pageNumber: 1,
      page: {},
      imageUrl: ''
    },
    // imageWordList
    imageWordList: {
      wordList: [],
      numberOfLine: 0,
      selectWord: {},
      selectWordRange: [],
      updateSelectWord: false
    },

    // -----------------
    // referenceWordList
    // -----------------
    referenceWordList: {
      fetchReferenceWordList: false
    },

    // ----
    // form
    // ----
    form: {
      create: false,
      update: false
    },

    // -----
    // setting
    // -----
    settings: {
      fontSize: '14px'
    }
  }
}
