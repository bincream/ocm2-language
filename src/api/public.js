import request from '@/utils/request'

// 获取所有角色
export function roleList(query) {
  return request({
    url: '/api-web/public/getRoleList',
    method: 'get',
    params: query
  })
}

export function deviceParamQuery(query) {
  return request({
    url: '/api-web/public/deviceParamQuery',
    method: 'get',
    params: query
  })
}
