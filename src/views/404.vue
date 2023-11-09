<template>
    <div class="nopage">
        <div ref="lottieBox" class="lottie"></div>
        <div class="tip">
            哦豁，页面找不到了
        </div>
        <div class="back" @click="backHome">
            返回首页
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import lottie from "lottie-web"; //引入动效库
import nopage from "../assets/json/404.json"
import { useRouter, useRoute } from "vue-router"
const lottieBox = ref()
const router = useRouter()
onMounted(() => {
    lottie.loadAnimation({
        container: lottieBox.value, //选择渲染dom
        renderer: "svg", //渲染格式
        loop: true, //循环播放
        autoplay: true, //是否i自动播放,
        animationData: nopage, //渲染动效json
    });
})


// 回到首页
function backHome() {
    router.push({
        path: "/"
    })
}
</script>

<style lang="less" scoped>
.nopage {
    height: 100%;
    width: 100%;
    background-color: white;

    .lottie {
        height: 70%;
        width: 70%;
        margin: 0 auto;
    }

    .tip {
        font-size: 28px;
        text-align: center;
        font-family: "黑体";
        color: #0f6fec;
    }

    .back {
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin: 0 auto;
        background-color: #0f6fec;
        color: white;
        margin-top: 20px;
        border-radius: 10px;
        cursor: pointer;
    }
}
</style>