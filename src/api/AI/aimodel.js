import request from '@/utils/request'

export function getHisList(query) {
  return request({
    url: '/api-web/alarm/alarmHis/getList',
    method: 'get',
    params: query
  })
}

export function getAllList(query) {
  return request({
    url: '/api-web/ai/aiModel/getList',
    method: 'get',
    params: query
  })
}

export function save(data) {
  return request({
    url: '/api-web/ai/aiModel/save',
    method: 'post',
    data
  })
}
export function saveType(data) {
  return request({
    url: '/api-web/ai/aiModel/saveType',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/api-web/ai/aiModel/update',
    method: 'post',
    data
  })
}
export function deleteData(query) {
  return request({
    url: '/api-web/ai/aiModel/delete',
    method: 'delete',
    params: query
  })
}

export function getInfo(query) {
  return request({
    url: '/api-web/ai/aiModel/info',
    method: 'get',
    params: query
  })
}

export function bindAlarm(data) {
  return request({
    url: '/api-web/ai/aiModel/bindAlarm',
    method: 'post',
    data
  })
}

export function practice(query) {
  return request({
    url: '/api-web/ai/aiModel/practice',
    method: 'get',
    params: query
  })
}

export function exportZip(query) {
  return request({
    url: '/api-web/ai/aiModel/exportZip',
    method: 'get',
    params: query
  })
}
export function enable(query) {
  return request({
    url: '/api-web/ai/aiModel/enable',
    method: 'get',
    params: query
  })
}
