<template>
  <!-- toolbar -->
  <q-toolbar>
    <q-toolbar-title class="text-subtitle1">
      {{ tcrItem.tcrSetDoc ? tcrItem.tcrSetDoc.name : '' }}
    </q-toolbar-title>
  </q-toolbar>

  <!-- tcr-tree -->
  <q-tree
    ref="treeRef"
    :nodes="tcrTree" node-key="docId"
    v-model:selected="selected"
    v-model:ticked="ticked"
    v-model:expanded="expanded"
    tick-strategy="strict"
    selected-color="primary"
    default-expand-all
    class="customFontSize"
    @lazy-load="onLazyLoad"
    @update:selected="updateSelected(selected)"
    @update:ticked="updateTicked(ticked)"
    @update:expanded="updateExpanded(expanded)"
  />
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { db } from 'src/boot/firebase.js'
import { getPromiseDocs, updateDoc } from 'src/functions/manage-data'
import { flattenDepth, isEmpty, uniq, findIndex, nth } from 'lodash'

export default {
  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()

    // --------
    // dispatch
    // --------
    $store.dispatch('commonReference/fetchTcrSet')

    // --------------------------
    // getters (global variables)
    // --------------------------
    // tcrItem
    const tcrItem = computed(() => { return $store.getters['commonReference/getTcrItem'] })

    // ---------------
    // local variables
    // ---------------
    // route
    const route = computed(() => { return $store.getters['settings/getRoute'] })
    // tcrSetID
    const tcrSetID = computed(() => {
      let result = null
      if (route.value.name === 'common-reference') { result = route.value.params.id }
      return result
    })
    // treeOperation
    const treeRef = ref(null)
    const tcrTree = ref([])
    const rootNode = ref([])
    const selected = ref('')
    const tcrNode = ref({})
    const selectSibling = ref({
      siblingArray: [],
      index: 0,
      length: 0
    })
    const ticked = ref([])
    const tickedAndChildrenIds = ref([])
    const expanded = ref([])
    $store.commit('commonReference/setSelectedTcrItem', '')
    $store.commit('commonReference/setSelectedTcrItemRow', {})
    $store.commit('commonReference/setTickedTcrItem', [])

    // initial tree
    function initialTree () {
      createTree('').then(result => {
        rootNode.value = result
        tcrTree.value = result
      })
    }
    initialTree()

    // -----
    // watch
    // -----
    // tcrSetId
    watch(tcrSetID, function () {
      selected.value = ''
      initialTree()
    })
    watch(selected, function () {
      $store.commit('commonReference/setTcrItemMenu')
      // tcrNode
      if (selected.value) {
        tcrNode.value = treeRef.value.getNodeByKey(selected.value)
      } else {
        tcrNode.value = {}
      }
      // selectSibling
      if (tcrNode.value.parent) {
        selectSibling.value.siblingArray = treeRef.value.getNodeByKey(tcrNode.value.parent).children
      } else {
        selectSibling.value.siblingArray = rootNode.value
      }
      selectSibling.value.index = findIndex(selectSibling.value.siblingArray, { docId: selected.value }) + 1
      selectSibling.value.length = selectSibling.value.siblingArray.length
      $store.commit('commonReference/setSelectedSibling',
        {
          index: selectSibling.value.index,
          length: selectSibling.value.length
        }
      )
    })
    // ticked
    watch(ticked, function () {
      $store.commit('commonReference/setTcrItemMenu')
    })
    // tcrItem
    watch(tcrItem.value, async function () {
      // selectedTcrITem
      if (isEmpty(tcrItem.value.selectedTcrItem)) {
        selected.value = ''
      }
      // tickedTcrItem
      if (isEmpty(tcrItem.value.tickedTcrItem)) {
        ticked.value = []
      }
      // updateTreeAfterCreate
      if (tcrItem.value.updateTreeAfterCreate) {
        await undateTreeBaseOnSelected()
        $store.commit('commonReference/setUpdateTreeAfterCreate', false)
        clearValue()
      }
      // updateTreeAfterUpdate
      if (tcrItem.value.updateTreeAfterUpdate) {
        // get parent id
        const parentId = [treeRef.value.getNodeByKey(selected.value).parent]
        await updateTreeBaseOnSelectedChild(parentId)
        $store.commit('commonReference/setUpdateTreeAfterUpdate', false)
        clearValue()
      }
      // updateTreeAfterDelete
      if (tcrItem.value.updateTreeAfterDelete) {
        // get parent id
        let parentIds = []
        ticked.value.forEach(i => {
          parentIds.push(treeRef.value.getNodeByKey(i).parent)
        })
        parentIds = uniq(parentIds)
        await updateTreeBaseOnSelectedChild(parentIds)
        $store.commit('commonReference/setUpdateTreeAfterDelete', false)
        clearValue()
      }
      // updateTreeAfterReorder
      if (tcrItem.value.updateTreeAfterReorder) {
        // get parent id
        const parentId = [treeRef.value.getNodeByKey(selected.value).parent]
        await updateTreeBaseOnSelectedChild(parentId)
        $store.commit('commonReference/setUpdateTreeAfterReorder', false)
        clearValue()
      }
      // updateTreeAfterChangeParent
      if (tcrItem.value.updateTreeAfterChangeParent) {
        // get parent id
        let parentIds = []
        ticked.value.forEach((i) => {
          parentIds.push(treeRef.value.getNodeByKey(i).parent)
          updateDoc(
            db.collection('tcrItem').doc(i),
            { parent: selected.value }
          ).then(() => {
            parentIds = uniq(parentIds)
            undateTreeBaseOnSelected().then(() => {
              updateTreeBaseOnSelectedChild(parentIds).then(() => {
                $store.commit('commonReference/setUpdateTreeAfterChangeParent', false)
                clearValue()
              })
            })
          })
        })
      }
      // selectedUpward
      if (tcrItem.value.selectedUpward) {
        const target = nth(selectSibling.value.siblingArray, selectSibling.value.index - 2)
        $store.dispatch('commonReference/updateListOrder', {
          selectedId: selected.value,
          targetId: target.docId
        })
        $store.commit('commonReference/setSelectedUpward', false)
      }
      // selectedDownward
      if (tcrItem.value.selectedDownward) {
        const target = nth(selectSibling.value.siblingArray, selectSibling.value.index)
        $store.dispatch('commonReference/updateListOrder', {
          selectedId: selected.value,
          targetId: target.docId
        })
        $store.commit('commonReference/setSelectedDownward', false)
      }
    })

    // ---------
    // functions
    // ---------
    // onLazyLoad
    async function onLazyLoad ({ node, key, done, fail }) {
      try {
        const result = await createTree(key)
        done(result)
      } catch (error) {
        console.log(error)
      }
    }

    // function createTree
    function createTree (key) {
      return new Promise((resolve, reject) => {
        const commonReference = db.collection('tcrItem')
          .where('tcrSetId', '==', tcrSetID.value)
          .where('parent', '==', key)
          .orderBy('sequence', 'asc')
        getPromiseDocs(commonReference).then(tcrItem => {
          const result = []
          tcrItem.forEach(i => {
            i.lazy = true
            result.push(i)
          })
          resolve(result)
        })
      })
    }

    // updateSelected
    function updateSelected (target) {
      // validator
      if (tickedAndChildrenIds.value.includes(selected.value)) {
        selected.value = ''
      } else {
        $store.commit('commonReference/setSelectedTcrItem', (selected.value || ''))
        $store.dispatch('commonReference/fetchSelectedTcrItem', selected.value)
        $store.commit('commonReference/setUpdateTcrData', true)
      }
    }

    // function updateTicked
    function updateTicked (target) {
      // not allow to tick if ticked value is includes selected value
      if (ticked.value.includes(selected.value)) {
        ticked.value.pop()
      } else {
        tickedAndChildrenIds.value = []
        ticked.value.forEach(n => {
          const node = treeRef.value.getNodeByKey(n)
          tickedAndChildrenIds.value.push(findAllByKey(node, 'docId'))
        })
        tickedAndChildrenIds.value = flattenDepth(tickedAndChildrenIds.value)
        $store.commit('commonReference/setTickedTcrItem', ticked.value)
      }
      // not allow to select if selected value is includes in tickedAndChildrenIds
      if (selected.value) {
        if (tickedAndChildrenIds.value.includes(selected.value)) {
          selected.value = ''
        }
      }
    }

    // function updateExpanded
    function updateExpanded (expanded) {
      updateTicked(ticked.value)
    }

    // function findAllByKey
    function findAllByKey (obj, keyToFind) {
      return Object.entries(obj)
        .reduce((acc, [key, value]) => (key === keyToFind)
          ? acc.concat(value)
          : (typeof value === 'object')
              ? acc.concat(findAllByKey(value, keyToFind))
              : acc, [])
    }

    // undateTreeBaseOnSelected
    function undateTreeBaseOnSelected () {
      return new Promise((resolve, reject) => {
        if (selected.value) {
          createTree(selected.value)
            .then((tree) => {
              tcrNode.value.children = tree
              resolve()
            })
        } else {
          resolve()
        }
      })
    }

    // updateTreeBaseOnSelectedChild
    function updateTreeBaseOnSelectedChild (parentIds) {
      return new Promise((resolve, reject) => {
        let allId = 0
        parentIds.forEach(parentId => {
          createTree(parentId).then(tree => {
            if (isEmpty(tree)) {
              treeRef.value.getNodeByKey(parentId).children = ''
            } else {
              treeRef.value.getNodeByKey(parentId).children = tree
            }
            allId += 1
            if (parentIds.length === allId) {
              resolve()
            }
          })
        })
      })
    }
    // clear global values
    function clearValue () {
      selected.value = ''
      ticked.value = []
      tickedAndChildrenIds.value = []
      $store.commit('commonReference/setSelectedTcrItem', '')
      $store.commit('commonReference/setSelectedTcrItemRow', {})
      $store.commit('commonReference/setTickedTcrItem', [])
      $store.commit('commonReference/setTcrItemMenu')
    }

    return {
      // global vars
      tcrItem,
      // local vars
      treeRef,
      tcrTree,
      selected,
      ticked,
      expanded,
      tickedAndChildrenIds,
      // functions
      updateSelected,
      updateTicked,
      updateExpanded,
      onLazyLoad
    }
  }
}
</script>
