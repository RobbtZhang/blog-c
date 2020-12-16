// user 模块类型 state 类型引入
import UserState from './modules/user/interface'

// root 层类型定义
export default interface RootStateTypes {
  reqLoading: boolean;
}

// 所有类型定义集成
export interface AllStateTypes extends RootStateTypes {
  userState: UserState
}
