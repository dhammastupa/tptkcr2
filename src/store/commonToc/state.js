export default function () {
  return {
    dataSnapshot: {
      tipitakaEdition: [],
      tocSet: []
    },
    variables: {
      tocSet: {},
      tipitakaEdition: {},
      volumes: [],
      volume: {},
      page: {},
      imageUrl: '',
      wordlist: [],
      selectWord: {},
      selectWordRange: []
    },
    commonToc: {
      // menuitem
      create: true,
      update: false,
      upward: false,
      downward: false,
      changeParent: false,
      unselectNode: true,
      delete: false,
      // variables
      parentNode: [''],
      nodeRows: [],
      selected: '',
      selectedRow: {},
      selectedSibling: [],
      selectedSiblingIndex: -1,
      selectedLevel: null,
      ticked: [],
      tickedLevel: null,
      showReference: {}
    },
    form: {
      createForm: false,
      updateForm: false
    },
    pageFinderMenu: {
      viewMode: 'imageScan'
    }
  }
}
