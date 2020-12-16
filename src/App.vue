<template>
  <!-- 根路由出口 -->
  <Header />
    <!-- <router-view v-slot="{ Component }">
      <keep-alive exclude="profile,follower">
        <component :is="Component"/>
      </keep-alive>
    </router-view> -->
    <router-view></router-view>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { Button } from 'ant-design-vue'
// import Button from 'ant-design-vue/lib/button' // 加载 JS
// import 'ant-design-vue/lib/button/style/css' // 加载 CSS

// import 'ant-design-vue/lib/date-picker/style' // 加载 LESS
// import 'ant-design-vue/dist/antd.css'
// import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue'
// import request from './utils/request'

import Header from './components/header/header.vue'
import Footer from './components/footer/footer.vue'
// request({
//   method: 'GET',
//   url: 'user/userInfo'
// })
export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
    // StarOutlined,
    // StarFilled,
    // StarTwoTone,
    // AButton: Button
    // DatePicker
  },
  setup () {
    // onMounted(() => {})
  }
})
</script>

<style lang="less">
#app {
  .ant-list-item-meta-title {
    margin: 0;
  }
  .ant-list-item-meta-description {
    font-size: 13px;
  }
  min-width: 980px;
  overflow: auto;
  min-height: 800px;
  position: relative;
}
</style>
