import axios from './index'

const api = {
  userBase: '/user',
  userName: '/user/username'
}

export default api

export function getUserByName(username) {
  return axios({
    url: api.userName + '/' + username,
    method: 'get'
  })
}

export function getUser(id) {
  return axios({
    url: api.userBase + '/' + id,
    method: 'get'
  })
}

export function getAllUsers() {
  return axios({
    url: api.userBase + '/all',
    method: 'get'
  })
}

export function getAllUserInfo() {
  return axios({
    url: api.userBase + '/allUserInfo',
    method: 'get'
  })
}

export function removeUser(id) {
  return axios({
    url: api.userBase+'/'+id,
    method: 'delete'
  })
}

export function userRegister(data) {
  return axios({
    url: api.userBase,
    method: 'post',
    data: data,
  })
}

export function updateUser(username, data) {
  return axios({
    url: api.userName+'/'+username,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


