import request from '../utils/request'

export const profile = (data: any) => request({
  method: 'GET',
  url: 'profile/profile',
  params: data
})

export const getFans = (userId: any) => request({
  method: 'GET',
  url: 'profile/fans',
  params: {
    userId
  }
})

export const getFollower = (userId: any) => request({
  method: 'GET',
  url: 'profile/follower',
  params: {
    userId
  }
})

export const followUser = (data: any) => request({
  method: 'POST',
  url: 'profile/follow',
  data
})

export const unFollowUser = (data: any) => request({
  method: 'POST',
  url: 'profile/unFollow',
  data
})
