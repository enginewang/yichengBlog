<template>
  <div class="app-container">
    <el-upload
            class="avatar-uploader"
            action="http://localhost:1323/api/upload/image"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'uploadImage',
    data() {
      return {
        imageUrl: '',
        headers: {
          'Accept': 'text/plain'
        },
        smfile: {
          smfile: null
        }
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        //console.log("handleAvatarSucc invoked!");
        //console.log(res);
        //console.log(file);
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        this.smfile.smfile = file;
        //console.log(this.smfile.smfile);
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          //console.log('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
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
