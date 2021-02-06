<template>
  <el-container>
    <el-header>
      <nav-menu/>
    </el-header>
    <el-main style="margin-top: 2em;margin-bottom: 2em;">
      <el-row :gutter="25" type="flex" justify="center">
        <el-col :xs="23" :sm="16" :md="16">
          <slot name="main"/>
        </el-col>
        <el-col :xs="0" :sm="7" :md="7">
          <slot name="search"/>
          <side-notice/>
        </el-col>
      </el-row>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script>
import NavMenu from './NavMenu'
import MyFooter from '../components/myFooter'
import SideNotice from '../components/sideNotice'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'commonLayout',
  components: {
    NavMenu,
    MyFooter,
    SideNotice
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
    }
  },
}
</script>

<style scoped>
.el-header {
  padding: 0;
}
</style>
