import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import RootStateTypes, { AllStateTypes } from './interface'
import { logins, getUserInfo } from '@/services/user'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style/css'
import router from '@/router'
message.config({
  duration: 1,
  maxCount: 1
})
// 引入 userState 模块
// import userState from './modules/user'

export default createStore<RootStateTypes>({
  state: {
    reqLoading: false,
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    userCookie: '',
    isLogin: JSON.parse(localStorage.getItem('isLogin') || 'false'),
    fansList: [],
    followerList: []
  },
  mutations: {
    setReqLoading (state, payload) {
      state.reqLoading = payload
    },
    changeLogin (state, payload) {
      state.isLogin = payload
      localStorage.setItem('isLogin', payload)
    },
    setUserInfo (state, payload) {
      state.userInfo = {
        ...payload
      }
      localStorage.setItem('userInfo', JSON.stringify(payload))
    },
    setFansList (state, payload) {
      state.fansList = payload
    },
    setFansListCount (state, payload) {
      state.userInfo.fansCount = payload
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    setFollowerList (state, payload) {
      state.followerList = payload
    },
    setFollowerListCount (state, payload) {
      state.userInfo.followerCount = payload
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    }
  },
  actions: {
    async login ({ commit }, payload) {
      const { data } = await logins(payload)
      if (data.errno === 0) {
        message.success('登录成功')
        commit('changeLogin', true)
        const { data } = await getUserInfo()
        if (data.errno === 0) {
          commit('setUserInfo', data.data)
        } else {
          message.error(data.message)
        }
        router.push({
          path: router.currentRoute.value.query.from as string || '/',
          replace: true
        })
      } else {
        if (data.errno === 10004) {
          message.error(data.message)
        } else {
          message.error('网络错误，稍后再试')
        }
      }
    }
  },
  modules: {
    // userState
  }
})
export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')
export function useStore<T = AllStateTypes> () {
  return baseUseStore<T>(key)
}
