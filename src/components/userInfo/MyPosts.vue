<template>
    <div class="myPosts scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
        <div v-show="props.uId" class="title">TA的帖子</div>
        <div v-show="!props.uId" class="title">我的帖子</div>
        <div class="posts" v-for="(post, index) in myPosts" :key="post['p_id']">
            <div class="z_name">
                <img src="../../assets/img/zone.png" title="分区图标">
                <span @click="TtoZoneDetails(post['z_id'])" :title="post['z_name'] + ':' + post['z_introduce']">{{
                    post['z_name'] }}</span>
            </div>
            <div class="p_title content">
                <span @click="ToPostDetails(post['z_id'], post)" :title="post['p_title']">{{ post['p_title'] }}</span>
            </div>
            <div class="p_content content">
                <span :title="post['p_content']">{{ post['p_content'] }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfPost } from "../../store/post"
import { getPost } from "../../api/postAPI"
import { storeOfUser } from "../../store/user"
import { TtoZoneDetails, ToPostDetails } from "../../tools/tools"
const postStore = storeOfPost()
const userStore = storeOfUser()
let props = defineProps(["uId"])
let loadingStatus = ref(false)
onMounted(() => {
    getMyPosts()
})

// 帖子数组
let myPosts = <any>ref([])
// 获取我的所有帖子
function getMyPosts() {
    loadingStatus.value = true
    // let posts = postStore.getAllPosts()
    let userId
    if (props.uId) {
        userId = props.uId
    } else {
        userId = userStore.get("u_id")
    }
    getPost().then(res => {
        let posts = res.data
        // 循环遍历找到自己的帖子
        for (let i = 0; i < posts.length; i++) {
            if (posts[i]['p_lz'] == userId) {
                myPosts.value.push(posts[i])
            }
        }
    }).finally(() => loadingStatus.value = false)

}
</script>

<style lang="less" scoped>
.myPosts {
    flex: 1;
    height: 220px;
    margin-top: 30px;
    margin-bottom: 30px;
    overflow: auto;

    >.posts:last-child {
        border-bottom: 1px dotted #5865f565;
    }

    .posts {
        border-top: 1px dotted #5865f565;
        padding-top: 5px;
        padding: 5px;


        &:hover {
            background-color: #e8eaff;
        }

        .z_name {
            font-size: 16px;

            img {
                vertical-align: middle;
            }

            span {
                cursor: pointer;

                &:hover {
                    border-bottom: 1px solid #5865f5;
                }
            }
        }

        .content {
            margin-left: 17px;
            max-width: 360px;
            /* 强制不换行 */
            white-space: nowrap;
            /* 文字用省略号代替超出的部分 */
            text-overflow: ellipsis;
            /* 匀速溢出内容，隐藏 */
            overflow: hidden;
        }

        .p_title {
            margin-top: 5px;
            margin-bottom: 5px;
            padding-bottom: 2px;

            >span {
                font-size: 16px;
                color: #5865f5;
                cursor: pointer;

                &:hover {
                    border-bottom: 1px solid #5856f5;
                }
            }
        }

        .p_content {
            font-size: 14px;
            cursor: default;
        }
    }
}
</style>