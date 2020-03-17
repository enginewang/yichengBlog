<template>
  <el-menu
          default-active="1"
          class="el-menu-vertical"
          background-color="#232323"
          text-color="#fff"
          mode="vertical"
          active-text-color="#409EFF"
          style="height: 100%;position: fixed; width: 20%">
    <div style="margin-top: 2em; color: white;font-size: large">
        <font-awesome-icon icon="laptop-code" style="margin-bottom: 0.15em"/>
        <label style="font-size: 24px;margin-left: .5em;">控制台</label>
    </div>
    <el-menu-item index="1" style="margin-top: 2em;">
      <template slot="title">
        <i class="el-icon-reading"></i>
        <router-link to="/admin/manageArticle">
          文章管理
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item index="2">
      <template slot="title">
        <i class="el-icon-news"></i>
        <span>公告管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="3">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span>资源管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="4">
      <template slot="title">
        <i class="el-icon-chat-dot-round"></i>
        <span>票圈管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="5">
      <template slot="title">
        <i class="el-icon-s-custom"></i>
        <router-link to="/admin/manageUser">
          用户管理
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item index="6">
      <template slot="title">
        <i class="el-icon-house"></i>
        <router-link to="/article">
          返回首页
        </router-link>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: "sideBar",
  }

</script>

<style scoped>
  a {
    text-decoration: none;
    color: white;
    margin-top: 0.2em;
  }
  .el-menu {
    height: 80%;
  }

  .el-menu-item {
    margin-top: 1em;
    font-size: 16px;
  }
</style>
