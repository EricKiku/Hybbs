<template>
    <div class="file" @click="download" :title="`点击下载文件:${file['name']}`">
        <a ref="downDom" v-show="false" :href="path" :download="path">点击下载</a>
        <img src="../../assets/img/file.png" alt="">
        <div class="name_size">
            <div class="name">{{ file['name'] }}</div>
            <div class="size">{{ file['size'] }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
let props = defineProps(["file", "download", "path"])
let downDom = ref()
// 点击下载
function download() {
    downDom.value.click()
}
</script>

<style lang="less" scoped>
.file {
    display: flex;
    padding: 5px;
    border: 1px solid #ccc;
    position: relative;
    width: fit-content;
    cursor: pointer;
    margin: 10px 0px 0px 0px;

    img {
        height: 40px;
        width: 40px;
        border-radius: 5px;
    }

    .name_size {
        height: 40px;

        .name {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
        }

        .size {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #ccc;
        }
    }
}
</style>