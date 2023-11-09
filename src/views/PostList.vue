<template>
    <!-- 废弃 -->
    <!-- 发帖对话框 -->
    <div class="dialog" v-if="dialogVisual">
        <div @click="closeDialog()" class="close"></div>
        <div class="title"><b>发帖<span style="color: #868686;">(分区:{{ zoneStore.currentPreviewZone['z_name']
        }})</span></b></div>
        <CreatePost @submit="closeDialog()" :picture="havePicture" :zone-name="zoneStore.currentPreviewZone['z_name']" />
    </div>
    <div class="list scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
        <div class="postItem" v-for="(item) in posts" :key="item['p_id']">
            <div class="title">
                <div class="postTop" v-show="item['p_top'] == 1">
                    <i>置顶</i>
                </div>
                <span @click="showPostDetail(item)">{{ item['p_title'] }}</span>
            </div>
            <div class="content" :title="item['p_content']">
                <div>{{ item['p_content'] }}</div>
            </div>
            <div class="user">
                <div class="user_item" style="display: flex;">
                    <img src="../assets/img/user_post.png">
                    <span @click="goToOtherUser(item['p_lz'])" title="楼主">{{ item['u_nick'] }}</span>
                </div>
                <div class="user_item" style="display: flex;">
                    <img src="../assets/img/lastreply.png">
                    <span @click="goToOtherUser(item['last_u_id'])" title="最后回复">{{ item['last_u_name']
                    }}</span>
                </div>
                <div class="user_item replyCount" style="display: flex;" title="回复数">
                    <img src="../assets/img/replyCount.png">
                    <span>{{ item['p_reply'] }}</span>
                </div>
                <div style="flex: 1;display: flex;justify-content: right;">
                    <div class="user_item date" style="display: flex;">
                        <img src="../assets/img/createdate.png">
                        <span style="border-bottom: none;" title="创建时间">{{ item['p_date'] }}</span>
                    </div>
                    <div class="user_item date" style="display: flex;">
                        <img src="../assets/img/replydate.png">
                        <span style="border-bottom: none;" title="最后回复时间">{{ item['last_reply_date'] }}</span>
                    </div>
                </div>

            </div>

            <div class="floor">

            </div>
        </div>
    </div>
    <div class="createPost" :class="{ openExtend: extendOpen }">
        <img @click.stop="shiftExtend()" src="../assets/img/createpost.png" title="写一个帖子">
        <div class="extend" v-if="extendOpen">
            <div class="extend_item" @click="openDialog('text')">
                <img src="../assets/img/selectText.png" alt=""><br>
                <span>文字</span>
            </div>
            <div class="extend_item" @click="openDialog('picture')">
                <img src="../assets/img/selectpicture.png" alt=""><br>
                <span>图文</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRaw } from "vue"
import { useRoute, useRouter } from "vue-router"
import { storeOfZone } from "../store/zone";
import { storeOfUser } from "../store/user"
import { getPostByZoneId, updateZoneFollowApi, getZoneByZIdApi, updateZoneIconApi } from "../api/zoneAPI"
import { setAttentionZone, getAttentionZone } from "../api/userAPI"
import { ElMessage } from 'element-plus'
import { goToOtherUser, handleTopPost } from "../tools/tools"
import { storeOfApi } from "../store/api"
const route = useRoute()
const router = useRouter()
const zoneStore = storeOfZone()
const userStore = storeOfUser()
const apiStore = storeOfApi()
// 消息提示
function message(type, value) {
    ElMessage({
        message: value,
        type: type == 1 ? 'success' : 'warning',
    })
}
// 该分区的所有帖子
let posts = ref<any>([])
// 加载状态
let loadingStatus = ref(false)
onMounted(() => {
    // 如果store中的currentZone没有数据，先去localStorage中取，如果没有则跳到主页
    if (!zoneStore.currentPreviewZone.z_id) {
        // 从local拿到zone，直接设置到currentZone
        let zone = JSON.parse(<string>localStorage.getItem("currentZone"))
        zoneStore.setCurrentPreviewZone(zone)
        // 获取该分区的所有帖子
        getPost(false)
    } else {
        // 把 zone 存到localStorage
        localStorage.setItem("currentZone", JSON.stringify(zoneStore.getCurrentPriviewZone()))
        // 进来就去获取该分区的所有帖子
        getPost(false)
    }
})
// 获取分区帖子的方法
function getPost(post) {
    // 进入加载状态
    loadingStatus.value = true
    getPostByZoneId(zoneStore.currentPreviewZone['z_id']).then(res => {
        if (res.status == 200) {
            if (res.data) {
                posts.value = res.data.reverse()
                // 过一遍置顶处理方法
                posts.value = handleTopPost(posts.value)
            } else {
                posts.value = []
            }

        }
    }).finally(() => { loadingStatus.value = false })
}


