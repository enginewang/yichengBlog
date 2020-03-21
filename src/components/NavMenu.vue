<template>
  <el-menu
          class="el-menu-demo"
          mode="horizontal"
          background-color="#232323"
          text-color="#fff"
          active-text-color="#248CFB">
    <el-menu-item index="1">
      <font-awesome-icon icon="laptop-code" style="margin-bottom: 0.15em"/>
      <router-link to="/">
        王毅诚的站点
      </router-link>
    </el-menu-item>
    <el-menu-item index="2" class="hidden-xs-only">
      <font-awesome-icon icon="book" style="margin-bottom: 0.15em"/>
      <router-link to="/article">
        &nbsp;文章
      </router-link>
    </el-menu-item>
    <el-menu-item index="3" disabled  class="hidden-xs-only">
      <font-awesome-icon icon="box-open" style="margin-bottom: 0.15em"/>
      &nbsp;资源
    </el-menu-item>
    <el-menu-item index="6" class="hidden-xs-only">
      <font-awesome-icon icon="address-card" style="margin-bottom: 0.15em"/>
      <router-link to="/about">
        &nbsp;关于
      </router-link>
    </el-menu-item>
    <el-menu-item index="8" style="float: right;margin-right: 2em;">
      <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar v-bind:src="avatar" size="medium"></el-avatar>
        <label style="color: white;margin-left: .8em;font-family: 'PingFang SC'">{{username}}</label>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="padding-left: 1em;" v-show="!isLogin">
            <font-awesome-icon icon="user-plus"/>
            <a style="margin-left: .5em" @click="goToRegisterPage">注册</a>
          </el-dropdown-item>
          <el-dropdown-item style="padding-left: 1em;" v-show="!isLogin">
            <font-awesome-icon icon="sign-in-alt"/>
            <a style="margin-left: .8em" @click="goToLoginPage">登陆</a>
          </el-dropdown-item>
          <el-dropdown-item style="padding-left: 1em;" v-show="isLogin">
            <font-awesome-icon icon="user-circle"/>
            <a style="margin-left: .8em" @click="goToUserDetail">个人中心</a>
          </el-dropdown-item>
          <el-dropdown-item style="padding-left: 1em;" v-show="isLogin">
            <font-awesome-icon icon="sign-out-alt"/>
            <a style="margin-left: .8em" @click="logout">注销</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import {getUserByName} from "../api/user";
  import "element-ui/lib/theme-chalk/display.css"

  export default {
    name: "NavMenu",
    data() {
      return {
        username: '',
        avatar: '',
        isLogin: false,
      };
    },
    methods: {
      goToRegisterPage() {
        this.$router.push({path: '/register'});
        //location.reload();
      },
      goToLoginPage() {
        this.$router.push({path: '/login'});
        //location.reload();
      },
      logout() {
        localStorage.clear();
        this.$router.push({path: '/article'});
        location.reload();
      },
      goToUserDetail() {
        //console.log(this.username);
        this.$router.push({path: '/userCenter'});
        //location.reload();
      }
    },
    created() {
      this.username = localStorage.userName;
      if (!this.username) {
        this.username = "游客";
        this.avatar = "https://i.loli.net/2020/03/10/zjWGpgVqJPYk2TS.png";
        this.isLogin = false;
      } else {
        getUserByName(this.username).then((res) => {
          //console.log(res);
          if (res.status === 200) {
            this.avatar = res.data.avatar;
            this.isLogin = true
          } else {
            //console.log("Failed");
          }
        }).catch(error => {
          console.log(error);
          localStorage.clear();
        });
      }
    }
  }

</script>

<style scoped>
  a {
    text-decoration: none;
  }

  font-awesome-icon {
    margin-top: 0;
  }

  el-dropdown-item {
    padding: 0;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

</style>
