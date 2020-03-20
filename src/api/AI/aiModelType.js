import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/ai/aiModelType/getList',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/api-web/ai/aiModelType/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/api-web/ai/aiModelType/delete',
    method: 'delete',
    params: query
  })
}

export function getInfo(query) {
  return request({
    url: '/api-web/ai/aiModelType/info',
    method: 'get',
    params: query
  })
}

// 音频操作
export function audioHandle(data) {
  return request({
    url: '/api-web/ai/aiModelType/audioHandle',
    method: 'post',
    data
  })
}
