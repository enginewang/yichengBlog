<template>
  <div class="home">
    <img class="bg" src="../assets/bg.jpg">
      <div class='welcome-text'>
      <!--
      <div v-anime="{ scaleX: 1.2, scaleY: 1.2, duration: 5000, translateY: -50,delay: 2000 }">
        <h2 class="welcome" style="color: rgba(255,255,255, 0);">Welcome to my blog</h2>
      </div>
      -->
      <div v-anime="{ translateY: {value: -20,duration: 1000, delay: 2000},
      scale: {value: 1.3,duration: 1000,delay: 3000,easing: 'easeInOutQuart'} }">
        <el-button class="start-btn" type="text"
                   style="color: white;z-index: 200;font-size: medium;bottom: 0;color: rgba(255,255,255, 0);top: 60%;"
                   @click="blogPage">Click HERE to Start!<div style="font-size: small;margin-top: 1em;"> - 点击开始 - </div>
        </el-button>
      </div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 909.35 310.74">
      <title>Asset 7</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Lines" data-name="Layer 1">
          <text class="cls-1" transform="translate(1 261.19) scale(0.99 1)">Y</text>
          <text class="cls-2" transform="translate(97 262.09) scale(1.02 1)">i</text>
          <text class="cls-1" transform="translate(419 262.19) scale(0.99 1)">g</text>
          <text class="cls-1" transform="translate(342 261.19) scale(0.99 1)">n</text>
          <text class="cls-1" transform="translate(268 262.19) scale(0.99 1)">e</text>
          <text class="cls-1" transform="translate(116 260.19) scale(0.99 1)">c</text>
          <text class="cls-1" transform="translate(189 261.19) scale(0.99 1)">h</text>
          <text class="cls-1" transform="translate(616 259.19) scale(0.99 1)">B</text>
          <text class="cls-3" transform="translate(704 261.28) scale(1.01 1)">l</text>
          <text class="cls-1" transform="translate(724 261.19) scale(0.99 1)">o</text>
          <text class="cls-1" transform="translate(806 260.19) scale(0.99 1)">g</text>
          <text class="cls-1" transform="translate(512 261.19) scale(0.99 1)">s</text>
          <text class="cls-1" transform="matrix(-0.98, -0.1, 0.11, -0.99, 566, 53.63)">‘</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      blogPage() {
        this.$router.push("article");
      }
    },
    mounted() {
      //const targets = this.$el;
      this.$anime.timeline()
          .add({
            targets: '.start-btn',
            color: 'rgba(255,255,255, 1)',
            easing: 'easeOutExpo',
            delay: 4000,
            duration: 1500,
          })
    },
  }
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    background: #000000;
    overflow: hidden;
    position: absolute;
    margin: auto;
  }

  .bg {
    left: 0;
    object-fit: cover;
    opacity: 0.5;
    height: 100%;
    width: auto \9;
    width: 100%;
    z-index: 0;
    position: absolute;
  }

  .welcome-text {
    color: whitesmoke;
    font-size: 28px;
    z-index: 100;
    position: absolute;
    text-align: center;
    top: 55%;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

  .cls-1, .cls-2, .cls-3 {
    fill: none;
    stroke: #eee;
    stroke-miterlimit: 10;
    stroke-width: 2px;
    stroke-dasharray: 550;
    animation: dash 4s ease-in-out, fill 3s ease-in-out 4s, fill2 2s ease-in-out 6s, dash2 3s ease-in-out 8s, dash3 3s ease-in-out 11s forwards;
  }

  @keyframes dash {
    0%{
      stroke-dashoffset: 540;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes fill {
    0% {
      fill: rgba(255,255,255,0);
      stroke: rgba(255,255,255,1);
    }
    100% {
      fill: rgba(255,255,255,1);
      stroke: rgba(255,255,255,0);
    }
  }

  @keyframes fill2 {
    0% {
      fill: rgba(255,255,255,1);
      stroke: rgba(255,255,255,0);
    }
    100% {
      fill: rgba(255,255,255,0);
      stroke: rgba(255,255,255,1);
    }
  }

  @keyframes dash2 {
    0%{
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 570;
    }
  }

  @keyframes dash3 {
    0%{
      stroke-dashoffset: 540;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }


  .cls-1 {
    font-size: 169.95px;
  }

  .cls-1, .cls-3 {
    font-family: SFUIText-Regular, SF UI Text;
  }

  .cls-2 {
    font-size: 165.21px;
    font-family: Tahoma;
  }

  .cls-3 {
    font-size: 166.05px;
  }

  svg {
    position: absolute;
    z-index: 200;
    margin: auto;
    width: 30rem;
    bottom: 60%;
    left: 0;
    right: 0;
  }

  .start-btn:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .1);
  }
  .start-btn {
    font-family: "Fira Code", "Consolas", "Microsoft YaHei",monospace;
    transition: all 1200ms;
    padding-left: 1em;
    padding-right: 1em;
  }

</style>
