import request from '@/utils/request'

// 获取所有角色
export function roleList(query) {
  return request({
    url: '/api-web/public/getRoleList',
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

export function baseStandInfo(query) {
  return request({
    url: '/api-web/public/baseStandInfo',
    method: 'get',
    params: query
  })
}
// 历史报警列表
export function hisAlarmList(query) {
  return request({
    url: '/api-web/public/hisAlarmList',
    method: 'get',
    params: query
  })
}
export function alarmInfoList(query) {
  return request({
    url: '/api-web/public/alarmInfoList',
    method: 'get',
    params: query
  })
}
