<template>
    <div class="chat_room_content">
        <router-view></router-view>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

</script>

<style lang="less" scoped>
.chat_room_content {
    flex: 1;
    background-color: #313338;
}
</style>