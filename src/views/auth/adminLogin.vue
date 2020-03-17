<template>
  <div class="login">
    <img class="bg" src="../../assets/miku.png">
    <el-card class="box-card" id="loginCard">
      <h3>管理员登陆</h3>
      <el-form :model="adminLoginForm" status-icon label-width="100px">
        <el-form-item label="用户名" prop="username" style="width: 86%">
          <el-input v-model="adminLoginForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password"  style="width: 86%">
          <el-input type="password" v-model="adminLoginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-row :gutter=24>
          <el-button type="primary" @click="submitAdminLoginForm()" style="margin-right: 1em">提交</el-button>
          <el-button @click="cancel()" style="margin-left: 1em">取消</el-button>
        </el-row>

      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {adminLogin} from "../../api/auth";

  export default {
    name: "adminLogin",
    data() {
      return {
        adminLoginForm: {
          username: '',
          password: '',
        },
      }
    },
    methods: {
      submitAdminLoginForm() {
        console.log(this.adminLoginForm);
        adminLogin(this.adminLoginForm).then((res) => {
          if (res.status === 200) {
            this.$store.commit('setToken',res.data);
            localStorage.userName = this.adminLoginForm.username;
            localStorage.token_expire = res.data.expire;
            //console.log(res.data.expire);
            localStorage.token = res.data.token;
            //console.log(res.data.token);
            this.$notify({
              title: '登陆成功！',
              message: '你好，' + this.adminLoginForm.username + '！',
              type: 'success'
            });
            this.$store.commit('isLoginTrue');
            this.$router.push({path:'/admin'});
          } else {
            this.$notify({
              title: '登陆遇到了错误',
              message: '账号或者密码有错误，请重新输入！',
              type: 'error'
            });
          }
        }).catch(error => {
          let msg = error.response.data;
          this.$notify({
            title: '登陆遇到了错误',
            message: msg,
            type: 'error'
          });
        });
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
    width: 30%;
    height: 35%;
    color: #232323;
    z-index: 100;
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
</style>
