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
      <el-row :gutter="10">

        <el-button type="primary" style="float: left;margin-bottom: 2em">
          <router-link to="addArticle">
            添加文章
          </router-link>
        </el-button>
      </el-row>
      <el-table
              :data="articleList"
              :default-sort="{prop: 'pubTime', order: 'descending'}"
      >
        <el-table-column
                prop="pubTime"
                label="日期"
                sortable
                width="120">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ timeStampToString(scope.row.pubTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="标题"
                width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
            <el-popover trigger="hover" placement="top">
              <p>概述: {{ scope.row.content }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
                label="类型"
                width="70">
          <template slot-scope="scope">
            <el-tag size="mini" type="success">
              {{ scope.row.kind }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
                label="标签"
                width="160">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.tags.slice(1,-1).split(',')" size="mini">
              {{tag.slice(1,-1)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
                label="阅读数"
                width="70">
          <template slot-scope="scope">
            <i class="el-icon-reading"></i>
            <span style="margin-left: 10px">{{ scope.row.readCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="点赞数"
                width="70">
          <template slot-scope="scope">
            <i class="el-icon-thumb"></i>
            <span style="margin-left: 10px">{{ scope.row.likeCount }}</span>
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
  import {getAllArticles, removeArticle} from "../../api/blog";
  import adminLayout from "../../components/adminLayout";
  import {getCommentsByArticleId} from "../../api/comment";

  export default {
    name: "manageArticleList",
    components: {adminLayout},
    data() {
      return {
        articleList: [],
        previewData: '',
        username: '',
      }
    },
    methods: {
      seeDetail(_id) {
        console.log(_id);
        this.$router.push('/article/' + _id.toString());
      },
      handleDelete(row) {
        removeArticle(row._id).then((res) => {
          if (res.status === 204) {
            this.$notify({
              title: '删除成功',
              message: row.title + '被移出了文章',
              type: 'success'
            });
            this.flushArticleList();
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章删除时遇到了错误'
            });
          }
        });
      },
      handleEdit(row) {
        this.$router.push('/admin/modifyArticle/' + row._id);
      },
      timeStampToString(st) {
        let date = new Date(parseInt(st));
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
        let timeString = Y + '-' + M + '-' + D;
        return (timeString);
      },

      flushArticleList() {
        this.hackReset = false;
        getAllArticles().then((res) => {
          //console.log(res);
          if (res.status === 200) {
            this.articleList = res.data;
            //console.log(this.articleList)
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取文章时遇到了错误'
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
      getAllArticles().then((res) => {
        if (res.status === 200) {
          this.articleList = res.data;
          console.log(this.articleList)
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取文章时遇到了错误'
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
