<template>
  <!-- datatable -->
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      :title="$t($options.name)"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      row-key="uid"
      @row-click="onRowClick"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('system.search')">
          <template v-slot:append>
            <q-icon name="search" />
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
  name: 'mainNavigation.accesscontrolUser',

  emits: [
    'openTableRowClick',
    'onCreateBtnClick'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const { filter, rows } = useCrudForm(db.collection('user').orderBy('email', 'asc'))

    // datatable: columns
    const columns = ref(
      [
        {
          name: 'email',
          field: 'email',
          label: $t('pageAccessControl.email'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'firstName',
          field: 'firstName',
          label: $t('pageAccessControl.firstName'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'lastName',
          field: 'lastName',
          label: $t('pageAccessControl.lastName'),
          sortable: true,
          align: 'left'
        }
      ]
    )

    function onRowClick (evt, row) {
      context.emit('openTableRowClick', row)
    }

    // return
    return {
      columns,
      rows,
      filter,
      onRowClick
    }
  }
}
</script>
