<template>
  <q-header elevated class="bg-deep-purple-6 text-white">
    <q-toolbar>
      <!-- แถบเมนู -->
      <q-btn dense flat round icon="menu" @click="$emit('toggleLeftDrawer')" />

      <!-- ทูลบาร์ -->
      <q-toolbar-title>
        <!-- โลโก้ -->
        <q-avatar square>
          <img src="~assets/system-images/logo-genie-icon-white.png">
        </q-avatar>
        <!-- ชื่อแอปพลิเคชั่น -->
        <span :class="`${$q.screen.xs ? 'invisible' : ''}`">
            {{ $t("system.appName") }}
        </span>
        </q-toolbar-title>
        <!-- ปุ่มสลับภาษา -->
        <SwitchLanguage/>
        <!-- ปุ่มเข้าออกระบบ -->
        <LoginOut />
    </q-toolbar>
  </q-header>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    LoginOut: defineAsyncComponent(() => import('src/components/MainLayout/LoginOut.vue')),
    SwitchLanguage: defineAsyncComponent(() => import('src/components/MainLayout/SwitchLanguage.vue'))
  },

  emits: ['toggleLeftDrawer'],

  setup () {
    return {
    }
  }
}
</script>
