import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getList',
    method: 'get',
    params: query
  })
}

export function getPerTree(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getPmTree',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/api-web/sysRole/sysPer/save',
    method: 'post',
    data
  })
}

export function deleteData(query) {
  return request({
    url: '/api-web/sysRole/sysPer/delete',
    method: 'delete',
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

export function getPerInfo(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getPmList',
    method: 'get',
    params: query
  })
}

export function assPer(data) {
  return request({
    url: '/api-web/sysRole/sysPer/assignPm',
    method: 'post',
    data
  })
}
