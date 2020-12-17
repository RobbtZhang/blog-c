<template>
  <div class="header">
    <div class="header-logo">
      <router-link to="/">
        博客
      </router-link>
    </div>
    <div class="header-menu" v-if="showHeaderRight">
      <div class="header-menu-home">
        <router-link to="/">
          <Icon type="home" :style="{'font-size': '15px'}"/>
          首页
        </router-link>
      </div>
      <div class="header-menu-square">
        <router-link to="/follow">
          <Icon type="fllow" :style="{'font-size': '16px'}"/>
          关注人
        </router-link>
      </div>
      <div class="header-menu-space">
        <router-link to="/me">
          <Icon type="me" :style="{'font-size': '14px'}"/>
          我的
        </router-link>
      </div>
      <div class="header-menu-setting">
        <div class="header-menu-setting-nologin" v-if="!isLogin">
          <router-link to="/login">
            登录
          </router-link> |
          <router-link to="/register">
            注册
          </router-link>
        </div>
        <div v-else class="header-menu-setting-login">
            <a-badge :count="1">
              <a-avatar shape="square" size="small" :src="avatar">
              </a-avatar>
            </a-badge>
            <a-dropdown placement="bottomCenter">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{userName}}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="0">
                  <router-link to="/createBlog">
                    <Icon type="dispatch" :style="{'font-size': '14px'}"/>
                    写文章
                  </router-link>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="1">
                  <router-link to="/setting">
                    <Icon type="setting" :style="{'font-size': '14px'}"/>
                    设置
                  </router-link>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="2">
                  <a href="javascript:;" @click="toLogout">
                    <Icon type="logout" :style="{'font-size': '14px'}"/>
                    退出登录
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import AAvatar from 'ant-design-vue/lib/avatar'
import ABadge from 'ant-design-vue/lib/badge'
import 'ant-design-vue/lib/avatar/style/css'
import 'ant-design-vue/lib/badge/style/css'
import Dropdown from 'ant-design-vue/lib/dropdown'
import 'ant-design-vue/lib/dropdown/style/css'
import Menu from 'ant-design-vue/lib/menu'
import 'ant-design-vue/lib/menu/style/css'
import MenuItem from 'ant-design-vue/lib/vc-menu'
import MenuDivider from 'ant-design-vue/lib/divider'
import 'ant-design-vue/lib/divider/style/css'
import { DownOutlined } from '@ant-design/icons-vue'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../../store'
import { logout } from '../../services/user'
import Icon from '../icon/Icon.vue'
export default defineComponent({
  components: {
    Icon,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: MenuItem,
    DownOutlined,
    AMenuDivider: MenuDivider,
    AAvatar,
    ABadge
  },
  // props: {
  //   showHeaderMenu: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  setup () {
    // const router = useRouter()
    const showHeaderRight = ref(false)
    // const username = ref('')
    // const useravatar = ref('')/
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const showHeader = ['login', 'register', undefined, 'not-found', 'error']
    const pathName = computed(() => route.name)
    const isLogin = computed(() => store.state.isLogin)
    const userName = computed(() => store.state.userInfo.userName)
    const avatar = computed(() => store.state.userInfo.avatar)
    const id = computed(() => store.state.userInfo.id)
    const toLogout = async () => {
      const res = await logout()
      if (res.data.errno === 0) {
        store.commit('setUserInfo', {})
        store.commit('changeLogin', false)
        message.success('退出成功')
        router.push('/')
      }
    }
    // onMounted(async () => {
    //   const { data } = await getUserInfo()
    //   if (data.errno === 0) {
    //     store.commit('userState/setUserInfo', data.data)
    //   } else if (data.errno === 601) {
    //     if (route.path === '/') {
    //       store.commit('userState/changeLogin', false)
    //       localStorage.removeItem('isLogin')
    //     } else {
    //       store.commit('userState/changeLogin', false)
    //       localStorage.removeItem('isLogin')
    //       router.push({
    //         path: '/login',
    //         query: {
    //           from: route.path
    //         }
    //       })
    //     }
    //   }
    // })
    // console.log(path.value, 1)
    watch(pathName, () => {
      // console.log(path.value, 2)
      if (showHeader.includes(pathName.value as string)) {
        showHeaderRight.value = false
      } else {
        showHeaderRight.value = true
      }
    }, {
      // deep: false
      // immediate: true
    })
    return {
      showHeaderRight,
      isLogin,
      userName,
      avatar,
      toLogout,
      id
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../styles/main.less';
.ant-badge-count {
  min-width: 15px;
  height: 15px;
}
.ant-dropdown-link {
  display: inline-block;
  width: 60px;
  overflow: hidden; /*超出部分隐藏*/
  text-overflow:ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
  text-align: center;
}
.anticon-down {
  position: absolute;
  top: 18px;
  right: 50px;
}
.ant-dropdown-menu-vertical {
  // padding-top: 5px;
  // padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: -8px;
}
.ant-divider-horizontal {
  margin-top: 5px;
  margin-bottom: 5px;
}
.header {
  width: 100%;
  background-color: @primary-color;
  color: #fff;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  a {
    color: #fff;
    font-size: 15px;
  }
  .header-logo {
    width: 200px;
    flex: 0 1 200px;
    text-align: center;
    a {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .header-menu {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 60px;
    .header-menu-setting-login {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden; /*超出部分隐藏*/
      text-overflow:ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /*规定段落中的文本不进行换行 */
      // width: 250px; /*需要配合宽度来使用*/
    }
    div {
      width: 100px;
      text-align: center;
    }
  }
}
</style>
