import axios from 'axios'
//import router from '../router/index'
import qs from 'qs'

// 创建axios实例
const service = axios.create({
  timeout: 100000,
  baseURL: "https://yicheng.me/api",
  //baseURL: "http://localhost:1323/api",
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  }
});


// request拦截器
service.interceptors.request.use(config => {
  if (localStorage.token) {
    //console.log(`Bearer ${localStorage.token}`);
    config.headers.Authorization = `Bearer ${localStorage.token}`;
  }
  //config.params.accessToken = localStorage.getItem('token');
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
}, error => {
  console.log("错误的传参");
  //console.log(error);
  return Promise.reject(error)
});

/*
// response拦截器
service.interceptors.response.use(response => {
  // 根据需要对返回数据进行处理：根据前后端约定进行处理（比如用户未登录或权限过期时请求返回的处理）
  const res = response.data;
  if (!res || res.code === -1) {
    // 权限过期跳转到登录页面
    window.location.href = 'http://202.182.120.236/login' // 登录页链接
  }
  return response
}, error => {
  router.replace({
    path: '/404'
  });
  return Promise.reject(error)
})
*/
export default service
