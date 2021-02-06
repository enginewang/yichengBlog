<template>
  <div>
    <basic-layout v-slot:main>
      <el-row :gutter="10" type="flex" justify="center" style="margin-top: 1rem;">
        <el-col :xs="24" :sm="21" :md="19" :lg="15" :xl="12">
          <el-card class="box-card" style="width: 80%; margin: auto;padding: 2em;">

            <div slot="header" class="clearfix">
              <el-row>
                <el-button class="backBtn" @click="prePage" style="position: absolute;left: 1em;"> 返回</el-button>
                <p style="font-weight: bold; font-size: x-large; text-align: center; margin-block-start: 0; margin-block-end: 0">关于</p>
              </el-row>
            </div>
            <div class="content" style="text-align: left">
              <h5>很感谢您能看到这里</h5>
              <br>
              <h4>为什么有这个网站？</h4>
              <p>在平常的学习生活中，我总想找个地方记录一些心得感悟，搭建一个博客网站无疑是一个不错的选择。一开始选择的是比较省事的GitHub
                Page，后来用Django撸一个站点，运行了大概一年后觉得Django可自定义化不是很强，数据库方面用的不爽，最后决定采用前后端分离的方式，重新构建了这个网站，后端用的Golang，前端用的Vue.js和Element
                UI，因为没有套模板，有些地方尤其是自适应方面可能会有些奇怪。
                如果遇到了问题希望能邮箱联系我，非常感谢！
              </p>
              <p>接下来会慢慢加入更多内容，敬请期待</p>
              <br>
              <h4>我是谁？</h4>
              <p>目前是同济软院的一枚大三狗，技术水平一般但还是乐此不疲。热爱学习未知的事物，热爱二次元、音乐和设计，常常沉浸于自己的世界无法自拔。
              </p>

              <br>
              <h4>联系我</h4>
              <el-row :gutter="10">
                <el-col :span="2" :offset="1">
                  <a href="mailto:engine74396@gmail.com" title="engine74396@gmail.com" class="hover-anime">
                    <img src="@/assets/icon/gmail.png"/>
                  </a>
                </el-col>
                <el-col :span="2">
                  <a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=2925518226&website=www.oicqzone.com"
                     title="2925518226">
                    <img src="@/assets/icon/QQ.png"/>
                  </a>
                </el-col>
                <el-col :span="2">
                  <a href="https://github.com/enginewang" title="enginewang">
                    <img src="@/assets/icon/github.png"/>
                  </a>
                </el-col>
              </el-row>

            </div>
          </el-card>
        </el-col>
      </el-row>
    </basic-layout>
  </div>
</template>

<script>
  import 'highlight.js/styles/googlecode.css'
  import BasicLayout from "../components/BasicLayout";


  export default {
    name: "ArticleDetail",
    components: {
      BasicLayout,
    },
    data() {
      return {
        article: {},
        tags: [],
        commentInput: '',
        canClickLove: true,
        showPay: false,
      }
    },
    methods: {
      prePage() {
        this.$router.push({'path': '/article'});
      },
    },
  }
</script>

<style scoped>

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
    background-color: #f4f4f5;
    box-shadow: 2px 3px 2px rgba(0, 0, 0, .1);
    border-radius: 0.4em;
    padding: 1em 1em 1em 1em;
  }

  p > code {
    background-color: #f4f4f5;
    padding: .3em .3em .2em .3em;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .05);
    border-radius: 0.3em;
    margin-right: 0.2em;
  }

  .hover-anime {

  }

</style>
