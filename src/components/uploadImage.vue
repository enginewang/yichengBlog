<template>
  <div class="upload-container">
    <el-upload
            drag
            action="https://yicheng.me/api/upload"
            :on-success="handleAvatarSuccess"
            multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
    <div v-show="hasUpload">
      <div class="img-box" style="margin-top: 2em;">
        <el-image :src="fileUrl"></el-image>
        <p>URL: {{ fileUrl }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'uploadImage',
    data() {
      return {
        fileUrl: '',
        hasUpload: false
      }
    },
    methods: {
      handleAvatarSuccess(response, file, fileList) {
        this.hasUpload = true;
        this.fileUrl = "https://yicheng.me/image/" + response;
        console.log(this.fileUrl)
        this.$emit('returnUrl', this.fileUrl)
      },
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    width: 100%;
    border: #5a5e66 dashed .2em;
    border-radius: 1em;
    background-color: #f1f1f1;
  }

  .avatar-uploader-icon {
    font-size: 48px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
