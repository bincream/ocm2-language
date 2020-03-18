import request from '@/utils/request'

// 获取所有角色
export function roleList(query) {
  return request({
    url: '/api-web/public/getRoleList',
    method: 'get',
    params: query
  })
}

export function deviceParamQuery(query) {
  return request({
    url: '/api-web/public/deviceParamQuery',
    method: 'get',
    params: query
  })
}

export function standList(query) {
  return request({
    url: '/api-web/public/baseStandList',
    method: 'get',
    params: query
  })
}

export function realtimeAudioQuery(query) {
  return request({
    url: '/api-web/public/realtimeAudioQuery',
    method: 'get',
    params: query
  })
}

export function rscQuery(query) {
  return request({
    url: '/api-web/public/rscQuery',
    method: 'get',
    params: query
  })
}

export function vibQuery(query) {
  return request({
    url: '/api-web/public/vibQuery',
    method: 'get',
    params: query
  })
}
