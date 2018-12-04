import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/LanXin/users',
    method: 'get',
    params: query
  })
}
