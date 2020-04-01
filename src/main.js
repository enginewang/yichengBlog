import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/scss/font-awesome.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faBook,
  faAddressCard,
  faBoxOpen,
  faLaptopCode,
  faSignInAlt,
  faSignOutAlt,
  faUserPlus,
  faCommentDots,
  faHeart,
  faCoins,
  faSmileWink,
  faTrash,
  faCouch,
  faUserCircle,
    faMarker,
    faFlask,
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import VueAnime from 'vue-animejs'
import util from './plugins/util'
//import VueMarkdown from 'vue-markdown'


library.add(faFlask, faBook, faAddressCard, faBoxOpen, faLaptopCode, faSignInAlt, faUserPlus, faSignOutAlt, faCommentDots, faHeart, faCoins, faSmileWink, faTrash, faCouch, faUserCircle,faMarker);
//import BasicLayout from "./components/BasicLayout";

Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);
//Vue.component('vue-markdown', VueMarkdown);
Vue.use(ElementUI);
Vue.use(VueAnime);
Vue.use(util);
//Vue.use(Highlight);
//Vue.use(VeeValidate, { locale: 'zh_CN' });


// 为什么传这三个参数，官网有详细介绍
router.beforeEach((to, from, next) => {
  // 这里的meta就是我们刚刚在路由里面配置的meta
  if (to.meta.requireAdminAuth) {
    // 下面这个判断是自行实现到底是否有没有登录
    if (localStorage.userName) {
      //this.$store.state.isLogin
      // 登录就继续
      next();
    } else {
      // 没有登录跳转到登录页面，登录成功之后再返回到之前请求的页面
      next({
        path: '/admin/login',
      })
    }
  } else {
    // 不需要登录的，可以继续访问
    next()
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
