import request from '@/utils/request'

export function fetchPartyList(query) {
  return request({
    url: '/weekly_meeting/meetings',
    method: 'get',
    params: query
  })
}
export function fetchUserList(query) {
  return request({
    url: '/weekly_meeting/members',
    method: 'get',
    params: query
  })
}
export function createMember(data) {
  return request({
    url: '/weekly_meeting/members',
    method: 'put',
    params: data
  })
}

export function updateMember(data) {
  return request({
    url: '/weekly_meeting/members',
    method: 'post',
    data
  })
}
export function deleteMember(data) {
  return request({
    url: '/weekly_meeting/members',
    method: 'delete',
    data
  })
}
export function updatePartyInfo(data) {
  return request({
    url: '/weekly_meeting/meetings',
    method: 'post',
    data
  })
}
