// user 模块类型 state 类型引入
// import UserState from './modules/user/interface'

interface UserInfo {
  id?: number;
  userName?: string;
  gender?: number | null;
  sign?: string | null;
  avatar?: string | null;
  city?: string | null;
  fansCount?: any;
  followerCount?: any;
}

// interface UserState {
//   userInfo: UserInfo;
//   userCookie: string;
//   isLogin: boolean;
//   fansList: any[];
//   followerList: any[];
// }
// root 层类型定义
export default interface RootStateTypes {
  reqLoading: boolean;
  userInfo: UserInfo;
  userCookie: string;
  isLogin: boolean;
  fansList: any[];
  followerList: any[];
}

// 所有类型定义集成
export interface AllStateTypes extends RootStateTypes {
  // userState: UserState
}
