<template>
  <div>
    <!--        <div class="bg-box" style="position: fixed;width: 100vw; height: 100vh; top:0; left:0;background-color: black;">-->
    <!--            <img class="detail-bg" src="@/assets/bg3.png">-->
    <!--        </div>-->

    <common-layout>
      <template v-slot:main>
        <transition name="fade">
          <loading v-if="isLoading"></loading>
        </transition>
        <div v-if="querySearch">
          <el-card class="box-card" shadow="hover" v-if="findArticle"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是内容包含 <label style="font-weight: bold">{{ querySearch }}</label> 的文章：
          </el-card>
          <el-card class="box-card" shadow="hover" v-if="!findArticle"
                   style="text-align: left;border: none;background-color: #F97676;border-radius: .3em;">
            没有找到包含 <label style="font-weight: bold">{{ querySearch }}</label> 的文章喵
          </el-card>
        </div>
        <div v-if="queryKind">
          <el-card class="box-card" shadow="hover"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是类型为 <label style="font-weight: bold">{{ queryKind }}</label> 的文章：
          </el-card>
        </div>
        <div v-if="queryTag">
          <el-card class="box-card" shadow="hover"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是标签含 <label style="font-weight: bold">{{ queryTag }}</label> 的文章：
          </el-card>
        </div>
        <div class="content">
          <el-card v-for="(article, id) in articleList" v-bind:key="id" class="articleCard"
               v-show="judgeShow(article)" shadow="hover">
            <el-row>
              <a @click="seeDetail(article._id)" class="articleTitle">{{ article.title }}</a>
            </el-row>
            <el-row>
              <div class="articleTagBox">
                <span class="articleTime"><i class="el-icon-time"></i> {{ timeStampToString(article.pubTime) }}</span>
                <el-tag size="mini" type="success" style="margin-left: 1em">
                  {{ article.kind }}
                </el-tag>
                <el-tag class="articleTag" v-for="(tag, id) in tagStringToList(article.tags)" :key="id"
                        size="mini"
                        style="margin-left: .5em">
                  {{ tag }}
                </el-tag>
              </div>
            </el-row>
            <el-image :src="article.cover" alt="article.cover" class="articleCover" :lazy='true'>
            </el-image>
            <el-button class="moreBtn" v-on:click="seeDetail(article._id)">
              CONTINUE READING
            </el-button>
<!--            <el-divider></el-divider>-->
          </el-card>
        </div>
      </template>

      <template v-slot:search>
        <el-input
          placeholder="搜索文章"
          size="small"
          style="border: none;margin-bottom: 2em;"
          v-model="searchText">
          <el-button slot="append" icon="el-icon-search" @click="goToSearchQuery(searchText)"></el-button>
        </el-input>
      </template>
    </common-layout>
  </div>
</template>

<script>
import {getAllArticles, getIndexArticles} from '../../api/blog'
// import BasicLayout from "../../components/BasicLayout";
import commonLayout from '../../components/commonLayout'
import loading from '../../components/loading'

