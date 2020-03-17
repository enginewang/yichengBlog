<template>
  <div>
    <admin-layout v-slot:main>
      <el-card style="margin: 0">
        <el-form ref="form" :model="form" label-width="80px">
          <h2 style="text-align: center">添加文章</h2>
          <el-form-item label="文章标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="文章封面">
            <el-input v-model="form.cover"></el-input>
          </el-form-item>
          <el-form-item label="封面预览">
            <el-image :src="form.cover" size="large"></el-image>
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
            <el-button @click="addArticleKindVisible = true">
              <i class="el-icon-plus"></i>
              新增类别
            </el-button>
          </el-form-item>
          <el-form-item label="文章标签">
            <el-checkbox-group v-model="form.selectTagList">
              <el-checkbox v-for="(articleTag, index) in articleTagList" v-bind:key="index"
                           :name="articleTag.articleTag"
                           :label="articleTag.articleTag" :value="articleTag.articleTag">
                {{articleTag.articleTag}}
                <el-button @click="removeArticleTag(articleTag)" type="text" size="mini"> 删除</el-button>
              </el-checkbox>

            </el-checkbox-group>
            <el-button @click="addArticleTagVisible = true">
              <i class="el-icon-plus"></i>
              新增标签
            </el-button>
          </el-form-item>
          <el-form-item label="提交时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.PubTime" format="yyyy-MM-dd"
                              value-format="timestamp">
                style="width: 100%;">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="文章概述">
            <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>
          </el-form-item>
          <el-card class="box-card" style="margin: 0;padding-top: 0" shadow="never">
            <p style="text-align: center;"> 文章内容</p>
            <el-input type="textarea" :rows="50" v-model="form.content"
                      style="width: 49%;float: left;margin-right: 0;min-height: 50rem;"></el-input>
            <MarkdownDisplay style="width: 49%;float: right;margin-left: .5em; min-height: 66rem;background-color: #f5f5f5"
                             :markdown="form.content"></MarkdownDisplay>
          </el-card>

          <el-form-item style="margin-top: 2em;">
            <el-button type="primary" @click="onSubmit">发布文章</el-button>
            <el-button>取消</el-button>
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
    getAllArticleTags,
    removeArticleKind, removeArticleTag
  } from "../../api/blog";
  import adminLayout from "../../components/adminLayout";
  import MarkdownDisplay from "../../components/markdownDisplay";

  export default {
    name: "addArticle",
    data() {
      return {
        articleTagList: [],
        articleKindList: [],
        previewData: '',
        hackReset: true,
        addArticleKindVisible: false,
        addArticleTagVisible: false,
        username: 'engine',
        form: {
          title: '',
          cover: '',
          type: 'blog',
          kind: '',
          tags: '',
          selectTagList: [],
          PubTime: '',
          desc: '',
          author: '',
          content: '',
        },
        kindForm: {
          articleKind: '',
        },
        tagForm: {
          articleTag: '',
        },
        formLabelWidth: '120px'
      }
    },
    components: {
      adminLayout,
      MarkdownDisplay,
    },
    methods: {
      onSubmit() {
        this.form.author = this.username;
        this.form.tags = JSON.stringify(this.form.selectTagList);
        console.log(this.form);
        this.submitAddArticle();
      },
      submitAddArticle() {
        addArticle(this.form).then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: '增加成功',
              message: "\"" + this.form.title + "\"" + '发布成功!',
              type: 'success'
            });
            this.$router.push({path: '/admin/manageArticle'})
          } else {
            this.$notify.error({
              title: '错误',
              message: '文章类型增加时遇到了错误'
            });
          }
        });
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
    },
    created() {
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
</style>
