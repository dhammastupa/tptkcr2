export default function () {
  return {
    selection: {
      tipitakaEdition: [],
      volume: [],
      pages: []
    },
    variables: {
      tipitakaEdition: {},
      volume: '1',
      defaultVolume: '1',
      totalPages: 0,
      defaultPageRange: { min: 1, max: 20 },
      pageRange: { min: 1, max: 20 },
      tipitaka: {}
    },
    datatable: {
      querySnapshot: [],
      selectedRow: {},
      updateData: {}
    },
    form: {
      active: false,
      imageUrl: '',
      ruler: {
        active: false
      },
      editor: {
        fontSize: '15px',
        padding: '10px',
        paddingBottom: '20px',
        firstLine: {
          initial: 20,
          min: 0,
          max: 500,
          step: 0.5,
          color: 'green'
        },
        lineHeight: {
          initial: 20,
          min: 1,
          max: 50,
          step: 0.5,
          color: 'green'
        }
      }
    },
    create: {
      active: false
    }
  }
}
