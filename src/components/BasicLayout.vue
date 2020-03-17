<template>
  <el-container>
    <el-header>
      <nav-menu/>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="22" :offset="1">
          <slot name="main"/>
        </el-col>
      </el-row>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script>
  import NavMenu from "../assets/NavMenu";
  import MyFooter from "../components/myFooter"

  export default {
    name: "basicLayout",
    components: {NavMenu, MyFooter},
    //props: ['type', 'type_id'],
  }
</script>

<style scoped>
  .el-header {
    padding: 0;
  }
  main {
    min-height: calc(85vh);
  }
</style>
