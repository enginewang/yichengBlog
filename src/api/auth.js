import axios from './index'

const api = {
  adminLogin: '/auth/adminLogin',
  userLogin: '/auth/userLogin'
}

export default api

export function adminLogin(data) {
  return axios({
    url: api.adminLogin,
    method: 'post',
    data: data,
  })
}

export function userLogin(data) {
  return axios({
    url: api.userLogin,
    method: 'post',
    data: data,
  })
}
