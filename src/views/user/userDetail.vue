<template>
  <basic-layout v-slot:main>
    <el-card class="box-card">
      <el-row :gutter="24" style="margin-top: 2em">
        <el-col :span="8" :offset="1">
          <el-avatar v-bind:src="userInfo.avatar" style="width: 6em;height: 6em;"></el-avatar>
          <div style="font-family: 'PingFang SC'; font-size: 2em;">{{userInfo.username}}</div>
        </el-col>
        <el-col :span="12" :offset="2">
          <el-card class="box-card" shadow="never" style="border:none">
            <el-row :gutter="10" style="margin-bottom: 2em;">
              <el-col :span="4">等级：</el-col>
              <el-col :span="2" style="font-family: 'FZZhengHeiS-M-GB';font-size: 1.2rem;">{{userInfo.level}}</el-col>
              <el-col :span="4" :offset="4">
              <svg t="1584404503153" class="icon" viewBox="0 0 1024 1024" version="1.1" style="margin-top:-0.3em;width: 1.8rem;height:1.8rem;position: relative;margin: 0;padding-bottom: .5em;"
                   xmlns="http://www.w3.org/2000/svg" p-id="10330" width="200" height="200">
                <path d="M612.266667 283.733333h-211.2l-8.533334-8.533333c-14.933333-14.933333-66.133333-64-72.533333-104.533333-2.133333-23.466667 10.666667-44.8 34.133333-55.466667l4.266667-2.133333c2.133333 0 76.8-17.066667 145.066667-17.066667h6.4c68.266667 0 140.8 17.066667 142.933333 17.066667l4.266667 2.133333c25.6 10.666667 38.4 32 36.266666 55.466667-4.266667 40.533333-55.466667 89.6-72.533333 104.533333l-8.533333 8.533333z m-185.6-64h160c17.066667-17.066667 29.866667-34.133333 38.4-46.933333-23.466667-4.266667-74.666667-12.8-117.333334-12.8-44.8 0-93.866667 8.533333-119.466666 12.8 8.533333 12.8 23.466667 32 38.4 46.933333z"
                      p-id="10331"></path>
                <path d="M507.733333 936.533333c-266.666667 0-396.8-102.4-396.8-311.466666 0-166.4 128-341.333333 290.133334-398.933334l4.266666-2.133333h198.4l4.266667 2.133333c164.266667 55.466667 290.133333 232.533333 290.133333 398.933334 0 93.866667-23.466667 164.266667-74.666666 215.466666-59.733333 66.133333-164.266667 96-315.733334 96z m-89.6-646.4c-134.4 49.066667-243.2 198.4-243.2 337.066667C174.933333 748.8 213.333333 874.666667 507.733333 874.666667c132.266667 0 224-25.6 275.2-76.8 38.4-38.4 57.6-93.866667 57.6-170.666667 0-138.666667-108.8-288-243.2-337.066667h-179.2z"
                      p-id="10332"></path>
                <path d="M605.866667 608c14.933333 0 27.733333 12.8 27.733333 27.733333 0 14.933333-12.8 27.733333-27.733333 27.733334h-57.6v34.133333c0 19.2-14.933333 34.133333-36.266667 34.133333-19.2 0-36.266667-14.933333-36.266667-34.133333v-34.133333h-55.466666c-14.933333 0-27.733333-12.8-27.733334-27.733334 0-14.933333 12.8-27.733333 27.733334-27.733333h55.466666v-27.733333h-55.466666c-14.933333 0-27.733333-12.8-27.733334-27.733334 0-14.933333 12.8-27.733333 27.733334-27.733333h51.2c0-2.133333 2.133333-4.266667 2.133333-4.266667l-64-61.866666c-8.533333-8.533333-6.4-23.466667 6.4-34.133334 10.666667-10.666667 25.6-12.8 34.133333-6.4l61.866667 61.866667 57.6-61.866667c8.533333-10.666667 27.733333-6.4 38.4 4.266667s17.066667 21.333333 6.4 34.133333l-66.133333 68.266667v2.133333h57.6c14.933333 0 27.733333 12.8 27.733333 27.733334 0 14.933333-12.8 27.733333-27.733333 27.733333h-57.6v27.733333h57.6z"
                      fill="#FFAA00" p-id="10333"></path>
              </svg>
                </el-col>
              <el-col :span="3" style="font-family: 'FZZhengHeiS-M-GB';font-size: 1.2rem;">{{userInfo.coin}}</el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 2em;">
              <el-col :span="4">经验：</el-col>
              <el-col :span="12">
                <el-progress :stroke-width="20" :percentage="expPercentage(userInfo.exp)" status="success"
                             :show-text="false"></el-progress>
              </el-col>
              <el-col :span="8" style="padding-left: 0;color: #2d2f33;float: left">({{userInfo.exp}}/400)</el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 2em;">
              <el-col :span="4">邮箱：</el-col>
              <el-col :span="12" style="font-family: 'FZZhengHeiS-M-GB';font-size: 1.2rem;">{{userInfo.email}}</el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 2em;">
              <el-col :span="4">类型：</el-col>
              <el-col :span="6" style="font-family: 'FZZhengHeiS-M-GB'; float: left;font-size: 1.2rem;">{{roleName}}</el-col>
            </el-row>

          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="9">
          <el-form ref="form" :model="userInfo" label-width="80px">
            <el-form-item label="修改头像">
              <el-input v-model="newAvatarUrl" placeholder="输入新头像的url链接">
              </el-input>
            </el-form-item>
            <el-button @click="showAvatar" style="float: left;margin-left: 44%">预览</el-button>
            <br>
            <div class="img-box" v-if="showNewAvatar" style="margin-top: 2em;">
              <el-image :src="newAvatarUrl"></el-image>
            </div>
            <el-button @click="modifyAvatar" v-if="showNewAvatar" style="float: left;margin-left: 40%">确定修改</el-button>
          </el-form>
        </el-col>
        <!--上传新头像：（此功能暂未开放）
