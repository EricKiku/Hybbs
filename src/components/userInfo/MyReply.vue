<template>
    <div class="myReply scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
        我的回复
        <div @click="ToPostDetails(reply['z_id'], reply)" class="replyItem" v-for="(reply) in myReply" :key="reply['r_id']">
            <div class="content">
                <span :title="reply['r_content']">{{ reply['r_content'] }}</span>
            </div>
            <div class="zone_post">
                [<span class="zoneName" :title="reply['z_name']">{{ reply['z_name'] }}</span>]
                <span class="pTitle" :title="reply['p_title']">{{ reply['p_title'] }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getReplyByUIdApi } from "../../api/replyAPI"
import { storeOfUser } from "../../store/user"
import { ToPostDetails } from "../../tools/tools"
const userStore = storeOfUser()
onMounted(() => {
    getMyReply()
})

// 加载状态
let loadingStatus = ref(false)


// 获取 我的回复
let myReply = ref([])
function getMyReply() {
    // 进入加载状态
    loadingStatus.value = true
    let u_id = userStore.get("u_id")
    getReplyByUIdApi(u_id).then(res => {
        myReply.value = res.data.reverse()
        console.log(res.data);
    }).finally(() => { loadingStatus.value = false })


}
</script>

<style lang="less" scoped>
.myReply {
    flex: 1;
    height: 220px;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 5px;
    border-left: 1px solid #5856f5;
    overflow: auto;

    .replyItem {
        // padding: 5px;
        background-color: rgba(255, 255, 255, .6);
        margin: 5px;
        border-radius: 5px;
        padding: 5px;
        padding-right: 0px;
        border: 0.5px solid #ccc;
        cursor: pointer;

        &:hover {
            background-color: rgba(228, 228, 228, 0.6);
        }

        box-shadow: 0px 0px 5.3px rgba(0, 0, 0, 0.016),
        0px 0px 17.9px rgba(0, 0, 0, 0.024),
        0px 0px 80px rgba(0, 0, 0, 0.04);

        .content {
            width: 360px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: default;
        }

        .zone_post {
            margin-top: 5px;
        }

        .zoneName {
            max-width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #5e5cbd;
        }

        .pTitle {
            color: #5865f5;
            max-width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

    }

}
</style>