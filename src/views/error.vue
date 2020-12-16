<template>
  <div class="error">
    <Icon type="cry" :style="{'font-size': '175px', color: '#1890ff'}" />
    <h3>服务器错误...</h3>
    <router-link to='/'>
      <a-button>回首页</a-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../components/icon/Icon.vue'
import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'
export default defineComponent({
  components: {
    Icon,
    AButton: Button
  }
})
</script>

<style lang="less" scoped>
.error {
  text-align: center;
  padding-top: 165px;
  padding-bottom: 50px;
  h3 {
    margin-top: 15px;
    margin-bottom: 50px;
  }
}
</style>
