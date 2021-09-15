<template>
  <!-- datatable -->
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      :title="$t($options.name)"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      row-key="id"
      @row-click="onRowClick"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('system.search')">
          <template v-slot:append>
            <q-icon name="search" />
            <q-btn flat color="white" text-color="primary" round icon="add"
              class="q-ma-md"
              @click="addBtnClick" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { db } from 'src/boot/firebase.js'
import useCrudForm from 'src/hooks/crud.js'

export default {
  name: 'mainNavigation.webContent',

  emits: [
    'openTableRowClick',
    'onCreateBtnClick'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const { filter, rows } = useCrudForm(db.collection('webContent').orderBy('routeName', 'asc'))

    // function stripHtml
    function stripHtml (val) {
      return `${val.replace(/<\/?[^>]+(>|$)/g, '')}`
    }

    // datatable: columns
    const columns = ref(
      [
        {
          name: 'routeName',
          field: 'routeName',
          label: $t('pageWebContent.routeName'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'name',
          field: 'name',
          label: $t('pageWebContent.name'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'content',
          field: 'content',
          label: $t('pageWebContent.content'),
          format: val => stripHtml(val),
          classes: 'ellipsis',
          style: 'max-width: 150px',
          headerStyle: 'max-width: 150px',
          sortable: true,
          align: 'left'
        },
        {
          name: 'status',
          field: 'status',
          label: $t('pageWebContent.status'),
          sortable: true,
          align: 'left'
        }
      ]
    )

    // function addBtnClick
    function addBtnClick () {
      context.emit('onCreateBtnClick')
    }

    function onRowClick (evt, row) {
      context.emit('openTableRowClick', row)
    }

    // return
    return {
      columns,
      rows,
      filter,
      addBtnClick,
      onRowClick
    }
  }
}
</script>

<style scoped>
.blocktext {
  display: block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
