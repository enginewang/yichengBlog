import axios from './index'

const api = {
  commentBase: '/comment',
}

export default api

export function getAllComments() {
  return axios({
    url: api.commentBase + '/all',
    method: 'get',
  })
}

export function getCommentsByArticleId(id) {
  return axios({
    url: api.commentBase + '/articleId/' + id,
    method: 'get'
  })
}

export function getCommentsByReplyId(id) {
  return axios({
    url: api.commentBase + '/replyId/' + id,
    method: 'get'
  })
}

export function addComment(data) {
  return axios({
    url: api.commentBase,
    method: 'post',
    data: data,
  })
}

export function deleteComment(id) {
  return axios({
    url: api.commentBase+'/' + id,
    method: 'delete',
  })
}
