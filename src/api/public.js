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
// 基站下拉
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
// 类型下拉
export function aiModelTypeList(query) {
  return request({
    url: '/api-web/public/aiModelTypeList',
    method: 'get',
    params: query
  })
}
// 模型下拉
export function aiModelList(query) {
  return request({
    url: '/api-web/public/aiModelList',
    method: 'get',
    params: query
  })
}
