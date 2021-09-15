<template>
  <div v-html="content"></div>
</template>

<script>
import { ref } from 'vue'
import { db } from 'src/boot/firebase.js'
import { getPromiseDocs } from 'src/functions/manage-data'
import { isEmpty, head } from 'lodash'

export default {
  name: 'webContent',

  props: ['routeName'],

  async setup (props) {
    const data = ref(null)
    const content = ref(null)

    try {
      data.value = await getPromiseDocs(
        db.collection('webContent')
          .where('routeName', '==', props.routeName)
      )
    } catch (e) {
      console.error(e)
    }

    if (!isEmpty(data)) {
      content.value = head(data.value).content
    }

    return {
      data,
      content
    }
  }
}
</script>
