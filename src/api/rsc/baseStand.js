import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/rsc/baseStand/getList',
    method: 'get',
    params: query
  })
}

export function getInfo(query) {
  return request({
    url: '/api-web/rsc/baseStand/info',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/api-web/rsc/baseStand/save',
    method: 'post',
    data
  })
}

export function deleteData(query) {
  return request({
    url: '/api-web/rsc/baseStand/delete',
    method: 'delete',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/api-web/rsc/baseStand/update',
    method: 'post',
    data
  })
}

export function getPrecisions(query) {
  return request({
    url: '/api-web/rsc/baseStand/getPrecisions',
    method: 'get',
    params: query
  })
}

