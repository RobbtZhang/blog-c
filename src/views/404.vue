<template>
  <div class="not-found">
    <notFound type="404" :style="{'font-size': '200px', color: '#1890ff'}" />
    <h3>没有你要找的东西...</h3>
    <router-link to='/'>
      <a-button>回首页</a-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import notFound from '../components/icon/Icon.vue'
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
export default defineComponent({
  components: {
    notFound,
    AButton: Button
  }
})
</script>

<style lang="less" scoped>
.not-found {
  text-align: center;
  padding-top: 150px;
  padding-bottom: 50px;
  h3 {
    margin-bottom: 50px;
  }
}
</style>
