<template>
  <div>getReturn:</div>
</template>

<script>
import { db } from 'src/boot/firebase'
import { simulateAsyncAPI, getPromiseDocs } from 'src/functions/manage-data.js'

export default {
  async setup () {
    await simulateAsyncAPI('A', 1000)
    const a = await getPromiseDocs(
      db.collection('tipitakaEdition')
    )
    console.log(a)
    await simulateAsyncAPI('C', 100)
    console.log('finish')
  }
}
</script>
