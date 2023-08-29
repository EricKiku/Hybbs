<template>
  <FormTitleBar />
  <template style="display: flex;height: calc(100% - 30px);background-color: #EBE1B7;">
    <!-- <div v-if="false" class="mask">
    </div> -->
    <Sidebar />
    <!-- 主界面展示路由 -->
    <router-view></router-view>
  </template>
</template>

<script lang="ts" setup>
// 引入标题栏
import FormTitleBar from "./components/FormTitleBar.vue";
// 引入侧边栏
import Sidebar from "./components/Sidebar.vue";
// 引入重置样式表
import './assets/css/reset.css'
import { ref } from "vue"

</script>

<style lang="less" scoped>
.mask {
  height: calc(100% - 30px);
  width: 100%;
  position: absolute;
  z-index: 1;
  background-color: rgba(1, 1, 1, 0.2);
}</style>