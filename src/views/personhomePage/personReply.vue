<template>
    <div class="hpreply">
        <div class="loading" v-show="replys.length == 0">

        </div>
        <div class="list" v-if="replys.length != 0">
            <Reply v-for="(reply) in replys.slice((currentPage - 1) * count, currentPage * count)" :key="reply['r_id']"
                :reply="reply"></Reply>
            <Paging :total="total" :count="count" @change-page="changeCurrentPage"></Paging>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getReplyByUIdApi } from "../../api/replyAPI"
import Reply from "../../components/Reply.vue";
import Paging from "../../components/UI/Paging.vue";
const route = useRoute()
const router = useRouter()
onMounted(() => {
    if (!route.query.uid) {
        router.go(-1)
    } else {
        personReply()
    }
})
// 用户回复列表
let replys = ref([])
// 获取用户的回复
function personReply() {
    getReplyByUIdApi(route.query.uid).then(res => {
        console.log("personReply:", res.data);
        if (res.status == 200) {
            replys.value = res.data.reverse()
            // 分页总数据
            total.value = replys.value.length
        } else {
            replys.value = []
        }
    })
}

// 分页数据
let total = ref(0)
let count = ref(5)
let currentPage = ref(1)
// 切换页数方法
function changeCurrentPage(value) {
    currentPage.value = value
}
</script>

<style lang="less" scoped>
.hpreply {
    width: 100%;
    min-height: 500px;
    // background-color: white;
    border-radius: 10px;
}
</style>