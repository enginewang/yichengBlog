<template>
  <div class="comment-area" v-if="hackReset===true">
    <el-card class="box-card" style="margin-top: 2em;">
      <div slot="header" class="clearfix">
        <h3 style="float: left;margin-top: 0; margin-bottom: 0">评论区</h3>
      </div>
      <div class="commentShow">
        <div v-show="!hasComment"> 评论区空空如也，快来抢&nbsp;<font-awesome-icon icon="couch"/>&nbsp;吧~</div>
        <el-card class="box-card" v-for="(c, index) in CommentList" :key="index" shadow="hover"
                 style="margin-bottom:.4em;border: none;" v-if="!c.hasReply">
          <el-row :gutter="2">
            <el-col :span="3" style="margin-top: 1em">
              <el-avatar v-bind:src="c.comment.avatar" size="medium"></el-avatar>
              <div style="font-family: 'PingFang SC'; font-size: .9em;">{{ c.comment.username }}</div>
            </el-col>
            <el-col :span="20" style="padding-left: .2em;">
              <div class="comment-content" style="float: left;text-align: left; width: 100%">
                <MarkdownDisplay :markdown="c.comment.content"></MarkdownDisplay>
              </div>
              <span
                style="float: left;color: #5a5e66; font-size: small"> 评论于： {{ timeStampToString(c.comment.time, 'second') }}</span>
              <el-button type="text" v-if="isMyComment(c.comment)" @click="deleteThisComment(c.comment._id)"
                         style="float: right;color: red">
                <font-awesome-icon icon="trash"/>
                删除
              </el-button>
              <el-button type="text" @click="replyThisComment(c.comment._id)" style="float: right;margin-right: 2em;">
                <font-awesome-icon icon="comment-dots"/>&nbsp;&nbsp;&nbsp;参与讨论
              </el-button>

            </el-col>
          </el-row>
          <el-row :gutter="2" v-show="c.isActive">
            <el-row :gutter="10">
              <el-col :span="2">
                <el-avatar v-bind:src="avatar" size="medium"></el-avatar>
              </el-col>
              <el-col :span="17">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="在此回复..."
                  style="float: left;margin-left: .5em;"
                  v-model="replyContent">
                </el-input>
              </el-col>
              <el-col :span="2">
                <el-popover
                  placement="top"
                  title="内置表情包"
                  width="800"
                  trigger="hover">
                  <label v-for="emoji in defaultAcgEmojiList" :key="emoji" style="margin-right: .5em">
                    <img :src="emoji" style="width: 4em;height: 4.5em" class="emoji"
                         @click="addEmoji(emoji,'reply')"></img>
                  </label>
                  <el-button slot="reference" size="small">
                    <font-awesome-icon icon="smile-wink"/>
                  </el-button>
                </el-popover>
              </el-col>
              <el-col :span="2">

                <el-button size="mini" type="primary"
                           @click="postReply(c.comment)">回复
                </el-button>
                <el-button style="margin-left: 0" size="mini"
                           @click="replyThisComment(c.comment._id)">取消
                </el-button>
              </el-col>
            </el-row>
          </el-row>
          <el-card v-if="!c.hasReply"
                   style="width: 90%; float: right;margin-bottom:0;margin-top:0;border: none;background-color: rgba(255,255,255,0)"
                   shadow="none">
            <el-row :gutter="10" v-for="reply_id in replyCommentDict[c.comment._id]">
              <el-col :span="3" style="margin-top: 1em">
                <el-avatar v-bind:src="returnCommentById(reply_id).avatar" size="medium"></el-avatar>
                <div style="font-family: 'PingFang SC'; font-size: .9em;">{{ returnCommentById(reply_id).username }}
                </div>
              </el-col>

              <el-col :span="20" style="padding-left: .2em;">
                <div class="comment-content" style="float: left;text-align: left; width: 100%">
                  <MarkdownDisplay :markdown="returnCommentById(reply_id).content"></MarkdownDisplay>
                </div>
                <span
                  style="float: left;color: #5a5e66; font-size: small"> 评论于： {{ timeStampToString(returnCommentById(reply_id).time, 'second') }}</span>
              </el-col>
              <el-button type="text" v-if="isMyComment(returnCommentById(reply_id))"
                         @click="deleteThisComment(reply_id)"
                         style="float: right;color: red">
                <font-awesome-icon icon="trash"/>
                删除
              </el-button>
            </el-row>
          </el-card>

        </el-card>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 2em;">
      <div slot="header" class="clearfix">
        <h3 style="float: left;margin-top: 0; margin-bottom: 0">写评论</h3>
        <label style="float: left;font-size: small;margin-left: 1em;margin-top: .3em;">（支持markdown语法）</label>
        <el-popover
          placement="top"
          title="内置表情包"
          width="800"
          trigger="hover"
          v-show="canComment">
          <label v-for="emoji in defaultAcgEmojiList" :key="emoji" style="margin-right: .5em">
            <img :src="emoji" style="width: 4em;height: 4.5em" class="emoji" @click="addEmoji(emoji,'comment')"></img>
          </label>
          <el-button slot="reference" size="small" type="primary" style="float: right;margin-left: 1em;">
            <font-awesome-icon icon="smile-wink"/>&nbsp;&nbsp;插入内置表情包
          </el-button>
        </el-popover>
        <el-button size="small" style="float: right" @click="toggleMarkdown" v-show="canComment">
          <font-awesome-icon icon="marker"/>&nbsp;&nbsp;Markdown预览
        </el-button>
      </div>
      <div class="commentShow">
        <div class="write-comment" v-show="canComment">
          <el-row :gutter="10">
            <el-col :span="2">
              <el-avatar v-bind:src="avatar" size="medium"></el-avatar>
              <div style="font-family: 'PingFang SC';font-size: small">{{ username }}</div>
            </el-col>
            <el-input v-show="showWriteComment"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 8}"
                      placeholder="在此评论..."
                      style="width: 79%;float: left;margin-left: .5em;"
                      v-model="commentContent">
            </el-input>

            <el-button type="primary" style="float: right; width: 10%;padding-left: 1.5%;padding-right: 1.5%;"
                       @click="postComment">
              评论
            </el-button>
          </el-row>
          <el-row :gutter="10" style="margin-top: 2em" v-show="markdownShow">
            <el-col :span="24" style="text-align: left; background-color: #f5f5f5; padding: 1em;border-radius: .5em;">
              Markdown预览区：
              <MarkdownDisplay :markdown="commentContent"></MarkdownDisplay>
            </el-col>
          </el-row>

        </div>
        <div class="write-comment" v-show="!canComment">
          抱歉，您没有登陆，不能发表评论哦，点击
          <el-button type="text" @click="goToRegisterPage" style="font-size: 16px">注册</el-button>
          或
          <el-button type="text" @click="goToLoginPage" style="font-size: 16px;margin-left: 0;">登录</el-button>
        </div>

      </div>
    </el-card>
    <el-dialog title="抱歉，只有登录后才能发表观点哦" :visible.sync="showLoginDialog">
      点击
      <el-button type="text" @click="goToRegisterPage" style="font-size: 16px">注册</el-button>
      或
      <el-button type="text" @click="goToLoginPage" style="font-size: 16px;margin-left: 0;">登录</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getUserByName } from '../api/user'
