import request from '@/utils/request'

// 获取所有台站
export function getAllList(query) {
  return request({
    url: '/api-web/alarm/alarmCount/getTimeList',
    method: 'get',
    params: query
  })
}
