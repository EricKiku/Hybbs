<template>
    <div ref="scrollBarDom" class="posts scrollbar" @scroll="setScrollbar">
        <PushPost></PushPost>
        <Post v-for="(post) in posts.slice((currentPage - 1) * count, currentPage * count)" :key="post['p_id']"
            :post="post">
        </Post>
        <Paging :total="total" :count="count" @changePage="changeCurrentPage"></Paging>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onActivated, onDeactivated, nextTick } from "vue"
import { getPost } from "../../api/postAPI"
import { storeOfPost } from "../../store/post"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { storeOfApi } from "../../store/api"
import { useStore } from "../../store/store"
import { ToPostDetails, goToOtherUser } from "../../tools/tools"
import { getCurrentDate } from "../../tools/date"
import { useRouter, onBeforeRouteLeave } from "vue-router"
import PushPost from "../PushPost.vue"
import Post from "../Post.vue"
import Paging from "../UI/Paging.vue"
const postStore = storeOfPost()
const zoneStore = storeOfZone()
const userStore = storeOfUser()
const apiStore = storeOfApi()
const store = useStore()
const router = useRouter()
// 加载状态
let loadingStatus = ref(false);
// hot post >>
let hot_posts = ref([])
// 所有帖子
let posts = ref<any>([])
// 记录目前的scrollTop
let scrollBarDom = ref()
onMounted(async () => {
    refreshPost()
})
// 刷新帖子方法
function refreshPost() {
    // 加载状态
    loadingStatus.value = true
    getPost().then(res => {
        // 把数据存到store中，是所有帖子
        postStore.setPosts(res.data.reverse())
        // 存到当前所有帖子
        posts.value = res.data
        total.value = posts.value.length
    }).finally(() => {
        loadingStatus.value = false
    })
}
// hot post <<


// 设置滚动位置方法
function setScrollbar() {
    store.setPostScrollTop(scrollBarDom.value.scrollTop)
}
// 返回此页面后，继续到上次滚动位置
onActivated(async () => {
    await nextTick()
    // 设置之前的滚动位置
    scrollBarDom.value.scrollTop = store.getPostScrollTop()
})


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
.posts {
    // width: 600px;
    box-sizing: border-box;
    padding: 0px 15px;
    // display: flex;
    // flex-direction: column;
    height: 100%;
    overflow: auto;
    // 单个post

}




.hot_post {
    height: 470px;
    width: 100%;
    margin-top: 20px;
    border: 1px solid #ccc;
    overflow: auto;
    position: relative;
    background-color: rgba(255, 255, 255, 0.7);

    .refresh {
        height: 20px;
        position: absolute;
        top: 10px;
        right: 10px;

        img {
            cursor: pointer;
        }
    }

    .hot_title {
        padding: 10px;
        font-size: 18px;
        vertical-align: middle;
        border-bottom: 1px dotted #ccc;
    }

    .post_item {
        padding: 10px;
        border-bottom: 0.5px dotted #ccc;
        border-width: 50%;

        .post_item_zone {

            height: 18px;

            img {
                vertical-align: middle;
            }

            span {
                cursor: pointer;

                &:hover {
                    border-bottom: 1px solid #000;
                }
            }

        }

        .post_item_title {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 18px;

            >div {
                color: #5865F2;
                width: 80%;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;

                >span {
                    cursor: pointer;

                    &:hover {
                        border-bottom: 1px solid @Theme;
                    }
                }


            }
        }

        .post_item_comment {
            color: rgb(189, 48, 48);
            font-size: 12px;
            cursor: default !important;
        }

        .post_item_content {
            line-height: 20px;
            color: rgb(42, 42, 42);
            font-size: 14px;
            cursor: default;
        }

        .post_item_info {
            font-size: 14px;
            color: #b4b4b4;
            // 开启flex
            display: flex;

            img {
                margin-top: 1px;
            }
        }

        .post_item_user {
            .post_user {
                cursor: pointer;
                line-height: 18px;

                &:hover {
                    border-bottom: 1px solid #b4b4b4;
                }
            }

        }

        .post_item_date {
            margin-left: 10px;

            >span {
                line-height: 18px;
            }
        }
    }
}
</style>