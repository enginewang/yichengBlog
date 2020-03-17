import axios from './index'

export function getAllHotBangumi() {
  return axios({
    url: 'http://167.179.81.168/' + 'HotBangumiList',
    method: 'get'
  })
}
