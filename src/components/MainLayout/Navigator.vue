<template>
  <!-- เมนูส่วนบุคคล -->
  <NavigationItem
    :navItems="profileMenu"
  />

  <!-- เมนูตั้งค่าระบบ -->
  <NavigationItem
    :navItems="nonRestrictedMenu"
  />

  <!-- ระบบการอนุรักษ์ -->
  <NavigationItem
    :navItems="preservationMenu"
  />

  <!-- ระบบอ้างอิงร่วม -->
  <NavigationItem
    :navItems="commonReferenceMenu"
  />

  <!-- ระบบตั้งค่าการใช้งาน -->
  <NavigationItem
    :navItems="configurationMenu"
  />

  <!-- ระบบตั้งค่าการใช้งาน -->
  <NavigationItem
    :navItems="accessControlMenu"
  />

  <!-- ท้ายเมนู -->
  <q-list bordered class="bg-white" padding>
    <q-item>
      <q-item-section>
          <q-item-label caption>
            <q-item-label>
              <a href="https://ptipitaka.org">
                <img alt="Logo" src="~assets/system-images/logo-icon.png">
              </a>
            </q-item-label>
          </q-item-label>
        <q-item-label caption>มูลนิธิพระไตรปิฎกเพื่อประชาชน</q-item-label>
        <q-item-label overline>
          <a href="https://ptipitaka.org">ptipitaka.org</a></q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import useRequiresPermission from 'src/hooks/requires-permission.js'

export default {
  components: {
    NavigationItem: defineAsyncComponent(() => import('src/components/MainLayout/NavigationItem.vue'))
  },

  setup () {
    // initial composible
    const $store = useStore()

    // ---------------------
    // profile menu
    // ---------------------
    const profileMenu = computed(() => {
      const result = $store.getters['settings/profileMenu']
      return useRequiresPermission(result)
    })
    // ---------------------
    // non restircted menu
    // ---------------------
    const nonRestrictedMenu = computed(() => {
      const result = $store.getters['settings/nonRestrictedMenu']
      return useRequiresPermission(result)
    })
    // ---------------------
    // preservation menu
    // ---------------------
    const preservationMenu = computed(() => {
      const result = $store.getters['settings/preservationMenu']
      return useRequiresPermission(result)
    })

    // ---------------------
    // common reference menu
    // ---------------------
    const commonReferenceMenu = computed(() => {
      const result = $store.getters['settings/commonReferenceMenu']
      return useRequiresPermission(result)
    })

    // ---------------------
    // configuration menu
    // ---------------------
    const configurationMenu = computed(() => {
      const result = $store.getters['settings/configurationMenu']
      return useRequiresPermission(result)
    })

    // ---------------------
    // accessControl menu
    // ---------------------
    const accessControlMenu = computed(() => {
      const result = $store.getters['settings/accessControlMenu']
      return useRequiresPermission(result)
    })

    return {
      profileMenu,
      nonRestrictedMenu,
      preservationMenu,
      commonReferenceMenu,
      configurationMenu,
      accessControlMenu
    }
  }

}
</script>
