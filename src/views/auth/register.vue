<template>
  <div class="login">


    <img class="bg" alt="Vue logo" src="../../assets/miku.png">
    <el-row :gutter="10" type="flex" justify="center" style="margin-top: 10%;">
      <el-col :xs="23" :sm="16" :md="12" :lg="8" :xl="6">
        <el-card class="box-card" id="loginCard">
          <h3>用户注册</h3>
          <el-form :model="userRegisterForm" status-icon label-width="100px" :rules="rules">

            <el-form-item label="邮箱" prop="email" style="width: 86%">
              <el-input v-model="userRegisterForm.email"></el-input>
            </el-form-item>

            <el-form-item label="用户名" prop="username" style="width: 86%">
              <el-input v-model="userRegisterForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" style="width: 86%">
              <el-input type="password" v-model="userRegisterForm.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="re_password" style="width: 86%">
              <el-input type="password" v-model="userRegisterForm.re_password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="初始头像" style="width: 86%">
              <el-button @click="showAvatarLibrary" style="float: left;margin-top: .5em;" size="mini">
                选择头像
              </el-button>
              <el-image class="avatar" :src="userAvatar" :preview-src-list=imgToImgList(userAvatar)
                        style="float: left;margin-left:.4em;width: 3em;height: 3em">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <label style="font-size: small; color: #484848; float: left; margin-left: 1em;" v-show="hasChooseAvatar"> ←
                点击可放大</label>
            </el-form-item>


            <div title="初始头像库" v-show="avatarLibraryShow" style="margin-left: .8em;">
              <label v-for="avatar in defaultAvatarList" :key="avatar" style="margin-right: 0em">
                <el-image :src="avatar" style="width: 3em;height: 3em;margin-right: .7em;"
                          @click="chooseAvatar(avatar)"></el-image>
              </label>
            </div>

            <div style="margin-bottom: 1em;">
              <el-button type="text" @click="goToLoginPage">已有账号？直接登陆</el-button>
            </div>

            <el-row :gutter=24>
              <el-button type="primary" @click="submituserRegisterForm()" style="margin-right: 1em">提交</el-button>
              <el-button @click="cancel()" style="margin-left: 1em">取消</el-button>
            </el-row>

          </el-form>

        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {getAllUserInfo, userRegister} from "../../api/user";

  export default {
    name: "register",
    data() {
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          this.EmailComplete = false;
          callback(new Error('请输入邮箱'));
        } else {
          if (this.userEmailList.indexOf(value) > -1) {
            this.EmailComplete = false;
            callback(new Error('这个邮箱已经被注册过了'));
          } else {
            this.EmailComplete = true;
            callback();
          }
        }
      };
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
          this.UsernameComplete = false;
        } else {
          if (this.userNameList.indexOf(value) > -1) {
            callback(new Error('这个用户名已经被注册过了'));
            this.UsernameComplete = false;
          } else {
            this.UsernameComplete = true;
            callback();
          }
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
          this.PassComplete = false;
        } else {
          if (this.userRegisterForm.password.length < 6) {
            callback(new Error('密码长度不能低于六位'));
            this.PassComplete = false;
          } else {
            this.PassComplete = true;
            callback();
          }
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
          this.RepassComplete = false;
        } else if (value !== this.userRegisterForm.password) {
          callback(new Error('两次输入密码不一致!'));
          this.RepassComplete = false;
        } else {
          this.RepassComplete = true;
          callback();
        }
      };
      return {
        userRegisterForm: {
          username: '',
          email: '',
          password: '',
          re_password: '',
          avatar: '',
        },
        EmailComplete: false,
        UsernameComplete: false,
        PassComplete: false,
        RepassComplete: false,
        redirectTime: 3,
        hasChooseAvatar: false,
        userAvatar: "https://i.loli.net/2020/03/15/XsJjRomr1dy8u4D.png",
        avatarLibraryShow: false,
        defaultAvatarList: [
          "https://i.loli.net/2020/03/15/XsJjRomr1dy8u4D.png",
          "https://i.loli.net/2020/03/15/og7kjRNdiyCOYwI.png",
          "https://i.loli.net/2020/03/15/D492LpVuPrajkv1.png",
          "https://i.loli.net/2020/03/15/IVaHSh5pn46mfjy.png",
          "https://i.loli.net/2020/03/15/73SOMcNdqJmkQl6.png",
        ],
        userNameList: [],
        userEmailList: [],
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          re_password: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ],
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      chooseAvatar(avatar) {
        this.userAvatar = avatar;
        //this.hasChooseAvatar = true;
      },
      showAvatarLibrary() {
        this.avatarLibraryShow = !this.avatarLibraryShow;
      },
      imgToImgList(img) {
        let list = [];
        list.push(img);
        return list;
      },
      goToLoginPage() {
        this.$router.push({path: '/login'})
      },
      submituserRegisterForm() {
        this.userRegisterForm.avatar = this.userAvatar;
        if (this.EmailComplete && this.UsernameComplete && this.PassComplete && this.RepassComplete) {
          userRegister(this.userRegisterForm).then((res) => {
            if (res.status === 200) {
              this.$notify({
                title: '注册成功！',
                message: '3秒后将跳转到登录界面',
                type: 'success'
              });
              setTimeout(
                  this.jumpToLogin, 3000
              )
            } else {
              this.$notify({
                title: '注册遇到了问题',
                message: '请检查您的输入是否有问题',
                type: 'error'
              });
            }
          }).catch(error => {
            console.log(error.response.data);
            this.$notify({
              title: '注册遇到了错误',
              message: "可能是服务器异常，请联系管理员",
              type: 'error'
            });
          });
        } else {
          this.$notify({
            title: '注册失败！',
            message: '表单不完整或者有错误',
            type: 'error'
          });
        }

      },
      cancel() {
        this.$notify({
          title: '取消注册，返回主页',
          type: 'info'
        });
        this.$router.push({path: '/article'});
      },
      jumpToLogin() {
        this.$router.push({path: '/login'})
      }
    },
    created() {
      getAllUserInfo().then((res) => {
        if (res.status === 200) {
          let userList = res.data;
          //console.log(userList);
          let len = userList.length;
          for (let j = 0; j < len; j++) {
            if (userList[j].email != '') {
              this.userEmailList.push(userList[j].email);
            }
            if (userList[j].username != '') {
              this.userNameList.push(userList[j].username);
            }
          }
          //console.log(this.userEmailList);
          //console.log(this.userNameList);
        } else {
          //console.log("Failed");
        }
      });
    }
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

  .avatar {
    border-radius: 50%;
  }
</style>
