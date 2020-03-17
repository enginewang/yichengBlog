<template>
  <div>
    <admin-layout v-slot:main>
      <el-card>
        <el-form ref="form" :model="form" label-width="80px">
          <h2 style="text-align: center">修改用户资料</h2>
          <el-form-item label="用户头像">
            <el-input v-model="form.avatar"></el-input>

          </el-form-item>
          <el-form-item label="头像预览">
            <el-avatar :src="form.avatar" size="large"></el-avatar>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱">
            <el-input type="textarea" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="用户等级">
            <el-input-number v-model="form.level" :min="0" :max="200" label="等级"></el-input-number>
          </el-form-item>
          <el-form-item label="用户金币">
            <el-input-number v-model="form.coin" :min="0" :max="1000000" label="金币"></el-input-number>
          </el-form-item>
          <el-form-item label="用户经验">
            <el-input-number v-model="form.exp" :min="0" :max="400" label="经验"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="modifySubmit" style="margin-left: 10em;margin-right: 3em;">更新用户</el-button>
            <el-button @click="Cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </admin-layout>
  </div>
</template>

<script>
  import adminLayout from "../../components/adminLayout";
  import {updateUser, getUser} from "../../api/user";

  export default {
    name: "modifyUser",
    data() {
      return {
        hackReset: true,
        form: {},
        formLabelWidth: '120px',
      }
    },
    components: {adminLayout},
    methods: {
      modifySubmit() {
        console.log(this.form);
        updateUser(this.form.username, this.form).then((res) => {
          if (res.status === 200) {
            setTimeout(this.$notify({
              title: '修改成功',
              message: this.form.username + '的信息修改成功!',
              type: 'success'
            }), 1000);
            this.$router.push({path: '/admin/manageUser'})
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户修改时遇到了错误'
            });
          }
        });
      },
      Cancel() {
        this.$notify.info({
          title: '取消修改',
          message: '取消用户的修改',
        });
        this.$router.go({path: '/admin/manageUser'});
      },
    },
    created() {
      let userId = this.$route.params.id;
      getUser(userId).then((res) => {
        if (res.status === 200) {
          this.form = res.data;
          console.log(res.data);
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取用户详情时遇到了错误'
          });
        }
      });
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-card {
    margin: 1em 5em 2em 5em;
  }

  .el-form {
    text-align: left;
  }

  .deleteBtn {
    float: right;
    padding-top: 0.8em;
  }

  .el-button {
    margin-left: 1em;
    margin-right: 1em;
  }
</style>
