import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/register')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/login')
  },
  {
    path: '/404',
    component: () => import('../views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('../views/error-page/401'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('../views/error-page/401'),
    hidden: true
  },
  {
    path: '/lab',
    name: 'labIndex',
    component: () => import('../views/lab/labIndex'),
    meta: {
      title: 'Lab',
    },
  },
  {
    path: '/article',
    name: 'articleIndex',
    component: () => import('../views/article/list'),
    meta: {
      title: 'Blog',
    },
  },
  {
    path: '/article/:id',
    name: 'articleDetail',
    component: () => import('../views/article/detail'),
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: () => import('../views/auth/adminLogin'),
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/manageArticle',
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/admin/manageArticle',
    name: 'manageArticle',
    component: () => import('../views/admin/manageArticleList'),
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/admin/manageUser',
    name: 'manageUser',
    component: () => import('../views/admin/manageUser'),
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/admin/addArticle',
    name: 'addArticle',
    component: () => import('../views/admin/addArticle'),
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/admin/modifyArticle/:id',
    name: 'modifyArticle',
    component: () => import('../views/admin/modifyArticle'),
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/admin/modifyUser/:id',
    name: 'modifyUser',
    component: () => import('../views/admin/modifyUser'),
    meta : {
      requireAdminAuth: true,
    },
  },
  {
    path: '/userCenter',
    name: 'userDetail',
    component: () => import('../views/user/userDetail'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
