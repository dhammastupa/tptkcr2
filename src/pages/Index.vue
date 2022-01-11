<template>
  <q-page class="myDiv">
    <div class="bg"></div>
    <div class="row q-pa-sm">
      <div class="col-xs-12 col-sm-6 col-md-8 col-lg-8 col-xl-8">
        <article-statement></article-statement>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
        <Suspense>
          <template #default>
            <article-content></article-content>
          </template>
          <template #fallback>
            <div class="text-center">
              <q-spinner-tail
                color="primary"
                size="2em"
              />
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  name: 'PageIndex',

  components: {
    articleContent: defineAsyncComponent(() => import(
      'src/components/article/content.vue')),
    articleStatement: defineAsyncComponent(() => import(
      'src/components/article/statement.vue'))
  }
})
</script>

<style>
.myDiv {
  z-index: 1;
}
.myDiv .bg {
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: url('~assets/system-images/lotus-flower-5.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  opacity: .2;
  width: 100%;
  height: 100%;
}
</style>
