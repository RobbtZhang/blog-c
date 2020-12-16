import axios from 'axios'
import router from '../router'
import store from '../store'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style'

const request = axios.create({
  // 配置选项
  // baseURL
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true // 允许携带cookie
  // timeout
})

request.interceptors.request.use(config => {
  // 改写config配置信息实现业务功能的统一处理
  store.commit('setReqLoading', true)
  return config
})

request.interceptors.response.use(response => {
  setTimeout(() => {
    store.commit('setReqLoading', false)
  }, 1000)
  const { data } = response
  if (data.errno === 404) {
    router.push({ name: 'not-found' })
  } else if (data.errno === 500) {
    router.push({ name: 'error' })
  } else if (data.errno === 10005) {
    if (localStorage.getItem('isLogin')) {
      message.error('登录已过期')
      store.commit('userState/changeLogin', false)
      localStorage.removeItem('isLogin')
    } else {
      message.error('您尚未登录')
    }
    router.push({
      name: 'login',
      query: {
        from: router.currentRoute.value.path
      }
    })
  } else if (data.errno === 10009) {
    message.error(data.message)
  } else if (data.errno === 10006) {
    message.error(data.message)
  }
  return response
}, () => {
  // const { status } = e.response
  message.error('网络不稳，稍后再试')
})

export default request
