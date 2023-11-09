<template>
    <div class="hppost">
        <div class="loading" v-show="posts.length == 0">

        </div>
        <div class="list" v-if="posts.length != 0">
            <Post v-for="(post) in posts.slice((currentPage - 1) * count, currentPage * count)" :key="post['p_id']"
                :post="post">
            </Post>
            <Paging :total="total" :count="count" @change-page="changeCurrentPage"></Paging>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getPostByPlzApi } from "../../api/postAPI"
import Paging from "../../components/UI//Paging.vue"
import Post from "../../components/Post.vue";
const route = useRoute()
const router = useRouter()
onMounted(() => {
    if (!route.query.uid) {
        router.go(-1)
    }
    // 去获取该用户的帖子
    personPosts()
})
// 用户帖子列表
let posts = ref([])
// 获取用户帖子方法
function personPosts() {
    getPostByPlzApi(route.query.uid).then(res => {
        console.log("hpPosts:", res.data.reverse());
        if (res.status == 200) {
            posts.value = res.data
            // 设置分页总数
            total.value = posts.value.length
        } else {
            posts.value = []
        }
    })
}

// 分页数据
let total = ref(0)
let count = ref(10)
let currentPage = ref(1)
// 切换页数方法
function changeCurrentPage(value) {
    currentPage.value = value
}
</script>

<style lang="less" scoped>
.hppost {
    width: 100%;
    // height: 500px;
    // background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-sizing: border-box;
}
</style>