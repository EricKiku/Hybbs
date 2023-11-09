<template>
    <div class="zone">
        <ZoneInfoVue v-if="zone" :zone="zone"></ZoneInfoVue>
        <div ref="scrollBarDom" class="posts scrollbar" v-if="posts.length != 0">
            <Post v-for="(post) in posts.slice((currentPage - 1) * count, currentPage * count)" :key="post['p_id']"
                :post="post" :z-name="zone['z_name']"></Post>
            <Paging :total="total" :count="count" @change-page="changeCurrentPage"></Paging>
        </div>
        <ZoneList></ZoneList>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getZoneByZIdApi, getPostByZoneId } from "../api/zoneAPI.js"
import ZoneInfoVue from "../components/zone/ZoneInfo.vue";
import ZoneList from "../components/ZoneList.vue"
import Post from "../components/Post.vue";
import Paging from "../components/UI/Paging.vue";
const route = useRoute()
const router = useRouter()

// 分区对象
let zone = ref()
onMounted(() => {
    if (!route.query.zId) {
        router.go(-1);
    } else {
        getZone()
    }
})
// 监听route.query.zId变化
watchEffect(() => {
    if (!route.query.zId && zone.value) {
        router.go(-1);
    } else {
        getZone()
    }
})
// 获取分区数据
function getZone() {
    getZoneByZIdApi(route.query.zId).then(res => {
        console.log(res);
        if (res.status == 200) {
            zone.value = res.data
            // 获取帖子
            getPosts()
        } else {
            zone.value = null
            router.go(-1);
        }
    })
}
// 分区的帖子
let posts = ref([])
// 获取该分区的帖子
function getPosts() {
    getPostByZoneId(zone.value['z_id']).then(res => {
        if (res.status == 200) {
            posts.value = res.data
            // 总数给分页total
            total.value = posts.value.length
        } else {
            posts.value = []
        }
    })
}

// 滚动父元素对象
let scrollBarDom = ref()
// 分页数据
let currentPage = ref(1)
// 每页多少条
let count = ref(10)
// 总共多少条
let total = ref(0)
// 分页切换方法
function changeCurrentPage(value) {
    currentPage.value = value
    // 每次切换回到顶端
    scrollBarDom.value.scrollTop = 0

}
</script>

<style lang="less" scoped>
.zone {
    // width: 1140px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding-top: 75px;
    background-image: url("../assets/img/postsbg.jpg");
    /* 背景图垂直、水平均居中 */
    background-position: center center;
    /* 背景图不平铺 */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;
    /* 设置背景颜色，背景图加载过程中会显示背景色 */
    background-color: white;

    .posts {
        width: 600px;
        margin: 0px 20px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        padding: 10px;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
    }
}
</style>