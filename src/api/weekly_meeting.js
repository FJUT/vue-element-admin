import request from '@/utils/request'

export function fetchMemberList(query) {
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
export function fetchProjectList(query) {
  return request({
    url: '/weekly_meeting/projects',
    method: 'get',
    params: query
  })
}
export function createProject(data) {
  return request({
    url: '/weekly_meeting/projects',
    method: 'put',
    params: data
  })
}

export function updateProject(data) {
  return request({
    url: '/weekly_meeting/projects',
    method: 'post',
    data
  })
}
export function deleteProject(data) {
  return request({
    url: '/weekly_meeting/projects',
    method: 'delete',
    data
  })
}
export function fetchMeetingList(query) {
  return request({
    url: '/weekly_meeting/meeting',
    method: 'get',
    params: query
  })
}
export function createMeeting(data) {
  return request({
    url: '/weekly_meeting/meeting',
    method: 'put',
    params: data
  })
}

export function updateMeeting(data) {
  return request({
    url: '/weekly_meeting/meeting',
    method: 'post',
    data
  })
}
export function deleteMeeting(data) {
  return request({
    url: '/weekly_meeting/meeting',
    method: 'delete',
    data
  })
}
export function fetchTaskList(query) {
  return request({
    url: '/weekly_meeting/task',
    method: 'get',
    params: query
  })
}
export function createTask(data) {
  return request({
    url: '/weekly_meeting/task',
    method: 'put',
    params: data
  })
}

export function updateTask(data) {
  return request({
    url: '/weekly_meeting/task',
    method: 'post',
    data
  })
}
export function deleteTask(data) {
  return request({
    url: '/weekly_meeting/task',
    method: 'delete',
    data
  })
}
