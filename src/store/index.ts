import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import RootStateTypes, { AllStateTypes } from './interface'
// 引入 userState 模块
import userState from './modules/user'

export default createStore<RootStateTypes>({
  state: {
    reqLoading: false
  },
  mutations: {
    setReqLoading (state, payload) {
      state.reqLoading = payload
    }
  },
  actions: {
  },
  modules: {
    userState
  }
})
export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')
export function useStore<T = AllStateTypes> () {
  return baseUseStore<T>(key)
}
