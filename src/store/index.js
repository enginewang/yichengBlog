import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    jwt_token: "",
  },
  getters: {
    getToken(state){
      return state.userInfo.token;
    },
  },
  mutations: {
    setToken(state,payload) {
      state.isLogin = payload.isLogin;
      state.jwt_token = payload.jwt_token;
    },
    isLoginTrue(state) {
      state.isLogin = true;
    },
    isLoginFalse(state) {
      state.isLogin = false;
    },
  },
  actions: {
    setAuth(context, options) {
      context.commit('setToken', {
        jwt_token: options.jwt_token,
        isLogin: options.isLogin
      })
    }
  },
  modules: {
  }
});
