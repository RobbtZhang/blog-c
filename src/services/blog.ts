import request from '../utils/request'

export const createBlog = (data: any) => request({
  method: 'POST',
  url: 'blog/create',
  data
})

export const homeBlog = (data: any) => request({
  method: 'GET',
  url: 'home/blog',
  params: data
})

export const getFollowBlogs = (data: any) => request({
  method: 'GET',
  url: 'blog/followBlogs',
  params: data
})
