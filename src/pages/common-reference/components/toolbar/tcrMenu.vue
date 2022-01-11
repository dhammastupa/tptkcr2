<template>
  <q-toolbar class="col-3 text-white q-gutter-xs">
    <!-------------->
    <!-- add Item -->
    <!-------------->
    <q-btn
      flat round dense
      text-color="secondary"
      icon="add_circle_outline"
      :disable="!tcrItemMenu.create"
      @click="createItem"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.createItem') }}
      </q-tooltip>
    </q-btn>
    <!--------------->
    <!-- edit Item -->
    <!--------------->
    <q-btn
      flat round dense
      text-color="primary"
      icon="edit_note"
      :disable="!tcrItemMenu.update"
      @click="updateItem"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.updateItem') }}
      </q-tooltip>
    </q-btn>
    <!------------>
    <!-- upward -->
    <!------------>
    <q-btn
      flat round dense
      text-color="deep-purple-9"
      icon="arrow_upward"
      :disable="!tcrItemMenu.upward"
      @click="upward"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.upward') }}
      </q-tooltip>
    </q-btn>
    <!-------------->
    <!-- downward -->
    <!-------------->
    <q-btn
      flat round dense
      text-color="deep-purple-9"
      icon="arrow_downward"
      :disable="!tcrItemMenu.downward"
      @click="downward"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.downward') }}
      </q-tooltip>
    </q-btn>
    <!------------------>
    <!-- changeParent -->
    <!------------------>
    <q-btn
      flat round dense
      text-color="teal-9"
      icon="escalator_warning"
      :disable="!tcrItemMenu.changeParent"
      @click="changeParent"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.changeParent') }}
      </q-tooltip>
    </q-btn>
    <!-------------->
    <!-- clearAll -->
    <!-------------->
    <q-btn
      flat round dense
      text-color="grey-1"
      icon="clear_all"
      :disable="!tcrItemMenu.unselectItem"
      @click="unselectItem"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.unselectItem') }}
      </q-tooltip>
    </q-btn>
    <!---------------->
    <!-- deleteItem -->
    <!---------------->
    <q-btn
      flat round dense
      icon="clear"
      text-color="red"
      :disable="!tcrItemMenu.delete"
      @click="deleteItem"
    >
      <q-tooltip>
        {{ $t('pageCommonReference.deleteItem') }}
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default {
  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // -------
    // getters
    // -------
    const tcrItemMenu = computed(() => { return $store.getters['commonReference/getTcrItemMenu'] })

    // function createItem
    function createItem () {
      $store.commit('commonReference/setFormCreate', true)
      $store.commit('commonReference/setFormUpdate', false)
    }

    // function updateItem
    function updateItem () {
      $store.commit('commonReference/setFormCreate', false)
      $store.commit('commonReference/setFormUpdate', true)
    }

    // function upward
    function upward () {
      $store.commit('commonReference/setSelectedUpward', true)
    }

    // function downward
    function downward () {
      $store.commit('commonReference/setSelectedDownward', true)
    }

    // function changeParent
    function changeParent () {
      $q.dialog({
        title: $t('system.confirm'),
        message: $t('pageCommonReference.changeParent'),
        persistent: true,
        ok: {
          label: $t('system.ok'),
          flat: true,
          color: 'negative'
        },
        cancel: {
          label: $t('system.cancel'),
          flat: true
        }
      }).onOk(() => {
        $store.dispatch('commonReference/changeParent')
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    }

    // function unselectItem
    function unselectItem () {
      $store.commit('commonReference/setSelectedTcrItem', '')
      $store.commit('commonReference/setSelectedTcrItemRow', {})
      $store.commit('commonReference/setTickedTcrItem', [])
      $store.commit('commonReference/setTcrItemMenu')
    }

    // function deleteItem
    function deleteItem () {
      $q.dialog({
        title: $t('system.confirm'),
        message: $t('system.confirmToDelete'),
        persistent: true,
        ok: {
          label: $t('system.ok'),
          flat: true,
          color: 'negative'
        },
        cancel: {
          label: $t('system.cancel'),
          flat: true
        }
      }).onOk(() => {
        $store.dispatch('commonReference/deleteTcrItem')
      }).onOk(() => {
        console.log('>>>> second OK catcher')
      }).onCancel(() => {
        console.log('>>>> Cancel')
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel')
      })
    }

    return {
      createItem,
      updateItem,
      upward,
      downward,
      changeParent,
      unselectItem,
      deleteItem,
      tcrItemMenu
    }
  }
}
</script>
