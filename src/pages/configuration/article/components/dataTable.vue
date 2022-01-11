<template>
  <!-- datatable -->
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      :title="$t($options.name)"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      row-key="docId"
      @row-click="onRowClick"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" :placeholder="$t('system.search')">
          <template v-slot:append>
            <q-icon name="search" />
            <q-btn flat color="white" text-color="primary" round icon="add"
              class="q-ma-md"
              @click="addBtnClick"
            />
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
import { join } from 'lodash'

export default {
  name: 'mainNavigation.article',

  emits: [
    'openTableRowClick',
    'onCreateBtnClick'
  ],

  setup (props, context) {
    // composable
    const $t = useI18n().t
    const { filter, rows } = useCrudForm(db.collection('article').orderBy('sequence', 'asc'))

    // function stripHtml
    function stripHtml (val) {
      return `${val.replace(/<\/?[^>]+(>|$)/g, '')}`
    }

    // datatable: columns
    const columns = ref(
      [
        {
          name: 'sequence',
          field: 'sequence',
          label: $t('pageArticle.sequence'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'title',
          field: 'title',
          label: $t('pageArticle.title'),
          sortable: true,
          align: 'left'
        },
        {
          name: 'body',
          field: 'body',
          label: $t('pageArticle.body'),
          format: val => stripHtml(val),
          classes: 'ellipsis',
          style: 'max-width: 150px',
          headerStyle: 'max-width: 150px',
          sortable: false,
          align: 'left'
        },
        {
          name: 'taxonomy',
          field: 'taxonomy',
          label: $t('pageArticle.taxonomy'),
          format: val => join(val, ', '),
          sortable: false,
          align: 'left'
        },
        {
          name: 'publishedOn',
          field: 'publishedOn',
          label: $t('pageArticle.publishedOn'),
          format: val => join(val, ', '),
          sortable: false,
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
