<template>
  <q-page>
    <q-splitter
      v-model="splitterModel"
      style="height: 90vh"
    >
      <!-- before -->
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="q-pa-md row items-start q-gutter-md">
            <!-- wordListDataRepair -->
            <div class="col-auto">
              <wordList-data-repair
                @updateLog="updateLog"
                @playSound="playSound"
              >
              </wordList-data-repair>
            </div>
            <!-- end wordListDataRepair  -->

            <!-- checkTcrItem -->
            <div class="col-auto">
              <check-tcr-item></check-tcr-item>
            </div>
            <!-- end checkTcrItem -->

            <!-- migrateLogbook -->
            <!-- <div class="col-auto">
              <migrate-logbook
                @updateLog="updateLog"
                @playSound="playSound"
              >
              </migrate-logbook>
            </div> -->
            <!-- end migrateLogbook  -->
          </div>
        </div>
      </template>

      <template v-slot:after>
        <div
          class="q-pa-md"
          style=""
        >
          <div class="q-mb-sm">
            <span class="q-pr-sm">Console</span>
            <q-btn round dense icon="clear" @click="logs=[]"></q-btn>
          </div>
          <div v-for="(log, index) in logs" :key="index" class="q-my-md">
            {{ index }}: {{ log }}
          </div>
        </div>
      </template>

    </q-splitter>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import wordListDataRepair from 'src/pages/configuration/utility/components/wordListDataRepair'
import checkTcrItem from 'src/pages/configuration/utility/components/checkTcrItem'
// import migrateLogbook from 'src/pages/configuration/utility/components/migrateLogbook'
import notifySound from 'src/assets/sounds/airplane-sound-notify.mp3'

export default {
  components: {
    wordListDataRepair,
    checkTcrItem
    // migrateLogbook
  },

  setup () {
    // =============================
    // public variables & functions
    // =============================
    // variables
    const splitterModel = ref(60) // start at 50%
    const logs = ref([])

    // functions
    function playSound () {
      const audio = new Audio(notifySound)
      audio.play()
    }

    // function updateLog
    function updateLog (message) {
      logs.value.push(message)
    }

    return {
      // public variables
      splitterModel,
      logs,
      wordListDataRepair,
      // migrateLogbook,
      updateLog,
      playSound
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
