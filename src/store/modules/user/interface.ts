export interface UserInfo {
  id?: number;
  userName?: string;
  gender?: number | null;
  sign?: string | null;
  avatar?: string | null;
  city?: string | null;
  fansCount?: any;
  followerCount?: any;
}

export default interface UserState {
  userInfo: UserInfo;
  userCookie: string;
  isLogin: boolean;
  fansList: any[];
  followerList: any[];
}
