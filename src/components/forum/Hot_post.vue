<template>
    <div class="hot_post scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
        <div class="refresh">
            <img @click="refreshPost()" src="../../assets/img/refresh2.png" title="刷新">
        </div>
        <div class="hot_title">
            <img style="vertical-align: middle;" src="../../assets/img/dot.png" alt="">
            热门帖
        </div>
        <div class="post_item" v-for="(item, index) in postStore.hot_posts" :key="index">
            <div class="post_item_zone">
                <img src="../../assets/img/zone.png">
                <span :title="'分区:' + item['z_name']" @click="toZoneDetail(item['z_id'])">{{ item['z_name'] }}</span>
            </div>
            <div class="post_item_title">
                <div>
                    <span @click="ToPostDetails(item['z_id'], item)" :title="'帖子标题:' + item['p_title']">{{ item['p_title']
                    }}</span>
                    <span class="post_item_comment" :title="'帖子回复数:' + item['p_reply']">
                        [{{ item['p_reply'] }}]
                    </span>
                </div>

            </div>

            <div class="post_item_content" :title="'内容:' + item['p_content']">
                {{ item['p_content'] }}
            </div>
            <div style="display: flex;margin-top: 10px;">
                <div class="post_item_user post_item_info">
                    <div style="height: 16px;">
                        <img src="../../assets/img/user.png" alt="">
                    </div>
                    <div><span @click="goToOtherUser(item['u_id'])" class="post_user">{{ item['u_name'] }}</span></div>
                </div>
                <div class="post_item_date post_item_info">
                    <div style="height: 16px;">
                        <img src="../../assets/img/date.png" alt="">
                    </div>
                    <span>{{ item['p_date'] }}</span>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getPost } from "../../api/postAPI"
import { storeOfPost } from "../../store/post"
import { storeOfZone } from "../../store/zone"
import { ToPostDetails, goToOtherUser } from "../../tools/tools"
import { useRouter } from "vue-router"

const postStore = storeOfPost()
const zoneStore = storeOfZone()
const router = useRouter()
// 加载状态
let loadingStatus = ref(false);
// hot post >>
let hot_posts = ref([])
onMounted(() => {
    refreshPost()
})
// 刷新帖子方法
function refreshPost() {
    // 加载状态
    loadingStatus.value = true
    getPost().then(res => {
        // 把数据存到store中，是所有帖子
        postStore.setPosts(res.data.reverse())

    }).finally(() => {
        loadingStatus.value = false
    })
}

// 点击分区名字跳转到分区
function toZoneDetail(z_id) {

    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}
// 点击帖子标题跳转到帖子
function toPostDetails(z_id, obj) {

    let zone = JSON.stringify(JSON.parse(JSON.stringify(obj)))
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails",
            query: {
                zone
            }
        })
    }
}
// hot post <<
</script>

<style lang="less" scoped>
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