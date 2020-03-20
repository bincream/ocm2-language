import request from '@/utils/request'

export function getAllList(query) {
  return request({
    url: '/api-web/sysRole/sysLog/getList',
    method: 'get',
    params: query
  })
}

