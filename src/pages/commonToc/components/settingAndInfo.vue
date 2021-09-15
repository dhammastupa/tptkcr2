<template>
  <div class="q-gutter-sm">
    <q-banner inline-actions class="bg-deep-purple-2 shadow-1">
      {{ $t('pageCommonToc.commonReference') }}
      <template v-slot:action>
        <q-btn
          v-if="commonToc.selected"
          flat round dense
          color="purple"
          icon="manage_search"
          @click="showReference"
        >
          <q-tooltip>{{ $t('pageCommonToc.showReference') }}</q-tooltip>
        </q-btn>
      </template>
    </q-banner>

    <div v-if="!isEmpty(commonToc.showReference)" class="q-pa-md">
      {{ $t('pageCommonToc.wordRange') }}:
      <li
        v-for="i in commonToc.showReference[0].content" :key="i.wordIndex"
        style="display:inline;"
      >
        <span class="text-deep-purple-10">
          <span v-if="maxBy(commonToc.showReference[0].content, 'wordIndex').id != i.id">
            <b>{{i.tipitakaEdition.toUpperCase()}}</b>&nbsp;&nbsp;
          </span>
          <q-badge outline color="primary" :label="i.word" />
          {{ $t('pageCommonToc.volumeNumber') }} {{i.volumeNumber}}
          {{ $t('pageCommonToc.pageNumber') }} {{i.pageNumber}}
          <span v-if="maxBy(commonToc.showReference[0].content, 'wordIndex').id != i.id">
            &nbsp;&nbsp;-&nbsp;&nbsp;
          </span>
        </span>
      </li>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { db } from 'src/boot/firebase'
import { getPromiseDocs } from 'src/functions/manage-data.js'
import { orderBy, isEmpty, maxBy } from 'lodash'

export default {
  setup () {
    // initial composible
    const $store = useStore()

    // initial getters commonToc
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // function
    // showReference
    async function showReference () {
      const doc = await getPromiseDocs(
        db.collection('commonRef')
          .where('commonToc', '==', commonToc.value.selected)
      )
      $store.commit('commonToc/setShowReference', doc)
    }

    // return
    return {
      commonToc,
      showReference,
      orderBy,
      isEmpty,
      maxBy
    }
  }
}
</script>
