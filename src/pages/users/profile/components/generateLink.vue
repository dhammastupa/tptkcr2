<template>
  <q-card v-if="authInfo.userEmailVerified" class="q-mb-sm">
    <q-banner inline-actions class="text-black bg-deep-purple-2">
      {{ $t('pageProfile.volunteer') }}
      <template v-slot:action>
        <q-btn
          class=""
          round flat dense
          icon="add_link"
          @click="addLink"
        />
      </template>
    </q-banner>

    <q-separator />

    <q-card-section>
      <!-- invitation link -->
      <div class="q-pb-sm">{{ $t('pageProfile.invitationLink') }}</div>
      <div class="q-gutter-sm">
        <q-list bordered separator>
          <q-item v-for="(id, index) in invitationIDs" :key="index">
            <q-item-section avatar class="gt-sm">
              <q-btn
                  @click="contentCopy(id)"
                  class="gt-sm"
                  flat dense round
                  icon="content_copy"
                />
            </q-item-section>
            <q-item-section>
              {{ `https://tptkcr.web.app/users/registration/${id}` }}
            </q-item-section>
            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  @click="deleteLink(id)"
                  class="gt-sm"
                  color="red"
                  flat dense round
                  icon="clear"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- volunteer -->
      <div class="q-py-sm">{{ $t('pageProfile.volunteer') }}</div>
      <div class="q-gutter-sm">
        <q-list bordered separator>
          <q-item v-for="(i, index) in friendList" :key="index">
            <q-item-section>
              {{ i.firstName}} {{i.lastName}} <span class="text-blue">{{ i.email }}</span>
            </q-item-section>
            <q-item-section side>{{ $filters.timeStampToDate(i.createdOn) }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useQuasar, uid, copyToClipboard } from 'quasar'
import { useI18n } from 'vue-i18n'
import { db, FieldValue } from 'src/boot/firebase.js'
import { isEmpty } from 'lodash'

export default {

  setup () {
    // composable
    const $store = useStore()
    const $q = useQuasar()
    const $t = useI18n().t

    // getters authInfo
    const authInfo = computed(() => { return $store.getters['auth/authInfo'] })

    // getters userName
    const invitationIDs = computed(() => { return $store.getters['auth/invitationIDs'] })

    // getters friendList
    const friendList = computed(() => { return $store.getters['auth/getFriendList'] })

    // function addLink
    async function addLink () {
      const linkId = uid()
      await db.collection('user').doc(authInfo.value.uid).update({
        invitationIDs: FieldValue.arrayUnion(linkId)
      })
      $store.commit('auth/updateInvitationsIDs', linkId)
    }

    // function contentCopy
    function contentCopy (id) {
      copyToClipboard(`https://tptkcr.web.app/users/registration/${id}`)
        .then(() => {
          $q.notify({
            icon: 'done',
            color: 'positive',
            message: $t('system.success')
          })
        })
    }

    // function deleteLink
    async function deleteLink (linkId) {
      await db.collection('user').doc(authInfo.value.uid).update({
        invitationIDs: FieldValue.arrayRemove(linkId)
      })
      $store.commit('auth/removeInvitationsIDs', linkId)
    }

    return {
      authInfo,
      invitationIDs,
      isEmpty,
      friendList,
      deleteLink,
      addLink,
      contentCopy
    }
  }
}
</script>
