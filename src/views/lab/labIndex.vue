<template>
  <div>
    <basic-layout v-slot:main>
      <div class="card-content">
        <el-row :gutter="25" type="flex" justify="center">
          <el-col :xs="10" :sm="10" :md="10">
            <div class="lab-card bg-gradient-blue" shadow="hover" style="height: 10em;max-width: 25em;" @click="goToMikuPage()">
              <el-row :gutter="24" type="flex" justify="space-around">
                <el-col :xs="24" :sm="6" :md="6">
                  <img src="@/assets/lab/miku-logo.png" style="height: 10em">
                </el-col>
                <el-col :xs="0" :sm="14" :md="14">
                  <div class="lab-title">MikuMikuDance</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10">
            <div class="lab-card bg-gradient-orange" shadow="hover" style="height: 10em;max-width: 25em;" @click="goToSpinePage()">
              <el-row :gutter="24" type="flex" justify="space-around">
                <el-col :xs="24" :sm="6" :md="6">
                  <img src="@/assets/lab/mcw.png" style="height: 10em">
                </el-col>
                <el-col :xs="0" :sm="14" :md="14">
                  <div class="lab-title">Spine</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </div>
    </basic-layout>
  </div>
</template>

<script>
  import BasicLayout from "../../components/BasicLayout";
  import "../../../public/css/mmd_style.css"

  export default {
    name: "labIndex",
    components: {
      BasicLayout,
    },
    methods: {
      goToMikuPage() {
        window.location.replace("https://yicheng.me/miku.html");
      },
      goToSpinePage() {
        window.location.replace("https://yicheng.me/spine.html");
      }
    }
  }
</script>

<style scoped>

  .lab-card {
    padding: 1em;
    border-radius: 1em;
    transition: all 1000ms;
  }

  .lab-card:hover {
    transform: scale(1.02);
  }

  .lab-title {
    font-size: xx-large;
    color: white;
    font-family: TianLi, FZZongYi-M05, monospace;
    margin-top: 2em;
  }


  .bg-gradient-primary {
    background-image: linear-gradient(45deg, #50a1ff, #88bfff) !important
  }

  .bg-gradient-secondary {
    background-image: linear-gradient(45deg, #e9ecf0, #f0f2f5) !important
  }

  .bg-gradient-green {
    background-image: linear-gradient(45deg, #7fe496, #6edf8f) !important
  }

  .bg-gradient-orange {
    background-image: linear-gradient(45deg, #fe9078, #f1b87f) !important
  }

  .bg-gradient-blue {
    background-image: linear-gradient(45deg, #6cacfd, #93c8ff) !important;
  }

  .bg-gradient-purple {
    background-image: linear-gradient(45deg, #a682e4, #c1a7e9) !important
  }

  .bg-gradient-danger {
    background-image: linear-gradient(45deg, #ff4954, #ff838b) !important
  }

  .bg-gradient-warning {
    background-image: linear-gradient(45deg, #ffba00, #ffd052) !important
  }

  .bg-gradient-info {
    background-image: linear-gradient(45deg, #926dde, #b59ce9) !important
  }

  .bg-gradient-dark {
    background-image: linear-gradient(45deg, #191919, #636363) !important
  }

</style>


