import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/sysRole/sysPer/getList',
    method: 'get',
    params: query
  })
}

export function update(data) {
  return request({
    url: '/api-web/sysRole/sysPer/update',
    method: 'post',
    data
  })
}

export function deviceParamQuery(query) {
  return request({
    url: '/api-web/systemtest/systemtest/deviceParamQuery',
    method: 'get',
    params: query
  })
}

export function deviceParamSetting(data) {
  return request({
    url: '/api-web/systemtest/systemtest/deviceParamSetting',
    method: 'post',
    data
  })
}
