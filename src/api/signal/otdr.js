
import request from '@/utils/request'

export function otdrQuery(query) {
  return request({
    url: '/api-web/signal/otdr/otdrQuery',
    method: 'get',
    params: query
  })
}
