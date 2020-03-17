<template>
  <div class="side-notice">
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">网站通知</span>
      </div>
      <p>网站试运行ing...</p>
      <p>欢迎提交bug</p>
    </el-card>
    <el-card class="box-card" style="margin-top: 2em;" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">最新文章</span>
      </div>
      <div v-for="(lastestArticle, id) in LatestArticleList" :key="id" class="text item" style="padding-left: 1em;margin: 0;text-align: left">
        <el-button type="text" @click="toArticleDetail(lastestArticle._id)" style="padding-top: 4px;padding-bottom: 4px;">{{ lastestArticle.title }}</el-button>
        <label style="float: right;font-size: small"> {{ timeStampToString(lastestArticle.pubTime, "day") }} </label>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 2em;" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">类别索引</span>
      </div>
      <el-button @click="goToKindQuery(kind.articleKind)" v-for="(kind, i) in articleKindList" :key="i" type="text" style="margin-top: 0em;margin-bottom: 0em;padding: .5em 0em">
        <el-tag type="success" style="margin-top: 0em;margin-bottom: 0em">{{kind.articleKind}}</el-tag>
      </el-button>
    </el-card>
    <el-card class="box-card" style="margin-top: 2em;margin-bottom: 2em;" shadow="hover">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold">标签索引</span>
      </div>
      <el-button @click="goToTagQuery(tag.articleTag)" v-for="(tag, i) in articleTagList" :key="i" type="text" style="margin-top: 0em;margin-bottom: 0em;padding: .5em 0em">
        <el-tag style="margin-top: 0em;margin-bottom: 0em">{{tag.articleTag}}</el-tag>
      </el-button>
    </el-card>
  </div>
</template>

<script>
  import {getAllArticleKinds, getAllArticleTags, getIndexArticles} from "../api/blog";

  export default {
    name: "sideNotice",
    data() {
      return {
        LatestArticleList: [],
        articleTagList: [],
        articleKindList: [],
      }
    },
    methods: {
      toArticleDetail(id) {
        this.$router.push('/article/' + id);
        location.reload();
      },
      goToTagQuery(tag){
        this.$router.push("/article?tag=" + tag);
        location.reload();
      },
      goToKindQuery(kind){
        this.$router.push("/article?kind=" + kind);
        location.reload();
      },
    },
    created() {
      getIndexArticles().then((res) => {
        //console.log(res);
        if (res.status === 200) {
          this.LatestArticleList = res.data;
          //console.log("Latest" + this.LatestArticleList);
          if (this.LatestArticleList.length > 5) {
            this.LatestArticleList = this.LatestArticleList.splice(0,5);
          }
        } else {
          //console.log("Failed");
        }
      });
      getAllArticleTags().then((res) => {
        if (res.status === 200) {
          this.articleTagList = res.data;
          //console.log(this.articleTagList)
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
          //console.log(this.articleKindList)
        } else {
          this.$notify.error({
            title: '错误',
            message: '获取文章类型时遇到了错误'
          });
        }
      });
    },
  }
</script>

<style scoped>
.box-card {
  padding: 0;
}

.el-card {
  background: rgba(255,255,255,0.7);
}

.el-card__header {
  border-bottom: none;
}

.el-card{
  border: none;
}

</style>
