import request from '@/utils/request'

export function fetchPartyList(query) {
  return request({
    url: '/baby_party/partys',
    method: 'get',
    params: query
  })
}
export function fetchUserList(query) {
  return request({
    url: '/baby_party/users',
    method: 'get',
    params: query
  })
}

