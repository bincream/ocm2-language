import request from '@/utils/request'
import Qs from 'qs'

export function login(params) {
  const data = Qs.stringify({
    grant_type: 'password',
    username: params.username,
    password: params.password
  })
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data
  })
}

export function getUserInfo(username) {
  return request({
    url: '/api-web/user/getUserInfo',
    method: 'get',
    params: {
      username
    }
  })
}

export function logout(query) {
  return request({
    url: '/auth/exit',
    method: 'delete',
    params: query
  })
}

export function newPassword(data) {
  return request({
    url: '/api-web/user/changePassword',
    method: 'post',
    data
  })
}
