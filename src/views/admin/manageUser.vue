<template>
  <div>
    <admin-layout v-slot:main>
      <el-row :gutter="10">
        <el-col :span="6">
          <h3 style="float: left;margin-bottom: 1em">
            你好啊！{{username}}
          </h3>
        </el-col>
      </el-row>
      <el-table :data="userList">
        <el-table-column
                label="头像"
                width="60">
          <template slot-scope="scope">
            <el-avatar v-bind:src="scope.row.avatar" size="medium"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
                label="用户名"
                width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="邮箱"
                width="210">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="角色"
                width="100">
          <template slot-scope="scope">
            <span>{{ roleList[scope.row.role] }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="等级"
                width="70">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.level }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="金币"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.coin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </admin-layout>

  </div>
</template>

<script>
  import adminLayout from "../../components/adminLayout";
  import {getAllUsers, removeUser} from "../../api/user";

  export default {
    name: "manageUser",
    components: {adminLayout},
    data() {
      return {
        userList: [],
        roleList: ['超级管理员', '作者', '普通用户']
      }
    },
    methods: {
      handleDelete(row) {
        console.log(row)
        removeUser(row._id).then((res) => {
          if (res.status === 204) {
            this.$notify({
              title: '删除成功',
              message: row.title + '被移出了用户',
              type: 'success'
            });
            this.flushUserList();
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户删除时遇到了错误'
            });
          }
        });
      },
      handleEdit(row) {
        this.$router.push('/admin/modifyUser/' + row._id);
      },
      flushUserList() {
        this.hackReset = false;
        getAllUsers().then((res) => {
          //console.log(res);
          if (res.status === 200) {
            this.userList = res.data;
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取用户时遇到了错误'
            });
          }
        });
        this.$nextTick(() => {
          this.hackReset = true;
        });
      },
    },
    created() {
      this.username = localStorage.userName;
      getAllUsers().then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.userList = res.data;
          console.log(this.userList);
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取用户列表时遇到了错误'
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

  a {
    text-decoration: none;
    color: white;
    margin-top: 0.2em;
  }
</style>
