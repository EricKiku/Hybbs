<template>
    <div class="plaza">
        <button @click="test()">发送</button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { sendApi } from "../api/test"
let result = ref("")
function test() {
    sendApi().then(res => {
        console.log(res);

    })
}
</script>

<style lang="less" scoped>
.plaza {
    width: 100%;
}
</style>