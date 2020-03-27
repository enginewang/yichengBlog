<template>
  <div>
    <img class="detail-bg" src="@/assets/bg.jpg">
    <common-layout>
      <template v-slot:main>
        <transition name="fade">
          <loading v-if="isLoading"></loading>
        </transition>
        <div v-if="querySearch">
          <el-card class="box-card" shadow="hover" v-if="findArticle"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是内容包含 <label style="font-weight: bold">{{querySearch}}</label> 的文章：
          </el-card>
          <el-card class="box-card" shadow="hover" v-if="!findArticle"
                   style="text-align: left;border: none;background-color: #F97676;border-radius: .3em;">
            没有找到包含 <label style="font-weight: bold">{{querySearch}}</label> 的文章喵
          </el-card>
        </div>
        <div v-if="queryKind">
          <el-card class="box-card" shadow="hover"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是类型为 <label style="font-weight: bold">{{queryKind}}</label> 的文章：
          </el-card>
        </div>
        <div v-if="queryTag">
          <el-card class="box-card" shadow="hover"
                   style="text-align: left;border: none;background-color: #D9ECFF;border-radius: .3em;">
            以下是标签含 <label style="font-weight: bold">{{queryTag}}</label> 的文章：
          </el-card>
        </div>
        <div class="content">
          <el-card id="articleCard" v-for="(article, id) in articleList" v-bind:key="id" class="box-card" shadow="hover"
                   style="padding-left: 0; padding-right: 0;min-height: 11em;" v-show="judgeShow(article)">
            <el-row :gutter="10">
              <el-col :span="9" :xs="0">
                <el-image
                        style="padding-left: 0;"
                        :src="article.cover"
                        :preview-src-list="imgToImgList(article.cover)"
                        fit="cover"
                >
                </el-image>
              </el-col>
              <el-col :span="14" :offset="1" :xs="23">
                <div class="title">
                  <el-row :gutter="0" type="flex" justify="center">
                    <el-col>
                      <el-button @click="seeDetail(article._id)" type="text"
                                 style="color: black; font-family: FZZhengHeiS-M-GB; font-size: large">
                        {{ article.title }}
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
                <el-row style="margin-left: 0; float: left">
                  <label style="font-weight: bold">发布时间： </label>{{ timeStampToString(article.pubTime) }}
                  <el-tag v-for="(tag, id) in tagStringToList(article.tags)" :key="id" size="mini"
                          style="margin-left: .5em">
                    {{tag }}
                  </el-tag>
                  <el-tag size="mini" type="success" style="margin-left: 1em">
                    {{ article.kind }}
                  </el-tag>
                </el-row>
                <el-row style="margin-left: 0; float: left">
                  <div class="desc" style="text-align: left; margin-top: .3rem;" @click="seeDetail(article._id)">
                    <label style="font-weight: bold">概要：</label>{{ descSimple(article.desc) }}
                  </div>
                </el-row>
              </el-col>
            </el-row>
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
  import {getAllArticles, getIndexArticles} from "../../api/blog";
  //import BasicLayout from "../../components/BasicLayout";
  import commonLayout from "../../components/commonLayout";
  import loading from "../../components/loading"

  export default {
    name: "ArticleManage",
    components: {commonLayout, loading},
    data() {
      return {
        articleList: [],
        previewData: '',
        hotBangumiList: '',
        queryKind: '',
        queryTag: '',
        querySearch: '',
        searchText: '',
        findArticle: false,
        isLoading: true,
      }
    },
    methods: {
      seeDetail(_id) {
        console.log(_id);
        this.$router.push('/article/' + _id.toString());
      },
      imgToImgList(img) {
        let list = [];
        list.push(img);
        return list;
      },
      tagStringToList(tags) {
        let result = [];
        let list = tags.slice(1, -1).split(',');
        for (var i = 0; i < list.length; i++) {
          result.push(list[i].slice(1, -1));
        }
        return result;
      },
      goToSearchQuery(searchText) {
        this.$router.push("/article?s=" + searchText);
        location.reload();
      },
      descSimple(desc) {
        let length = desc.length;
        if (length > 200) {
          desc = desc.slice(0, 200) + '...';
        }
        return desc;
      },
      timeStampToString(st) {
        let date = new Date(parseInt(st));
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
        let timeString = Y + '-' + M + '-' + D
        return (timeString);
      },
      judgeShow(article) {
        //console.log(article);
        if (article.type === 'blog') {
          if (this.queryKind) {
            return article.kind === this.queryKind;
          } else if (this.queryTag) {
            console.log(this.tagStringToList(article.tags));
            console.log(this.queryTag);
            if (this.tagStringToList(article.tags).indexOf(this.queryTag) > -1) {
              return true;
            } else {
              return false;
            }
          }
          // 没有筛选条件了
          else {
            return true;
          }
        } else {
          return false;
        }
      },
      handleQuery() {
        this.isLoading = true;
        let query = this.$route.query;
        if (query.s) {
          this.querySearch = query.s;

          getAllArticles().then((res) => {
            if (res.status === 200) {
              this.articleList = res.data.filter(array => array.content.match(this.querySearch));
              if (this.articleList.length > 0) {
                this.findArticle = true;
              }
              this.isLoading = false;
            } else {
              console.log("Failed");
            }
          });

        } else if (query.kind) {
          this.queryKind = query.kind;
          //console.log(this.queryKind);
        } else if (query.tag) {
          this.queryTag = query.tag;
          //console.log(this.queryTag);
        }
      }
    },
    created() {
      getIndexArticles().then((res) => {
        //console.log(res);
        if (res.status === 200) {
          this.articleList = res.data;
          console.log(res)
          this.handleQuery();
          this.isLoading = false;
        } else {
          console.log("Failed");
        }
      });


    },

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
    filter: blur(15px);
    height: 100%;
    width: auto \9;
    width: 100%;
    z-index: 0;
    position: fixed;
    opacity: 0.4;
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

  #articleCard:hover {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 1);
  }

  #articleCard {
    background: rgba(255, 255, 255, 0.7);
    transition: all 1000ms;
  }


</style>
