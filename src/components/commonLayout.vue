<template>
  <el-container>
    <el-header>
      <nav-menu/>
    </el-header>
    <el-main style="margin-top: 2em;">
      <el-row :gutter="25">
        <el-col :span="15" :offset="2">
          <slot name="main"/>
        </el-col>
        <el-col :span="5">
          <slot name="search"/>
          <side-notice/>
        </el-col>
      </el-row>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script>
  import NavMenu from "../assets/NavMenu";
  import MyFooter from "../components/myFooter"
  import SideNotice from "../components/sideNotice"

  export default {
    name: "commonLayout",
    components: {NavMenu, MyFooter, SideNotice},
  }
</script>

<style scoped>
  .el-header {
    padding: 0;
  }
</style>
