<template>
  <div
    v-if="rulerActive"
    class="row"
  >
    <div
      v-draggable="{
        axis: 'y',
        positionOffset: {x: 0, y: 300}
      }"
      class="col-12 z-top absolute"
    >
      <q-card class="my-ruler no-barder no-box-shadow">
        <Draggable>
          <q-btn round color="green" icon="open_with" />
        </Draggable>

        <div>
          <q-range
            v-model="range"
            :min="0"
            :max="100"
            drag-range
            color="green"
          />
        </div>
      </q-card>
    </div>
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
      min: 54,
      max: 56
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
