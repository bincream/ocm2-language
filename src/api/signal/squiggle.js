import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-web/alarm/alarmHis/getList',
    method: 'get',
    params: query
  })
}
