import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getList',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/api-web/sysRole/sysPer/update',
    method: 'post',
    data
  })
}

export function info(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getPmList',
    method: 'get',
    params: query
  })
}

