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

export function updateApplyInfo(data) {
  return request({
    url: '/weekly_meeting/members',
    method: 'post',
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
