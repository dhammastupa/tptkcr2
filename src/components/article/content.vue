<template>
  <div class="justify-center q-pt-sm">
    <q-card
      v-touch-swipe.mouse.left.right="handleSwipe"
      class="no-margin full-width">
      <q-item class="q-py-lg bg-deep-purple-2">
        <q-item-section avatar>
          <q-avatar>
            <img
              alt="dhammacetiya"
              src="~assets/system-images/lotus-flower-1.jpg"
            >
          </q-avatar>
        </q-item-section>

        <q-item-section class="q-px-sm">
          <q-item-label class="text-subtitle1">{{ title }}</q-item-label>
          <q-item-label caption>
            {{ join(taxonomy, ', ') }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator/>

      <q-card-section class="q-py-lg myDiv">
        <div class="bg"></div>
        <div v-html="body"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { db } from 'src/boot/firebase.js'
import { getPromiseDocs } from 'src/functions/manage-data'
import { isEmpty, head, join } from 'lodash'
import { date } from 'quasar'

export default {
  name: 'articleContent',

  async setup () {
    const data = ref(null)
    const sequence = ref('')
    const content = ref('')
    const title = ref('')
    const body = ref('')
    const taxonomy = ref([])
    const timeStamp = Date.now()
    const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')

    // -----------------------
    // initial article content
    // -----------------------
    loadArticle()

    // ---------
    // functions
    // ---------
    // loadArticle
    async function loadArticle (direction = null) {
      // left => next article
      if (direction === 'left') {
        if (!isEmpty(content.value)) {
          data.value = await getPromiseDocs(
            db.collection('article')
              .where('sequence', '>', sequence.value)
              .orderBy('sequence', 'asc')
              .limit(1)
          )
        }
      // right => prev article
      } else if (direction === 'right') {
        if (!isEmpty(content.value)) {
          data.value = await getPromiseDocs(
            db.collection('article')
              .where('sequence', '<', sequence.value)
              .orderBy('sequence', 'desc')
              .limit(1)
          )
        }
      // neither => today
      } else {
        data.value = await getPromiseDocs(
          db.collection('article')
            .where('publishedOn', 'array-contains', formattedString)
        )
      }
      // check data
      if (!isEmpty(data.value)) {
        content.value = head(data.value)
        // set return values
        content.value = head(data.value)
        sequence.value = content.value.sequence
        title.value = content.value.title
        body.value = content.value.body
        taxonomy.value = content.value.taxonomy
      }
    }

    // handleSwipe
    function handleSwipe ({ evt, ...newInfo }) {
      loadArticle(newInfo.direction)
    }

    // ------
    // return
    // ------
    return {
      // local vars
      sequence,
      title,
      body,
      taxonomy,
      // functions
      join,
      handleSwipe
    }
  }
}
</script>

<style scoped>
.my-card {
  width: 100%;
}
</style>
