import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-web/alarm/alarmHis/getList',
    method: 'get',
    params: query
  })
}

export function rscQuery(query) {
  return request({
    url: '/api-web/signal/squiggle/rscQuery',
    method: 'get',
    params: query
  })
}
