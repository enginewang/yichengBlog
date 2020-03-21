<template>
  <div>
    <admin-layout v-slot:main>
    <el-card>
      <el-form ref="form" :model="form" label-width="80px">
        <h2 style="text-align: center">修改文章</h2>
        <el-form-item label="文章标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-input v-model="form.cover"></el-input>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-if="hackReset == true" v-model="form.kind" placeholder="请选择文章类型">
            <el-option v-for="(articleKind, index) in articleKindList" v-bind:key="index"
                       :value="articleKind.articleKind">
              {{articleKind.articleKind}}
              <el-button class="deleteBtn" @click="removeArticleKind(articleKind)" type="text" size="mini"> 删除
              </el-button>
            </el-option>
          </el-select>
          </el-button>
          <el-button @click="addArticleKindVisible = true" style="float: right">
            <i class="el-icon-plus"></i>
            新增类别
          </el-button>
        </el-form-item>
        <el-form-item label="文章标签">
          <el-checkbox-group v-model="selectTagList">
            <el-checkbox v-for="(articleTag, index) in articleTagList" v-bind:key="index" :name="articleTag.articleTag"
                         :label="articleTag.articleTag" :value="articleTag.articleTag">
              {{articleTag.articleTag}}
              <el-button @click="removeArticleTag(articleTag)" type="text" size="mini"> 删除</el-button>
            </el-checkbox>
          </el-checkbox-group>
          <el-button @click="addArticleTagVisible = true" style="float: right">
            <i class="el-icon-plus"></i>
            新增标签
          </el-button>

        </el-form-item>
        <el-form-item label="提交时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="thisPubTime" format="yyyy-MM-dd" value-format="timestamp">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="文章概述">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifySubmit">更新文章</el-button>
          <el-button @click="Cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="新增类型" :visible.sync="addArticleKindVisible">
      <el-form :model="kindForm">
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="kindForm.articleKind" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addArticleKindVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitArticleKind()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增标签" :visible.sync="addArticleTagVisible">
      <el-form :model="tagForm">
        <el-form-item label="标签名称" :label-width="formLabelWidth">
          <el-input v-model="tagForm.articleTag" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addArticleTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitArticleTag()">确 定</el-button>
      </div>
    </el-dialog>
    </admin-layout>
  </div>
</template>

<script>
  //import {addArticle} from "../../api/blog";
  import {
    addArticle,
    addArticleKind, addArticleTag,
    getAllArticleKinds,
    getAllArticleTags, getArticleDetail,
    removeArticleKind, removeArticleTag, updateArticle
  } from "../../api/blog";
  import adminLayout from "../../components/adminLayout";

  export default {
    name: "modifyArticle",
    data() {
      return {
        article: {},
        articleTagList: [],
        articleKindList: [],
        hackReset: true,
        addArticleKindVisible: false,
        addArticleTagVisible: false,
        username: 'engine',
        selectTagList: [],
        thisPubTime: '',
        form: {},
        kindForm: {
          articleKind: '',
        },
        tagForm: {
          articleTag: '',
        },
        formLabelWidth: '120px',
      }
    },
    components: {adminLayout},
    methods: {
      modifySubmit() {
        this.form.tags = JSON.stringify(this.selectTagList);
        this.form.pubTime = this.thisPubTime.toString();
        console.log(this.thisPubTime);
        console.log(this.form);
        updateArticle(this.$route.params.id, this.form).then((res) => {
          if (res.status === 200) {
            setTimeout(this.$notify({
              title: '修改成功',
              message: "\"" + this.form.title + "\"" + '修改成功!',
              type: 'success'
            }) ,1000);
            this.$router.push({path: '/admin/manageArticle'})
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章修改时遇到了错误'
            });
          }
        });
      },
      Cancel() {
        this.$notify.info({
          title: '取消修改',
          message: '取消文章的修改',
        });
        this.$router.go({path: '/admin/manageArticle'});
      },
      flushKindTag() {
        this.hackReset = false;
        getAllArticleKinds().then((res) => {
          if (res.status === 200) {
            this.articleKindList = res.data;
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取文章类型时遇到了错误'
            });
          }
        });
        getAllArticleTags().then((res) => {
          if (res.status === 200) {
            this.articleTagList = res.data;
          } else {
            this.$notify.error({
              title: '错误',
              message: '获取文章标签时遇到了错误'
            });
          }
        });
        this.$nextTick(() => {
          this.hackReset = true;
        });
      },
      submitArticleKind() {
        this.addArticleKindVisible = false;
        //if(this.kindForm.articleKind in this.articleKindList['articleKind'])
        addArticleKind(this.kindForm).then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: '增加成功',
              message: this.kindForm.articleKind + '成功加入了文章类型',
              type: 'success'
            });
            this.flushKindTag();
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章类型增加时遇到了错误'
            });
          }
        });
      },
      submitArticleTag() {
        this.addArticleTagVisible = false;
        addArticleTag(this.tagForm).then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: '增加成功',
              message: this.tagForm.articleTag + '成功加入了文章标签',
              type: 'success'
            });
            this.flushKindTag();
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章标签增加时遇到了错误'
            });
          }
        });
      },
      removeArticleKind(articleKind) {
        removeArticleKind(articleKind.articleKind).then((res) => {
          if (res.status === 204) {
            this.$notify({
              title: '删除成功',
              message: articleKind.articleKind + '被移出了文章类型',
              type: 'success'
            });
            this.flushKindTag();
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章类型删除时遇到了错误'
            });
          }
        });
      },
      removeArticleTag(articleTag) {
        removeArticleTag(articleTag.articleTag).then((res) => {
          if (res.status === 204) {
            this.$notify({
              title: '删除成功',
              message: articleTag.articleTag + '被移出了文章标签',
              type: 'success'
            });
            this.flushKindTag();
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章标签删除时遇到了错误'
            });
          }
        });
      },
      timeStampToString(st) {
        let date = new Date(parseInt(st));
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
        let timeString = Y + '-' + M + '-' + D;
        return (timeString);
      },
    },
    created() {
      let articleId = this.$route.params.id;
      getArticleDetail(articleId, 0).then((res) => {
        if (res.status === 200) {
          this.article = res.data;
          this.form = res.data;
          console.log(res.data);
          this.thisPubTime = res.data.pubTime;
          console.log(this.thisPubTime);
          this.selectTagList = this.form.tags.replace(/\"/g, "").slice(1,-1).split(',');
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取文章详情时遇到了错误'
          });
        }
      });
      getAllArticleTags().then((res) => {
        if (res.status === 200) {
          this.articleTagList = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取文章标签时遇到了错误'
          });
        }
      });
      getAllArticleKinds().then((res) => {
        if (res.status === 200) {
          this.articleKindList = res.data;
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取文章类型时遇到了错误'
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

  .el-button{
    margin-left: 1em;
    margin-right: 1em;
  }
</style>
