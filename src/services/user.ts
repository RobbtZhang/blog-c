import request from '../utils/request'
import qs from 'qs'
import { UserInfo } from '../store/modules/user/interface'

interface User {
  userName: string;
  password: string;
}

interface Password {
  password: string;
  newPassword: string;
}

export const checkName = (user: string) => request({
  method: 'POST',
  url: '/user/isExist',
  data: { userName: user }
})

export const register = (userName: string, password: string) => request({
  method: 'POST',
  url: 'user/register',
  data: {
    userName,
    password
  }
})

export const logins = (user: User) => request({
  method: 'POST',
  url: 'user/login',
  data: qs.stringify(user)
})

export const getUserInfo = () => request({
  method: 'GET',
  url: 'user/userInfo'
})

export const changeUserInfo = (data: UserInfo) => request({
  method: 'PATCH',
  url: 'user/changeInfo',
  data
})

export const changePassword = (data: Password) => request({
  method: 'PATCH',
  url: 'user/changePassword',
  data
})

export const logout = () => request({
  method: 'POST',
  url: 'user/logout'
})