export default {
  name: 'ArticleManage',
  components: {commonLayout, loading},
  data() {
    return {
      articleList: [],
      previewData: '',
      queryKind: '',
      queryTag: '',
      querySearch: '',
      searchText: '',
      findArticle: false,
      isLoading: true
    }
  },
  methods: {
    seeDetail(_id) {
      console.log(_id)
      this.$router.push('/article/' + _id.toString())
    },
    imgToImgList(img) {
      const list = []
      list.push(img)
      return list
    },
    tagStringToList(tags) {
      const result = []
      const list = tags.slice(1, -1).split(',')
      for (var i = 0; i < list.length; i++) {
        result.push(list[i].slice(1, -1))
      }
      return result
    },
    goToSearchQuery(searchText) {
      this.$router.push('/article?s=' + searchText)
      location.reload()
    },
    descSimple(desc) {
      const length = desc.length
      if (length > 200) {
        desc = desc.slice(0, 200) + '...'
      }
      return desc
    },
    timeStampToString(st) {
      const date = new Date(parseInt(st))
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
      const timeString = Y + '-' + M + '-' + D
      return (timeString)
    },
    judgeShow(article) {
      // console.log(article);
      if (article.type === 'blog') {
        if (this.queryKind) {
          return article.kind === this.queryKind
        } else if (this.queryTag) {
          console.log(this.tagStringToList(article.tags))
          console.log(this.queryTag)
          if (this.tagStringToList(article.tags).indexOf(this.queryTag) > -1) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      } else {
        return false
      }
    },
    handleQuery() {
      this.isLoading = true
      const query = this.$route.query
      if (query.s) {
        this.querySearch = query.s

        getAllArticles().then((res) => {
          if (res.status === 200) {
            this.articleList = res.data.filter(array => array.content.match(this.querySearch))
            if (this.articleList.length > 0) {
              this.findArticle = true
            }
            this.isLoading = false
          } else {
            console.log('Failed')
          }
        })
      } else if (query.kind) {
        this.queryKind = query.kind
        // console.log(this.queryKind);
      } else if (query.tag) {
        this.queryTag = query.tag
        // console.log(this.queryTag);
      }
    }
  },
  created() {
    getIndexArticles().then((res) => {
      // console.log(res);
      if (res.status === 200) {
        this.articleList = res.data
        console.log(res)
        this.handleQuery()
        this.isLoading = false
      } else {
        console.log('Failed')
      }
    })
  }

}
</script>

<style>
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
  margin-bottom: 2.5em;
}

.detail-bg {
  left: 0;
  object-fit: cover;
  filter: blur(10px);
  height: 100%;
  width: auto \9;
  width: 100%;
  z-index: 0;
  position: fixed;
  opacity: 0.5;
}

.el-card__header {
  border-bottom: none;
}

.el-card__body {
  padding: 15px;
}

.el-card__header {
  padding-top: 1em;
  padding-bottom: .1em;
}

/*.articleCard:hover {*/
/*    transform: scale(1.06);*/
/*
/*}*/

.articleCard {
  position: relative;
  width: 90%;
  /*height: 260px;*/
  /*padding: 0;*/
  /*background: rgba(0, 0, 0, 1);*/
  /*transition: all 1000ms;*/
  /*margin-bottom: 50px;*/
  /*cursor: pointer;*/
  padding: .5rem 2rem .5rem 2rem;
}

/*.articleCover:hover {*/
/*    transform: scale(1.004);*/
/*}*/

.articleCover {
  /*height: 260px;*/
  width: 100%;
  flex: 1;
  /*object-fit: cover;*/
  /*transition: all 1000ms;*/
  /*opacity: 0.3;*/
  /*filter: alpha(opacity=60);*/
}

.articleTitle {
  font-size: 26px;
  /*position: absolute;*/
  text-align: center;
  width: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 35%;
  color: black;
  font-family: RuiZiLongShu, "Microsoft YaHei", monospace;
  font-weight: bold;
  cursor: pointer;
}

.articleTitle:hover {
  color: #50a1ff;
  transition: 600ms;
}

.articleTime {
  font-size: 15px;
  /*position: absolute;*/
  text-align: center;
  right: 0;
  transform: translate(-50%, -50%);
  bottom: 0;
  color: black;
  vertical-align: center;
}

.articleTagBox {
  /*position: absolute;*/
  text-align: center;
  /*left: 45%;*/
  /*top: 65%;*/
  /*transform: translate(-50%, -50%);*/
  margin: 1rem;
}

#title:hover {
  transform: scale(1.05);
}

#title {
  transition: all 1000ms;
}

.moreBtn {
  margin-top: 1rem;
  color: #fff;
  border-color: #5e72e4;
  background-color: #5e72e4;
  border-radius: 0;
  box-shadow: 0 4px 6px rgba(50 50 93 0.11), 0 1px 3px rgba(0 0 0 0.08);
}

.moreBtn:hover {
  box-shadow: 1px 4px 6px rgba(50 50 93 0.11), 1px 1px 3px rgba(0 0 0 0.08);
  background-color: #13ce66;
  color: #fff;
  transition: all 800ms;
}

</style>
