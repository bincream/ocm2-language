import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/sysRole/systemUser/getList',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/api-web/sysRole/systemUser/save',
    method: 'post',
    data
  })
}

export function deleteData(query) {
  return request({
    url: '/api-web/sysRole/systemUser/delete',
    method: 'delete',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/api-web/sysRole/systemUser/update',
    method: 'post',
    data
  })
}

export function getInfo(query) {
  return request({
    url: '/api-web/sysRole/systemUser/info',
    method: 'get',
    params: query
  })
}

export function changeStatus(query) {
  return request({
    url: '/api-web/sysRole/systemUser/changeStatus',
    method: 'get',
    params: query
  })
}
export function resetPassword(query) {
  return request({
    url: '/api-web/sysRole/systemUser/resetPassword',
    method: 'get',
    params: query
  })
}
