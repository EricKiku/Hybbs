<template>
    <div class="chat_room">
        <ChatRoomList></ChatRoomList>
        <ChatRoom></ChatRoom>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import ChatRoomList from "../components/chatRoom/ChatRoomList.vue"
import ChatRoom from "../components/chatRoom/ChatRoom.vue"
</script>

<style lang="less" scoped>
.chat_room {
    width: 100%;
    height: 100%;
    border-top-left-radius: 10px;
    overflow: hidden;
    background-color: #2B2D31;
    display: flex;
}
</style>