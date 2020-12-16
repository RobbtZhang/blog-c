import { Module } from 'vuex'
import router from '../../../router'
import RootStateTypes from '../../interface'
import UserState from './interface'
import { login, getUserInfo } from '@/services/user'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style/css'
message.config({
  duration: 1,
  maxCount: 1
})

const userState: Module<UserState, RootStateTypes> = {
  // namespaced: process.env.NODE_ENV !== 'production',
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    userCookie: '',
    isLogin: JSON.parse(localStorage.getItem('isLogin') || 'false'),
    fansList: [],
    followerList: []
  },
  mutations: {
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
      const { data } = await login(payload)
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
  }
}

export default userState
