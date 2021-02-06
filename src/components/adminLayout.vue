<template>
    <el-container>
      <el-row :gutter="10">
       <el-col :span="5">
         <side-bar/>
       </el-col>
        <el-col :span="19" :offset="5">
          <el-main>
            <slot name="main"/>
          </el-main>
        </el-col>
      </el-row>
        <el-footer></el-footer>
    </el-container>
</template>

<script>
    import sideBar from "./sideBar";

    export default {
        name: "adminLayout",
        components: {sideBar}
    }
</script>

<style scoped>
    .el-header{
        padding: 0;
    }
    .el-footer {
        padding: 0;
        bottom: 0;
    }
</style>
