<template>
  <q-card class="q-mb-sm">
    <q-card-section class="bg-deep-purple-2 text-black">
      <div class="row">
        <div class="col">{{ $t('pageProfile.meritBook') }}</div>
        <div class="col-3">
          <q-select dense v-model="limit"
            :options="[30, 50, 100]"
            :label="$t('pageProfile.lastMeritAction')"
          >
            <template v-slot:append>
              <q-icon name="receipt_long" />
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-list>
        <q-item v-for="i in list" :key=i.docId>
          <q-item-section>
            <q-item-label>{{ $t(`meritBook.${i.action}`) }}</q-item-label>
            <q-item-label style="font-size: 0.8em;" caption lines="2">
              <div style="line-height: 1.6em;" v-if="i.collection == 'tipitaka'">
                {{ $t('meritBook.tipitakaEdition') }}
                  {{ find(tipitakaEdition, ['docId', i.document.tipitakaEdition])['name'] }}<br>
                  {{ $t('meritBook.volumeNumber') }} {{ i.document.volumeNumber }}
                  {{ find(find(tipitakaEdition, ['docId', i.document.tipitakaEdition])['volume'], ['number', i.document.volumeNumber])['name'] }},
                  {{ $t('meritBook.pageNumber') }} {{ i.document.pageNumber }}
              </div>
              <div v-if="i.collection == 'commonToc'">
                {{ i.document.label }}<br>
                {{ find(tcrSet, ['docId', i.document.tcrSetId])['name'] }} {{ find(tcrSet, ['docId', i.document.tcrSetId])['description'] }}
              </div>
              <div v-else>
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>{{ $filters.timeStampToDate(i.createdOn) }}</q-item-label>
            <q-item-label>{{ i.collection }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { db } from 'src/boot/firebase.js'
import { find } from 'lodash'
import { getPromiseDocs } from 'src/functions/manage-data.js'

export default {

  setup () {
    // composable
    const $store = useStore()

    // getters uid
    const userID = computed(() => { return $store.getters['auth/uid'] })

    // variables
    const list = ref([])
    const tipitakaEdition = ref([])
    const tcrSet = ref([])
    const limit = ref(30)
    // MeritBook
    const meritBook = db.collection('meritBook')
      .where('userID', '==', userID.value)
      .orderBy('createdOn', 'desc')
      .limit(limit.value)

    // function
    // getMeritRec
    async function getMeritRec () {
      // get tipitakaEdition
      tipitakaEdition.value = await getPromiseDocs(db.collection('tipitakaEdition'))
      // get tcrSet
      tcrSet.value = getPromiseDocs(db.collection('tcrSet'))
      // get meritBook
      list.value = await getPromiseDocs(meritBook)
    }
    getMeritRec()

    watch(limit, async function () {
      list.value = await getPromiseDocs(meritBook)
    })

    return {
      find,
      list,
      limit,
      tipitakaEdition,
      tcrSet
    }
  }
}
</script>
