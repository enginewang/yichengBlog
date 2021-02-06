<template>
  <div class="loading"></div>
</template>

<script>
  export default {
    name: 'loading'
  }
</script>

<style scoped>
  .loading {
    position: fixed;
    left: 0;
    top: 0;
    background: url('../assets/loading.gif') center center no-repeat rgb(255,255,255);
    opacity: 1;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  }
</style>
