<template>
  <div v-if="rulerActive"
    v-draggable="{
      axis: 'y',
      positionOffset: {x: 20, y: 300}
    }"
    :style="{
      'position': 'absolute',
      'z-index': '999',
      'width': screenWidth
    }"
  >
    <q-card class="my-ruler">
      <q-card-section
        class="bg-positive"
        style="opacity: 0.8"
        >
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-range
          v-model="range"
          :min="0"
          :max="100"
          drag-range
          color="green"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'rulerBar',

  props: [
    'rulerActive'
  ],

  setup () {
    // init vars
    const range = ref({
      min: 25,
      max: 75
    })
    const screenWidth = `${screen.width - (screen.width * 0.05)}px`

    return {
      range,
      screenWidth
    }
  }
}
</script>

<style scoped>
  .my-ruler {
    background: transparent;
  }
</style>
