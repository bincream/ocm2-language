import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/alarm/alarmInfo/getList',
    method: 'get',
    params: query
  })
}

export function getInfo(query) {
  return request({
    url: '/api-web/alarm/alarmInfo/info',
    method: 'get',
    params: query
  })
}

export function handle(data) {
  return request({
    url: '/api-web/alarm/alarmInfo/handle',
    method: 'post',
    data
  })
}