// 跳转到帖子
function showPostDetail(post) {
    router.push({
        name: "post",
        query: {
            post: JSON.stringify(post)
        }
    })
}


// 扩展是否打开
let extendOpen = ref(false)
// 扩展动效宽度
let extendWidth = ref(0)
// 切换扩展打开状态
function shiftExtend() {
    extendOpen.value = !extendOpen.value
}



// 对话框显示
let dialogVisual = ref(false)
// 是否是图文
let havePicture = ref(false)
// 打开对话框方法
function openDialog(value) {
    if (value == 'picture') {
        havePicture.value = true
    } else {
        havePicture.value = false
    }
    dialogVisual.value = true
    zoneStore.setCreatePostDia(dialogVisual.value)
}
// 关闭对话框方法
function closeDialog() {
    dialogVisual.value = false
    zoneStore.setCreatePostDia(dialogVisual.value)
    // 关闭之后再刷新一次帖子列表
    getPost(false)
}
</script>

<style lang="less" scoped>
.list {
    overflow: auto;
    width: 80%;
    height: calc(100% - 42px);
    background-color: white;

    .postItem {
        height: 40px;
        border-bottom: 1px dotted #e4e6eb;
        padding: 20px;

        &:hover {
            background-color: #f3f4f7;
        }

        .title {
            font-size: 18px;
            color: #5865F2;
            height: 20px;
            // line-height: 30px;
            display: flex;

            .postTop {
                font-size: 14px;
                height: 20px;
                line-height: 10px;
                box-sizing: border-box;
                padding: 5px;
                background-color: #5865F2;
                color: white;
                border-radius: 5px;
                margin-right: 5px;
                font-weight: bold;
            }

            >span {
                cursor: pointer;
                line-height: 20px;

                &:hover {
                    border-bottom: 1px solid #5865F2;
                }
            }
        }

        .content {
            font-size: 14px;
            height: 20px;
            line-height: 20px;

            >div {
                width: 600px;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
            }
        }

        .user {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #b3b3b3;
            display: flex;

            .user_item {
                padding-right: 10px;
            }

            img {
                height: 12px;
                width: 12px;
                margin-top: 4px;
            }

            span {
                cursor: pointer;

                &:hover {
                    border-bottom: 0.5px solid #ccc;
                }
            }

            .date {
                width: 140px;
                color: #b3b3b3;
            }

            .replyCount {
                cursor: default;
                color: rgb(189, 48, 48);

                >span {
                    cursor: default;
                }
            }
        }
    }
}

.dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 2;

    .close {
        height: 20px;
        width: 20px;
        background-color: rgb(253, 60, 60);
        border-radius: 50%;
        position: absolute;
        top: 3%;
        left: calc(97% - 26px);
        cursor: pointer;
        text-align: center;
        vertical-align: middle;

        &:hover {
            background-color: red;
        }
    }

    .title {
        position: absolute;
        left: 30px;
        top: 20px;
    }

    .public {}
}

.openExtend {
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

.createPost {
    width: 50px;
    height: 50px;
    background-color: #967879;
    position: absolute;
    top: 90%;
    left: 80%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all .3s;
    box-shadow:
        0px 0px 5.3px rgba(0, 0, 0, 0.101),
        0px 0px 17.9px rgba(0, 0, 0, 0.149),
        0px 0px 80px rgba(0, 0, 0, 0.25);

    &:hover {
        box-shadow:
            0px 0px 1.6px rgba(88, 101, 242, 0.06),
            0px 0px 3.6px rgba(88, 101, 242, 0.087),
            0px 0px 6.3px rgba(88, 101, 242, 0.107),
            0px 0px 10px rgba(88, 101, 242, 0.125),
            0px 0px 15.5px rgba(88, 101, 242, 0.143),
            0px 0px 24.1px rgba(88, 101, 242, 0.163),
            0px 0px 40px rgba(88, 101, 242, 0.3),
            0px 0px 80px rgba(88, 101, 242, 0.4);
    }

    .extend {
        width: 100px;
        height: 50px;
        background-color: rgba(255, 255, 255, .3);
        display: flex;
        position: absolute;
        left: -100px;
        transition: all 0.3s;
        box-shadow:
            0px 0px 5.3px rgba(0, 0, 0, 0.101),
            0px 0px 17.9px rgba(0, 0, 0, 0.149),
            0px 0px 80px rgba(0, 0, 0, 0.25);

        >div {
            flex: 1;
        }

        -webkit-animation: scale-in-hor-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: scale-in-hor-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

        @-webkit-keyframes scale-in-hor-right {
            0% {
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }

            100% {
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }
        }

        @keyframes scale-in-hor-right {
            0% {
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }

            100% {
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }
        }

        .extend_item {
            font-size: 12px;
            padding-top: 5px;
            cursor: pointer;

            &:hover {
                background-color: #ccc;
            }
        }
    }
}</style>