<upload-image style="margin-top: 1em"/>-->
        <el-col :span="12" :offset="2">
          <el-button style="padding: 3px 0" type="text" @click="showChangePassFunc">修改密码</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
            title="修改密码"
            :visible.sync="showChangePass"
            width="40%">
      <el-form :model="changePassForm" status-icon label-width="100px" :rules="rules">
        <el-form-item label="旧密码" prop="oldPass" style="width: 86%">
          <el-input type="password" v-model="changePassForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPass" style="width: 86%">
          <el-input type="password" v-model="changePassForm.newPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="reNewPass" style="width: 86%">
          <el-input type="password" v-model="changePassForm.reNewPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangePass = false">取 消</el-button>
        <el-button type="primary" @click="changePassSubmit(changePassForm.newPass)">确 定</el-button>
      </span>
    </el-dialog>

  </basic-layout>
</template>

<script>
  //import UploadImage from "../../components/uploadImage";
  import BasicLayout from "../../components/BasicLayout";
  import {getUserByName, updateUser} from "../../api/user";

  export default {
    name: "userDetail",
    components: {BasicLayout},
    data() {
      var validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
          this.OldPassComplete = false;
        } else {
          if (this.changePassForm.oldPass !== this.userOldPass) {
            callback(new Error('您的旧密码输入有误！'));
            this.OldPassComplete = false;
          } else {
            this.OldPassComplete = true;
            callback();
          }
        }
      };
      var validateNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
          this.NewPassComplete = false;
        } else {
          if (this.changePassForm.newPass.length < 6) {
            callback(new Error('密码长度不能低于六位'));
            this.NewPassComplete = false;
          } else {
            this.NewPassComplete = true;
            callback();
          }
        }
      };
      var validateReNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
          this.reNewPassComplete = false;
        } else if (value !== this.changePassForm.newPass) {
          callback(new Error('两次输入密码不一致!'));
          this.reNewPassComplete = false;
        } else {
          this.reNewPassComplete = true;
          callback();
        }
      };
      return {
        userInfo: {},
        roleName: '',
        newAvatarUrl: '',
        showNewAvatar: false,
        showChangePass: false,
        userOldPass: '',
        changePassForm: {
          oldPass: '',
          newPass: '',
          reNewPass: '',
        },
        oldPassComplete: false,
        newPassComplete: false,
        reNewPassComplete: false,
        rules: {
          oldPass: [
            {validator: validateOldPass, trigger: 'blur'}
          ],
          newPass: [
            {validator: validateNewPass, trigger: 'blur'}
          ],
          reNewPass: [
            {validator: validateReNewPass, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      showAvatar() {
        this.showNewAvatar = !this.showNewAvatar;
      },
      showChangePassFunc() {
        this.showChangePass = true;
      },
      changePassSubmit(newPass) {
        this.userInfo.password = newPass;
        this.updateUserInfo();
        this.showChangePass = false;
        this.changePassForm = {
          oldPass: '',
          newPass: '',
          reNewPass: '',
        };
        this.userOldPass = newPass;
      },
      modifyAvatar() {
        this.userInfo.avatar = this.newAvatarUrl;
        this.updateUserInfo();
      },
      expPercentage(exp) {
        return parseInt((exp % 400) / 4);
      },
      updateUserInfo() {
        let username = this.userInfo.username;
        updateUser(username, this.userInfo).then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: 'Success',
              message: '修改成功!',
              type: 'success'
            });
            location.reload();
          } else {
            this.$notify.error({
              title: '错误',
              message: '遇到了错误'
            });
          }
        }).catch(error => {
          //console.log(error.response);
          //console.log(error.data);
          this.$notify({
            title: '遇到了错误',
            message: error.data,
            type: 'error'
          });
        });
      }
    },
    created() {
      getUserByName(localStorage.userName).then((res) => {
        if (res.status === 200) {
          this.userInfo = res.data;
          let roleKind = ['超级管理员', '作者', '普通用户', '游客'];
          this.roleName = roleKind[this.userInfo.role];
          this.userOldPass = this.userInfo.password;
          console.log(this.userInfo);
        } else {
          //console.log("Failed");
        }
      });
    }
  }


</script>

<style scoped>

</style>