import { addComment, deleteComment, getCommentsByArticleId, getCommentsByReplyId } from '../api/comment'
import { updateArticle } from '../api/blog'
import MarkdownDisplay from './markdownDisplay'
import 'highlight.js/styles/googlecode.css'
import commonLayout from './commonLayout'
// import Clipboard from 'clipboard'

export default {
  name: 'comment',
  props: ['type', 'type_id'],
  components: {
    MarkdownDisplay
  },
  data () {
    return {
      pageType: '',
      pageTypeId: this.type_id,
      username: '',
      userId: '',
      avatar: '',
      canComment: false,
      commentContent: '',
      replyContent: '',
      commentId: '',
      directCommentList: [],
      replyCommentDict: {},
      CommentList: [],
      timeString: '',
      showLoginDialog: false,
      showWriteComment: true,
      hasComment: false,
      hackReset: true,
      markdownShow: false,
      defaultAcgEmojiList: [
        'https://i.loli.net/2020/03/11/xt9cGHEFokXulPZ.png',
        'https://i.loli.net/2020/03/11/Tdnxok7pSYzjCrH.png',
        'https://i.loli.net/2020/03/11/sqrbZvpJWQFKoj8.png',
        'https://i.loli.net/2020/03/11/BWVY2RMhHsrCSvz.png',
        'https://i.loli.net/2020/03/11/yVkgFCHlR2O5XsB.png',
        'https://i.loli.net/2020/03/11/OQoElrezfmxDSgA.png',
        'https://i.loli.net/2020/03/11/jQOP19ayUE6udoe.png',
        'https://i.loli.net/2020/03/11/7hjfJq4Tt6cxDMW.png',
        'https://i.loli.net/2020/03/11/bA9NUIFWOXmhQzB.png',
        'https://i.loli.net/2020/03/11/bW8jxS4OMFpnc2H.png',
        'https://i.loli.net/2020/03/11/LBRyfn4YXQMPH3z.png',
        'https://i.loli.net/2020/03/11/7HrodwaZWq9pRLX.png',
        'https://i.loli.net/2020/03/11/KUCRImYJ3B2jbln.png',
        'https://i.loli.net/2020/03/11/5ODdsFBRTE7XqVa.png',
        'https://i.loli.net/2020/03/11/vgNMV1pGHUtAcOe.png',
        'https://i.loli.net/2020/03/11/fM3Lu5kwxGXsgHc.png',
        'https://i.loli.net/2020/03/11/6H1YGVfTvFxayzC.png',
        'https://i.loli.net/2020/03/11/JvfeY3skm9OC1cb.png',
        'https://i.loli.net/2020/03/11/AymDUaIbFelwcsS.png',
        'https://i.loli.net/2020/03/11/64VBRFOeG8uK9tb.png',
        'https://i.loli.net/2020/03/11/eGEJs7rN1OLqiHM.png',
        'https://i.loli.net/2020/03/11/YyForpBJbjS78Pc.png',
        'https://i.loli.net/2020/03/11/WhGig4wCekIZoVA.png',
        'https://i.loli.net/2020/03/11/X9E5i4nJGhHPdjw.png',
        'https://i.loli.net/2020/03/11/1yvWEniUl4BCIGF.png',
        'https://i.loli.net/2020/03/11/T1wbmH8LYZOD6g4.png',
        'https://i.loli.net/2020/03/11/Qb38DgNyxiYIRMf.png',
        'https://i.loli.net/2020/03/11/i5wICKdjS24rDkA.png',
        'https://i.loli.net/2020/03/11/K3CUe1qVujGrWkM.png',
        'https://i.loli.net/2020/03/11/p74jhEdWbx2vVI3.png',
        'https://i.loli.net/2020/03/11/eyFNPLXcDwSBsGW.png',
        'https://i.loli.net/2020/03/11/dDLVy8tsCeKoSOQ.png',
        'https://i.loli.net/2020/03/11/CG7DBpWJAEk2rsy.png',
        'https://i.loli.net/2020/03/11/dHaIkeKT9LfJlB1.png',
        'https://i.loli.net/2020/03/11/vm3EhNoSLBYqiAV.png',
        'https://i.loli.net/2020/03/11/8YHMF5pNOXrdWBS.png',
        'https://i.loli.net/2020/03/11/8FekqRVE9pya1nc.png',
        'https://i.loli.net/2020/03/11/sxtYWZMpHh5ICPf.png',
        'https://i.loli.net/2020/03/11/MFgUk6r3fjYJuaP.png',
        'https://i.loli.net/2020/03/11/6PJZtLyFvkbAXpS.png',
        'https://i.loli.net/2020/03/11/CHAvEPfr5dnGFJo.png',
        'https://i.loli.net/2020/03/11/lwLp85Fhv6iK2db.png',
        'https://i.loli.net/2020/03/11/BSGhpvCVLWlQ5YZ.png',
        'https://i.loli.net/2020/03/11/MpHRPyiGboVAU9J.png',
        'https://i.loli.net/2020/03/11/qXV4omLJlSuR9DP.png',
        'https://i.loli.net/2020/03/11/LOYow2Wfh4Stqi5.png',
        'https://i.loli.net/2020/03/11/lF1UQOt8AeKGS2x.png',
        'https://i.loli.net/2020/03/11/79yHEAo8iDBTqxb.png',
        'https://i.loli.net/2020/03/11/es9yXziZAR4G1wn.png'
      ]
    }
  },
  methods: {
    reloadWriteComment () {
      this.showWriteComment = false
      this.$nextTick(function () {
        this.showWriteComment = true
      })
    },
    isMyComment (comment) {
      if (comment.username === this.username) {
        return true
      } else {
        return false
      }
    },
    deleteThisComment (id) {
      // console.log(id);
      deleteComment(id).then((res) => {
        if (res.status === 204) {
          this.$notify({
            title: '删除成功',
            message: '评论删除成功',
            type: 'success'
          })
          const childList = this.getReplyList(id)
          // console.log(childList)
          if (childList) {
            for (var i = 0; i < childList.length(); i++) {
              consol.log(childList[i])
            }
            deleteComment(childList[i])
          }
          this.flushComment()
        } else {
          this.$notify.error({
            title: '错误',
            message: '评论删除时遇到了错误'
          })
        }
      })
    },
    addEmoji (emoji, kind) {
      const link_url = '<img src="' + emoji + '" style="width: 20% !important;"' + '>'
      if (kind === 'comment') {
        this.commentContent += link_url
      } else {
        if (kind === 'reply') {
          this.replyContent += link_url
        }
      }
    },
    returnCommentById (id) {
      const comment = {}
      for (let i = 0; i < this.CommentList.length; i++) {
        if (this.CommentList[i].comment._id === id) {
          return this.CommentList[i].comment
        }
      }
    },
    toggleMarkdown () {
      this.markdownShow = !this.markdownShow
    },
    goToRegisterPage () {
      this.$router.push({ path: '/register' })
    },
    goToLoginPage () {
      this.$router.push({ path: '/login' })
    },
    postComment () {
      const form = {}
      var timeStamp = new Date().getTime()
      form.username = this.username
      form.avatar = this.avatar
      form.time = timeStamp.toString()
      form.content = this.commentContent
      form.articleId = this.pageTypeId
      if (this.commentContent != '') {
        // 先把评论加进评论区，然后增加到aritcle里面
        addComment(form).then((res) => {
          if (res.status === 200) {
            this.commentId = res.data._id
            this.$notify({
              title: '发布成功！',
              message: '评论发布成功！',
              type: 'success'
            })
            window.location.reload()
          } else {
            this.$notify({
              title: '评论失败',
              message: '可能遇到了未知的问题！',
              type: 'error'
            })
          }
        }).catch(error => {
          console.log(error)
          this.$notify({
            title: '评论失败',
            message: '可能遇到了未知的问题！',
            type: 'error'
          })
        })
      } else {
        this.$notify({
          title: '评论失败',
          message: '评论区必须填写内容！',
          type: 'error'
        })
      }
    },
    replyThisComment (comment_id) {
      if (this.canComment) {
        // console.log("comment_id" + comment_id)
        for (let i = 0; i < this.CommentList.length; i++) {
          console.log(this.CommentList[i].comment._id)
          if (this.CommentList[i].comment._id === comment_id) {
            // console.log(this.CommentList[i].isActive)
            // console.log(!this.CommentList[i].isActive)
            this.CommentList[i].isActive = !this.CommentList[i].isActive
            // console.log(this.CommentList[i].isActive)
          }
        }
      } else {
        this.showLoginDialog = true
      }
    },
    postReply (comment) {
      // console.log(comment);
      let replyId
      if ('replyId' in comment) {
        replyId = comment.replyId
      } else {
        replyId = comment._id
      }
      const form = {}
      var timeStamp = new Date().getTime()
      form.username = this.username
      form.avatar = this.avatar
      form.time = timeStamp.toString()
      form.content = this.replyContent
      form.articleId = this.pageTypeId
      form.replyId = replyId
      // console.log(form);
      if (this.replyContent != '') {
        // 先把评论加进评论区，然后增加到aritcle里面
        addComment(form).then((res) => {
          if (res.status === 200) {
            this.$notify({
              title: '发布成功！',
              message: '评论发布成功！',
              type: 'success'
            })
            window.location.reload()
          } else {
            this.$notify({
              title: '回复失败',
              message: '可能遇到了未知的问题！',
              type: 'error'
            })
          }
        }).catch(error => {
          console.log(error)
          this.$notify({
            title: '回复失败',
            message: '可能遇到了未知的问题！',
            type: 'error'
          })
        })
      } else {
        this.$notify({
          title: '回复失败',
          message: '回复评论区必须填写内容！',
          type: 'error'
        })
      }
    },
    getReplyList (id) {
      getCommentsByReplyId(id).then((res) => {
        if (res.status === 200) {
          const resultList = []
          console.log(res.data)
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              resultList.push(res.data[i]._id)
            }
            return resultList
          } else {
            return []
          }
        }
      })
    },
    loadComment () {
      this.CommentList = []
      this.replyCommentDict = {}
      this.directCommentList = []
      getCommentsByArticleId(this.pageTypeId).then((res) => {
        if (res.status === 200) {
          for (const i in res.data) {
            const comment = res.data[i]
            console.log(comment)
            const thisComment = {
              comment: comment,
              hasReply: false,
              isActive: false
            }
            if ('replyId' in comment) {
              thisComment.hasReply = true
            } else {
              this.directCommentList.push(comment._id)
              this.hasComment = true
              const reply = []
              this.replyCommentDict[comment._id] = reply
            }
            this.CommentList.push(thisComment)
          }
          // console.log(this.directCommentList);

          for (let i = 0; i < this.CommentList.length; i++) {
            if (this.CommentList[i].hasReply) {
              // console.log(this.CommentList[i]);
              for (let j = 0; j < this.directCommentList.length; j++) {
                // console.log("i=" + i + ",j=" + j + ":" + this.CommentList[i].comment.replyId)
                // console.log("i=" + i + ",j=" + j + ":" + this.directCommentList[j])
                if (this.CommentList[i].comment.replyId === this.directCommentList[j]) {
                  this.replyCommentDict[this.CommentList[i].comment.replyId].push(this.CommentList[i].comment._id)
                }
              }
            }
          }
          console.log(this.replyCommentDict)
          console.log(this.hasComment)
        } else {
          console.log('Failed')
        }
      })
    },
    flushComment () {
      this.hackReset = false
      this.loadComment()
      this.$nextTick(() => {
        this.hackReset = true
      })
    }
  },
  created () {
    if (localStorage.userName) {
      this.canComment = true
      // console.log(this.canComment);
      this.username = localStorage.userName
      getUserByName(this.username).then((res) => {
        if (res.status === 200) {
          this.avatar = res.data.avatar
          this.userId = res.data.userId
        } else {
        }
      }).catch(error => {
        localStorage.clear()
      })
    }

    this.loadComment()
  }
}
</script>

<style scoped>
.userInfo {
  padding: 0;
}

.el-card {
  background: rgba(255, 255, 255, 0.7);
}
</style>
