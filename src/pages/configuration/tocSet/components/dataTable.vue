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
  name: 'mainNavigation.tocSet',

  emits: [
    'openTableRowClick',
    'onCreateBtnClick'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const { filter, rows } = useCrudForm(db.collection('tocSet').orderBy('sequence', 'asc'))

    // datatable: columns
    const columns = ref(
      [
        {
          name: 'sequence',
          field: 'sequence',
          label: $t('pageTocSet.sequence'),
          sortable: true,
          align: 'right'
        },
        {
          name: 'name',
          field: 'name',
          label: $t('pageTocSet.name'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'description',
          field: 'description',
          label: $t('pageTocSet.description'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'language',
          field: 'language',
          label: $t('pageTocSet.language'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'script',
          field: 'script',
          label: $t('pageTocSet.script'),
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
