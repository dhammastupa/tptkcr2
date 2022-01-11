<template>
  <q-dialog
    v-model="form.create"
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
            <q-card-section v-if="tcrItem.selectedTcrItemRow.label">{{ tcrItem.selectedTcrItemRow.label }}</q-card-section>
            <q-card-section v-else>{{ $t('pageCommonReference.notUnderAnotherTopic') }}</q-card-section>
            <q-card-section v-for="(v, index) in topicList" :key="index">
              <q-input
                filled autofocus
                v-model="v.topic"
                :label="$t('pageCommonReference.topic')"
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
                @click="addTopic"
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
import { date, useQuasar } from 'quasar'
import { db, Timestamp } from 'src/boot/firebase.js'
import { createDoc } from 'src/functions/manage-data.js'
import { useI18n } from 'vue-i18n'
import useLogMeritMaking from 'src/hooks/merit-making.js'

export default {
  setup () {
    // ----------
    // composible
    // ----------
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // --------------------------
    // getters (global variables)
    // --------------------------
    // getters form
    const form = computed(() => { return $store.getters['commonReference/getForm'] })
    // getters tcrItem
    const tcrItem = computed(() => { return $store.getters['commonReference/getTcrItem'] })
    // getters uid
    const userID = computed(() => { return $store.getters['auth/uid'] })
    // getters userName
    const userName = computed(() => { return $store.getters['auth/userName'] })

    // ---------------
    // local variables
    // ---------------
    const formRef = ref(null)
    const topicList = ref([])

    // initialTopicList
    function initialTopicList () {
      topicList.value = [
        {
          topic: '',
          sequence: parseInt(date.formatDate(Date.now(), 'x'))
        }
      ]
    }
    initialTopicList()

    // function closeForm
    function closeForm () { $store.commit('commonReference/setFormCreate', false) }

    // function submit
    function submit () {
      formRef.value.validate().then(success => {
        if (success) {
          topicList.value.forEach(async (i) => {
            const newDoc = db.collection('tcrItem').doc()
            const data = {
              docId: newDoc.id,
              sequence: i.sequence,
              label: i.topic,
              parent: tcrItem.value.selectedTcrItem,
              content: [],
              tcrSetId: tcrItem.value.tcrSetDoc.docId,
              // log
              createdOn: Timestamp.now(),
              createdBy: userName.value,
              updatedOn: Timestamp.now(),
              updatedBy: userName.value
            }
            await createDoc(newDoc, { ...data })
            useLogMeritMaking(
              'tcrItem',
              { ...data },
              'createTcr',
              userID.value,
              userName.value
            )
          })
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
          $store.commit('commonReference/setUpdateTreeAfterCreate', true)
          initialTopicList()
          closeForm()
        }
      })
    }

    // function addTopic
    function addTopic () {
      formRef.value.validate().then(success => {
        if (success) {
          topicList.value.push({
            topic: '',
            sequence: parseInt(date.formatDate(Date.now(), 'x'))
          })
        }
      })
    }

    return {
      // global vars
      form,
      tcrItem,
      // local vars
      formRef,
      topicList,
      // function
      addTopic,
      closeForm,
      submit
    }
  }
}
</script>
