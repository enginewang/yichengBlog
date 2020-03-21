<template>
  <div>
    <img class="detail-bg" src="@/assets/bg.jpg">
    <basic-layout v-slot:main>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
      <el-row :gutter="10" type="flex" justify="center" style="margin-top: 1rem;">
        <el-col :xs="24" :sm="21" :md="19" :lg="15" :xl="12">
          <el-card class="box-card" style="background: rgba(255,255,255,0.7)">
            <div slot="header" class="clearfix">
              <el-row>
                <el-button class="backBtn" @click="prePage" style="position: absolute;left: 1em;"> 返回</el-button>
                <h2>{{ article.title }}</h2>
              </el-row>
              <el-row :gutter="12">
                <el-col :span="10" :offset="7">
                  <label style="margin-top:0.1em;font-weight: lighter;font-size: medium;margin-right: 2em;">发布于
                    {{ timeStampToString(article.pubTime, "day") }}</label>
                  <label style="margin-top:0.1em;font-weight: lighter;font-size: medium">浏览量
                    {{ article.readCount }}</label>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-tag size="mini" type="success">
                    {{ article.kind }}
                  </el-tag>
                  <el-tag v-for="tag in tags" size="mini" style="margin-left: 1em">
                    {{tag.slice(1,-1)}}
                  </el-tag>
                </el-col>
              </el-row>
            </div>
            <div class="content" style="text-align: left; padding-left: 2rem;padding-right: 2rem;">
              <!--<MarkdownDisplay :markdown="content"></MarkdownDisplay>-->
              <markdown-it-vue class=""md-body :content="content"/>
            </div>
            <div class="like" style="margin-top: 2em;">
              <el-row :gutter="24" type="flex" justify="center">
                <el-col :span="3">
                  <el-button type="danger" @click="showPay=true">
                    <font-awesome-icon icon="coins"/>
                    打赏支持
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-dialog title="感谢您的支持！" :visible.sync="showPay">
              <el-image src="https://i.loli.net/2020/03/11/CxKMd62LtpyUwBf.png">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </el-dialog>


          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center">
        <el-col :xs="24" :sm="21" :md="19" :lg="15" :xl="12">
          <div class="comment-area">
            <comment type="article" :type_id="articleId"/>
          </div>
        </el-col>
      </el-row>
    </basic-layout>
  </div>
</template>

<script>
  import basicLayout from "../../components/BasicLayout";
  import {clickLove, getArticleDetail} from "../../api/blog";
  import MarkdownDisplay from "../../components/markdownDisplay";
  import MarkdownItVue from "markdown-it-vue";
  import "markdown-it-vue/dist/markdown-it-vue.css"
  import Comment from "../../components/comment"
  //import 'highlight.js/styles/googlecode.css'
  import 'highlight.js/styles/github.css'
  import {getUserByName} from "../../api/user";
  import loading from "../../components/loading"


  export default {
    name: "ArticleDetail",
    components: {
      basicLayout,
      MarkdownDisplay,
      Comment,
      loading,
      MarkdownItVue,
    },
    data() {
      return {
        article: {},
        content: '',
        tags: [],
        commentInput: '',
        code: 'print(hello world)',
        articleId: '',
        showPay: false,
        userLikeList: [],
        likeCountShow: 0,
        isLoading: true,
      }
    },
    methods: {
      prePage() {
        this.$router.push({'path': '/article'});
      },
      loveThis() {
        if (!localStorage.userName) {
          this.$message({
            showClose: true,
            message: '您需要先登录哦',
            type: 'error',
          });
        } else if (this.userLikeList.indexOf(this.article._id) > -1) {
          this.$message({
            showClose: true,
            message: '不能重复点赞哦，感谢支持！',
            type: 'error',
          });
        } else {
          clickLove(this.article._id).then((resp) => {
            if (resp.status === 200) {
              this.$message({
                message: '点赞成功，感谢支持！',
                type: 'success',
              });
              this.likeCountShow += 1;
            } else {
            }
          }).catch(error => {
            console.log(error);
            localStorage.clear();
          });
        }
      },
    },

    computed: {
      markdown() {
        return marked(this.content);
      },
    },
    created() {
      this.articleId = this.$route.params.id;
      getArticleDetail(this.articleId, 1).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.article = res.data;
          this.content = this.article.content;
          this.tags = this.article.tags.slice(1, -1).split(',');
          this.likeCountShow = this.article.likeCount;
          if (localStorage.userName) {
            getUserByName(localStorage.userName).then((resp) => {
              if (resp.status === 200) {
                if (!resp.data.likeList) {
                  this.userLikeList = []
                } else {
                  this.userLikeList = resp.data.likeList.split(',');
                }
                console.log(this.userLikeList);
              } else {
              }
            }).catch(error => {
              console.log(error);
              localStorage.clear();
            });
          }
          this.isLoading = false;

        } else {
          console.log("Failed");
        }
      });
      console.log(this.content);
    },
  }
</script>

<style>

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  code {
    font-family: "Fira Code Medium";
    font-size: small;
  }

  pre {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 0.4em;
    padding: 1em 1em 1em 1em;
  }

  p > code {
    background: rgba(255, 255, 255, 0.4);
    padding: .3em .3em .2em .3em;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .05);
    border-radius: 0.3em;
    margin-right: 0.2em;
  }

  table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
  }

  table td, table th {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
  }

  table {
    background-color: #D9ECFF;
    width: 80%;
  }

  th {
    background-color: #D9ECFF;
  }

  table tr:nth-child(odd) {
    background: #fff;
  }

  table tr:nth-child(even) {
    background: #ECF5FF;
  }

  .detail-bg {
    left: 0;
    object-fit: cover;
    filter: blur(15px);
    height: 200%;
    width: auto \9;
    width: 100%;
    z-index: 0;
    position: fixed;
    opacity: 0.4;
  }


  .el-card__header {
    border-bottom: none;
  }

  .el-card{
    padding-bottom: .5em;
  }

  p > a {
    text-decoration: none;
  }

  .katex {
    font: normal 1em KaTeX_Main,Times New Roman,serif;
    line-height: 0;
  }

  p > img {
    max-width: 100%;
    margin-left: 6%;
    margin-right: 6%;
    width: 86%;
  }


</style>
