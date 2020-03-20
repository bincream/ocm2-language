import request from '@/utils/request'

export function realtimeAudioQuery(query) {
  return request({
    url: '/api-web/signal/twoDimension/realtimeAudioQuery',
    method: 'get',
    params: query
  })
}

export function vibQuery(query) {
  return request({
    url: '/api-web/signal/twoDimension/vibQuery',
    method: 'get',
    params: query
  })
}
