import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    const user = AV.User.current()
    user.getRoles().then(roles => {
      const r = roles.map(role => role.getName())
      // console.log(r)
      const ret = {
        data: {
          roles: r,
          token: 'editor',
          introduction: '我是编辑',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: user.get('username')
        }
      }
      resolve(ret)
    })
  })
  // const ret = request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  // // console.log(ret)
  // return ret
}

