import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/index/index/getList',
    method: 'get',
    params: query
  })
}
export function getInfo(query) {
  return request({
    url: '/api-web/index/index/info',
    method: 'get',
    params: query
  })
}

export function resolve(data) {
  return request({
    url: '/api-web/index/index/resolve',
    method: 'post',
    data
  })
}
