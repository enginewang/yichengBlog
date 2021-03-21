<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Microsoft YaHei", "WenQuanYi Micro Hei", "微软雅黑", 'HanHei SC', Helvetica, Tahoma, Arial, "Hiragino Sans GB", 'PingFang SC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-main {
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgba(251, 252, 252, 1);
  padding: 0;
  overflow-x: hidden;
}

@font-face {
  font-family: 'RuiZiLongShu';
  src: url('../public/fonts/RuiZiLongShu.ttf');
}
</style>
