import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/alarm/alarmHis/getList',
    method: 'get',
    params: query
  })
}

export function getNew(query) {
  return request({
    url: '/api-web/alarm/alarmHis/getNew',
    method: 'get',
    params: query,
    timeout: 60000
  })
}

export function resolve(data) {
  return request({
    url: '/api-web/alarm/alarmHis/handle',
    method: 'post',
    data
  })
}
