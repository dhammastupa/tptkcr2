<template>
  <q-toolbar>
    <q-toolbar-title class="text-subtitle1">
      {{ variables.tocSet ? variables.tocSet.name : '' }}
    </q-toolbar-title>
  </q-toolbar>

  <!-- toc tree -->
  <q-tree
    ref="treeRef"
    :nodes="tocTree" node-key="id"
    v-model:selected="selected"
    v-model:ticked="ticked"
    tick-strategy="strict"
    selected-color="primary"
    default-expand-all
    accordion
    @update:selected="updateSelected(selected)"
    @update:ticked="updateTicked(ticked)"
  />

</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { db } from 'src/boot/firebase'
import { getPromiseDocs } from 'src/functions/manage-data.js'
import _ from 'lodash'

export default {
  setup () {
    // ------------------
    // initial composible
    // ------------------
    const $store = useStore()

    // ---------------
    // initial getters
    // ---------------
    const route = computed(() => { return $store.getters['settings/getRoute'] })
    const variables = computed(() => { return $store.getters['commonToc/getVariables'] })
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // ----------------
    // initial dispatch
    // ----------------
    $store.dispatch(
      'commonToc/fetchNodeRows',
      { tocSetId: route.value.params.id }
    )

    // -----------------
    // initial variables
    // -----------------
    const treeRef = ref(null)
    const selected = ref(null)
    const selectedLevel = ref([])
    const ticked = ref([])
    const tickedLevel = ref([])
    $store.commit('commonToc/setSelectedToc', '')
    $store.commit('commonToc/setTickedToc', [])

    // create toc
    const tocTree = computed(() => {
      function childTree (parentId) {
        const result = []
        const childNodes = _.filter(commonToc.value.nodeRows, { parent: parentId })
        if (childNodes) {
          childNodes.forEach(i => {
            const children = _.sortBy(childTree(i.id), 'sequence')
            result.push({
              id: i.id,
              sequence: i.sequence,
              label: i.label,
              children: children,
              row: i
            })
          })
        }
        return result
      }
      // create table of contents
      let result = []
      const parentNode = _.filter(commonToc.value.nodeRows, { parent: '' })
      parentNode.forEach(i => {
        const children = _.sortBy(childTree(i.id), 'sequence')
        result.push({
          id: i.id,
          sequence: i.sequence,
          label: i.label,
          children: children,
          row: i
        })
      })
      result = _.sortBy(result, 'sequence')
      return result
    })

    // ---------
    // functions
    // ---------
    // function findSibling of selected for up/downward
    async function findSiblings (selected) {
      let selectedSibling = []
      if (!_.isEmpty(selected)) {
        const parentNode = treeRef.value.getNodeByKey(selected)
        selectedSibling = await getPromiseDocs(
          db.collection('commonToc')
            .where('tocSetId', '==', route.value.params.id)
            .where('parent', '==', parentNode.row.parent)
            .orderBy('sequence', 'asc')
        )
      }
      $store.commit('commonToc/setSelectedSibling', selectedSibling)
      const selectedSiblingIndex = _.findIndex(selectedSibling, { id: selected })
      $store.commit('commonToc/setSelectedSiblingIndex', selectedSiblingIndex)
      // set menuItem
      $store.commit('commonToc/setMenuItems')
    }

    // function updateSelected
    function updateSelected (target) {
      // validator
      if (ticked.value.includes(selected.value)) {
        selected.value = null
      } else {
        $store.commit('commonToc/setSelectedToc', selected.value)
      }
      // push selected node
      const expandedNode = _.map(treeRef.value.getExpandedNodes(), 'id')
      const node2Display = (_.uniq(_.remove(['', target, ...expandedNode], o => { return o != null })))
      $store.commit('commonToc/setParentNode', node2Display)
      // find siblings of the selection for move up/downward
      findSiblings(selected.value)
      // dispatch for rebuild tree
      $store.dispatch(
        'commonToc/fetchNodeRows',
        { tocSetId: route.value.params.id }
      )
      checkLevel(selected, selectedLevel)
    }

    // function checkHasChild
    // async function checkHasChild (id) {
    //   const docs = await db.collection('commonToc')
    //     .where('parent', '==', id).get()
    //   $store.commit('commonToc/setSelectedHasChild', !docs.empty)
    // }

    // function updateTicked
    function updateTicked (target) {
      if (ticked.value.includes(selected.value)) {
        ticked.value.pop()
      } else {
        $store.commit('commonToc/setTickedToc', ticked.value)
      }
      $store.commit('commonToc/setMenuItems')
      checkLevel(ticked, tickedLevel)
    }

    // function checkLevel
    function checkLevel (source, target) {
      const result = []
      if (!_.isEmpty(source.value)) {
        function getRow (id) {
          return _.find(commonToc.value.nodeRows, { id: id })
        }
        if (_.isArray(source.value)) {
          source.value.forEach(i => {
            let level = 0
            let row = getRow(i)
            while (row.parent !== '') {
              level = level + 1
              row = getRow(row.parent)
            }
            result.push(level)
          })
        } else {
          let level = 0
          let row = getRow(source.value)
          while (row.parent !== '') {
            level = level + 1
            row = getRow(row.parent)
          }
          result.push(level)
        }
      }
      target.value = result
      $store.commit('commonToc/setSelectedLevel', selectedLevel.value[0])
      $store.commit('commonToc/setTickedLevel', _.min(tickedLevel.value))
      $store.commit('commonToc/setMenuItems')
    }

    // -------
    // watcher
    // -------
    // watch if route (tocSetID) change
    watch(route, function () {
      if (route.value.name === 'common-toc') {
        $store.dispatch(
          'commonToc/fetchNodeRows',
          { tocSetId: route.value.params.id }
        )
        $store.commit('commonToc/initialParentNode')
      }
    })

    // watch commonToc
    watch(commonToc.value, function () {
      if (_.isEmpty(commonToc.value.selected)) {
        selected.value = null
      }
      if (_.isEmpty(commonToc.value.ticked)) {
        ticked.value = []
      }
    })

    return {
      variables,
      commonToc,
      treeRef,
      tocTree,
      selected,
      ticked,
      updateSelected,
      updateTicked
    }
  }
}
</script>
