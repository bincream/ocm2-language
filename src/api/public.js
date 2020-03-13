import request from '@/utils/request'

// 获取所有角色
export function roleList(query) {
  return request({
    url: '/api-web/public/getRoleList',
    method: 'get',
    params: query
  })
}

