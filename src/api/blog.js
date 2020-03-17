import axios from './index'

const api = {
  articleBase: '/article',
  allArticles: '/article/all',
  articleTag: '/article/tag',
  articleKind: '/article/kind'
  //articleDetail: 'article/:id'
}

export default api

export function getAllArticles() {
  return axios({
    url: api.allArticles,
    method: 'get'
  })
}

export function getIndexArticles() {
  return axios({
    url: api.articleBase + '/indexArticleList',
    method: 'get'
  })
}

export function getArticleDetail(articleId) {
  return axios({
    url: api.articleBase + '/' + articleId,
    method: 'get'
  })
}

export function addArticle(data) {
  return axios({
    url: api.articleBase,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function removeArticle(id) {
  return axios({
    url: api.articleBase + '/' + id,
    method: 'delete'
  })
}

export function updateArticle(id, data) {
  return axios({
    url: api.articleBase + '/' + id,
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function clickLove(id) {
  return axios({
    url: api.articleBase + '/clickLove/' + id,
    method: 'get'
  })
}

export function getAllArticleTags() {
  return axios({
    url: api.articleTag + '/all',
    method: 'get'
  })
}

export function getAllArticleKinds() {
  return axios({
    url: api.articleKind + '/all',
    method: 'get'
  })
}

export function addArticleKind(data) {
  return axios({
    url: api.articleKind,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function removeArticleKind(kindName) {
  return axios({
    url: api.articleKind + '/kindName/' + kindName,
    method: 'delete'
  })
}

export function addArticleTag(data) {
  return axios({
    url: api.articleTag,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function removeArticleTag(tagName) {
  return axios({
    url: api.articleTag + '/tagName/' + tagName,
    method: 'delete'
  })
}
