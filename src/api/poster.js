import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/poster/list',
    method: 'get',
    params: query
  })
}
