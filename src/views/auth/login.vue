<template>
  <div class="login">
    <img class="bg" alt="Vue logo" src="../../assets/miku.png">
    <el-row :gutter="10" type="flex" justify="center" style="margin-top: 10rem;">
      <el-col :xs="23" :sm="16" :md="12" :lg="8" :xl="6">
        <el-card class="box-card" id="loginCard">
          <h3>用户登陆</h3>
          <el-form :model="userLoginForm" status-icon label-width="100px">
            <el-form-item label="用户名" prop="username" style="width: 86%">
              <el-input v-model="userLoginForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" style="width: 86%;margin-bottom: .2em">
              <el-input type="password" v-model="userLoginForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-button type="text" style="margin-bottom: .5em;" @click="goToRegisterPage">没有账号？点我注册</el-button>
            <el-row :gutter=24>
              <el-button type="primary" @click="submituserLoginForm()" style="margin-right: 1em">提交</el-button>
              <el-button @click="cancel()" style="margin-left: 1em">取消</el-button>
            </el-row>

          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {userLogin} from "../../api/auth";

  export default {
    name: "login",
    data() {
      return {
        userLoginForm: {
          username: '',
          password: '',
        },
      }
    },
    methods: {
      submituserLoginForm() {
        userLogin(this.userLoginForm).then((res) => {
          if (res.status === 200) {
            this.$store.commit('setToken', res.data);
            localStorage.userName = this.userLoginForm.username;
            localStorage.isLogin = 1;
            localStorage.token = res.data.token;
            this.$notify({
              title: '登陆成功！',
              message: '你好，' + this.userLoginForm.username + '！',
              type: 'success'
            });
            this.$store.commit('isLoginTrue');
            this.$router.push({path: '/article'});
          } else {
            this.$notify({
              title: '登陆遇到了错误',
              message: '账号或者密码有错误，请重新输入！',
              type: 'error'
            });
          }
        }).catch(error => {
          let msg = error.response;
          this.$notify({
            title: '登陆遇到了错误',
            message: msg,
            type: 'error'
          });
        });
      },
      goToRegisterPage() {
        this.$router.push({path: '/register'})
      },
      cancel() {
        this.$notify({
          title: '取消登陆，回到主页',
          type: 'info'
        });
        this.$router.push({path: '/article'})
      },
    },
  }
</script>

<style scoped>
  .login {
    width: 100%;
    height: 100%;
    background: #000000;
    overflow: hidden;
    position: absolute;
    margin: auto;
  }

  img {
    object-fit: cover;
    opacity: 0.5;
    height: 100%;
    width: auto \9;
    left: 0;
    width: 100%;
    z-index: 0;
    position: absolute;
  }

  #loginCard {
    color: #232323;
    z-index: 100;
    text-align: center;
  }
</style>
