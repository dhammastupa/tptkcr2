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
        <q-item v-for="i in list" :key=i.id>
          <q-item-section>
            <q-item-label>{{ $t(`meritBook.${i.action}`) }}</q-item-label>
            <q-item-label style="font-size: 0.8em;" caption lines="2">
              <div style="line-height: 1.6em;" v-if="i.collection == 'tipitaka'">
                {{ $t('meritBook.tipitakaEdition') }}
                  {{ find(tipitakaEdition, ['id', i.document.tipitakaEdition])['name'] }}<br>
                  {{ $t('meritBook.volumeNumber') }} {{ i.document.volumeNumber }}
                  {{ find(find(tipitakaEdition, ['id', i.document.tipitakaEdition])['volume'], ['number', i.document.volumeNumber])['name'] }},
                  {{ $t('meritBook.pageNumber') }} {{ i.document.pageNumber }}
              </div>
              <div v-if="i.collection == 'commonToc'">
                {{ i.document.label }}<br>
                {{ find(tocSet, ['id', i.document.tocSetId])['name'] }} {{ find(tocSet, ['id', i.document.tocSetId])['description'] }}
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

export default {

  setup () {
    // composable
    const $store = useStore()

    // getters uid
    const userID = computed(() => { return $store.getters['auth/uid'] })

    // variables
    const list = ref([])
    const tipitakaEdition = ref([])
    const tocSet = ref([])
    const limit = ref(30)

    // function
    // get MeritBook
    function getMeritBook () {
      return db.collection('meritBook')
        .where('userID', '==', userID.value)
        .orderBy('createdOn', 'desc')
        .limit(limit.value)
        .get()
    }
    // getMeritRec
    async function getMeritRec () {
      // get tipitakaEdition
      const tipitakaEditionDocs = await db.collection('tipitakaEdition').get()
      tipitakaEdition.value = tipitakaEditionDocs.empty ? [] : tipitakaEditionDocs.docs.map(doc => doc.data())
      // get tocSet
      const tocSetDocs = await db.collection('tocSet').get()
      tocSet.value = tocSetDocs.empty ? [] : tocSetDocs.docs.map(doc => doc.data())
      // get meritBook
      const meritBookDocs = await getMeritBook()
      list.value = meritBookDocs.empty ? [] : meritBookDocs.docs.map(doc => doc.data())
    }
    getMeritRec()

    watch(limit, async function () {
      const meritBookDocs = await getMeritBook()
      list.value = meritBookDocs.empty ? [] : meritBookDocs.docs.map(doc => doc.data())
    })

    return {
      find,
      list,
      limit,
      tipitakaEdition,
      tocSet
    }
  }
}
</script>
