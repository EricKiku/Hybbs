<template>
  <FormTitleBar />
  <!-- 聊天窗口 -->
  <ChatWindow v-if="chatStore.getChatStatus()"></ChatWindow>
  <template style="display: flex;height: calc(100% - 30px);background-color: white;">
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
// 引入聊天窗口
import ChatWindow from "./components/forum/ChatWindow.vue"
import { storeOfChat } from "./store/chat";
// 引入重置样式表
import './assets/css/reset.css'
import { ref, onMounted } from "vue"
import { loginByid } from "./api/loginAPI"
import { storeOfUser } from "./store/user"
const userStore = storeOfUser()
const chatStore = storeOfChat()
// 自动登录
onMounted(() => {

  if (localStorage.getItem("user_id")) {
    let id = localStorage.getItem("user_id")
    loginByid(id).then(res => {
      userStore.setCurrentUser(res.data)
    })
  }
})
</script>

<style lang="less" scoped>
.mask {
  height: calc(100% - 30px);
  width: 100%;
  position: absolute;
  z-index: 1;
  background-color: rgba(1, 1, 1, 0.2);
}
</style>