<template>
  <q-dialog
    v-model="dataForm.createForm"
    position="right"
    :maximized="true"
    persistent
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="card-dialog-500">
      <q-banner inline-actions
        class="text-white bg-secondary">
        <q-icon name="add_circle_outline" size="sm" />

        {{ $t('mainNavigation.commonReference') }}

        <template v-slot:action>
          <q-btn
            round flat icon="close"
            @click="closeForm"
          >
          </q-btn>
        </template>
      </q-banner>

      <q-card-section>
        <q-form
          ref="formRef"
          @submit="submit"
          class="q-gutter-md"
        >
          <q-card>
            <q-card-section v-for="(v, index) in topicList" :key="index">
              <q-input
                ref="formTopicRef"
                filled autofocus
                v-model="v.topic"
                :label="$t('pageCommonToc.topic')"
                :hint="`${v.sequence}`"
                lazy-rules
                :rules="[
                  val =>
                    (val && val.length > 0) || $t('system.requiredField')
                ]"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                @click="onAddTopic"
                flat round
                color="primary"
                icon="add"
              />
            </q-card-actions>
          </q-card>

          <div align="right">
            <q-btn
              :label="$t('system.submit')"
              type="submit"
              color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { db, Timestamp } from 'src/boot/firebase.js'
import { createDoc } from 'src/functions/manage-data.js'
import { date } from 'quasar'

export default {

  setup () {
    // composable
    const $store = useStore()

    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // getters dataForm
    const dataForm = computed(() => { return $store.getters['commonToc/getForm'] })

    // getters variables
    const variables = computed(() => { return $store.getters['commonToc/getVariables'] })

    // getters commonToc
    const commonToc = computed(() => { return $store.getters['commonToc/getCommonToc'] })

    // init vars
    // const collection = db.collection('commonToc')
    const formRef = ref(null)

    const topicList = ref([])
    const formTopicRef = ref(null)
    function initialTopicList () {
      topicList.value = [
        {
          topic: '',
          sequence: parseInt(date.formatDate(Date.now(), 'x'))
        }
      ]
    }
    initialTopicList()

    // inputForm
    const inputForm = ref(null)

    // function closeForm
    function closeForm () {
      $store.commit('commonToc/setForm', {
        createForm: false,
        updateForm: false
      })
    }

    // function onAddTopic
    function onAddTopic () {
      formRef.value.validate().then(success => {
        if (success) {
          topicList.value.push({
            topic: '',
            sequence: parseInt(date.formatDate(Date.now(), 'x'))
          })
        }
      })
    }

    // function submit
    async function submit () {
      formRef.value.validate().then(success => {
        if (success) {
          topicList.value.forEach((i) => {
            const newDoc = db.collection('commonToc').doc()
            const newDocId = newDoc.id
            const data = {
              id: newDocId,
              sequence: i.sequence,
              label: i.topic,
              parent: commonToc.value.selected,
              content: [],
              tocSetId: variables.value.tocSet.id,
              // log
              createdOn: Timestamp.now(),
              createdBy: userName.value,
              updatedOn: Timestamp.now(),
              updatedBy: userName.value
            }
            createDoc(newDoc, { ...data })
          })
          initialTopicList()
          closeForm()
        } else {
          console.log('error')
        }
      })
    }

    return {
      userName,
      dataForm,
      topicList,
      inputForm,
      formRef,
      formTopicRef,
      onAddTopic,
      closeForm,
      submit
    }
  }
}

</script>
