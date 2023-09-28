<template>
    <!-- <div v-if="user" @mousedown="elementRemove" id="box" class="otherUser"> -->
    <div v-if="user || userInfoVisual" id="box" class="otherUser" :class="{ moreStyle: moreStyle }">
        <div id="title" class="title">
            用户信息
            <div class="close" @click="$emit('close')"></div>
        </div>
        <div class="main" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
            <div class="userMsg">
                <img src="../../assets/img/preview_user.png" alt="">
                <div class="value">
                    <div class="uNick">
                        <div :title="user['u_nick']">{{ user['u_nick'] }}</div>
                        <!-- 通过判断store中有没有 ，没有就是添加好友，有就是取消好友 -->
                        <img v-show="userStore.get('u_attention').indexOf(user['u_id']) == -1"
                            @click="attentionUser(user['u_id'])" class="addFriend" src="../../assets/img/addFriend.png"
                            title="加好友">
                        <img v-show="userStore.get('u_attention').indexOf(user['u_id']) != -1"
                            @click="calcelAttentionUser(user['u_id'])" class="addFriend"
                            src="../../assets/img/noattention.png" title="取消关注">
                    </div>
                    <div class="fensi">
                        <span>粉丝数：<span>{{ user['u_fensi'] }}</span></span>
                    </div>
                    <div class="lv">
                        <span>等级:<span>{{ user['u_lv'] }}</span></span>
                    </div>
                </div>
            </div>
            <div class="moreMsg">
                <span>TA的分区:<span>{{ zoneCount }}</span></span>
                <span>TA的帖子:<span>{{ postCount }}</span></span>
            </div>
            <div class="moreBtn">
                <span v-show="!moreStyle" @click="switchMoreStyle(true)"> 更多信息></span>
                <span v-show="moreStyle" @click="switchMoreStyle(false)"> {{ '<' }}简略信息</span>
            </div>

            <div class="zoneAndPost" v-show="moreStyle">
                <div class="zone scrollbar">
                    <div class="zone_attention scrollbar">
                        <!-- vfor store中的关注列表 -->
                        <div @click="ToZoneDetails2Fun(zone, false)" class="zone_item" v-for="(zone, index) in zones"
                            :key="zone['z_id']">
                            <div class="img">
                                <img :src="'src/zoneIcon/' + zone['z_id'] + '.jpg'" :alt="zone['z_name']"
                                    :title="zone['z_name']">
                            </div>
                            <div class="message">
                                <div :title="zone['z_name']">{{ zone['z_name'] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post scrollbar">
                    <div class="post_item" v-for="(post, index) in posts" :key="post['p_id']">
                        <div class="post_zone">
                            <img src="../../assets/img/zone.png">
                            <span @click="ToZoneDetails2Fun(post, false)">{{ post['z_name'] }}</span>
                        </div>
                        <div class="post_title" :title="post['p_title']">
                            <span @click="ToZoneDetails2Fun(post, post)">{{ post['p_title'] }}</span>
                        </div>
                        <div class="post_content" :title="post['p_content']">{{ post['p_content'] }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from "vue"
import { getUserByUId, attentionUserApi, cancelAttentionUserApi, getUserZoneAndReplyCountApi } from "../../api/userAPI"
import { getZoneByZIdApi, getZoneByLordApi } from "../../api/zoneAPI"
import { getPostByPlzApi } from "../../api/postAPI"
import { storeOfUser } from "../../store/user"
import MyReply from "../userInfo/MyPosts.vue"
import { ToZoneDetails2, ToPostDetails } from "../../tools/tools"
const props = defineProps(['coord', 'uid'])
const userStore = storeOfUser()
let coord = ref({ x: props.coord.x, y: props.coord.y })
let emits = defineEmits(['refreshPost', 'close'])
// 加载状态
let loadingStatus = ref(false)
// 弹出框拖动方法
function elementRemove(e) {

    // 获取元素
    // let title = <any>document.getElementById("title")
    let box = <any>document.getElementById("box")

    let dragFlag = false;
    let x, y;

    box.onmousedown = function (e) {
        dragFlag = true;
        e = e || window.event;
        // 获取鼠标在元素上的位置（鼠标按下时在元素上得位置）
        x = e.clientX - box.offsetLeft;
        y = e.clientY - box.offsetTop;

    };

    box.onmousemove = function (e) {
        if (dragFlag) {
            e = e || window.event;
            box.style.left = e.clientX - x + "px";
            box.style.top = e.clientY - y + "px";
        }
    };
    // 鼠标抬起事件
    box.onmouseup = function (e) {
        dragFlag = false;
    }
}
watchEffect(() => {
    getUser(props.uid)
})
// 弹出框显示属性
let userInfoVisual = ref(false)
// 用户对象
let user = ref()
// 分区和回复数
let zoneCount = ref(0)
let postCount = ref(0)
// 用户的分区
let zones = ref([])
// 用户的帖子
let posts = ref([])
// 获取用户信息
function getUser(uid) {
    // 进入加载状态
    loadingStatus.value = true
    // 发送请求
    getUserByUId(uid).then(res => {
        if (res.status == 200) {
            console.log(res.data);
            user.value = res.data
        }
    }).finally(() => {
        loadingStatus.value = false
    })
    // 发送请求获取分区和帖子数
    getUserZoneAndReplyCountApi(uid).then(res => {
        console.log("zoneandreply", res.data);
        zoneCount.value = res.data.zone
        postCount.value = res.data.post
    }).finally(() => {
        loadingStatus.value = false
    })

    // 获取用户的分区和帖子
    getZoneByLordApi(uid).then(res => {
        console.log(res.data);
        if (res.status == 200) {
            zones.value = res.data
        }
    }).finally(() => {
        loadingStatus.value = false
    })

    // 获取帖子
    getPostByPlzApi(uid).then(res => {
        console.log(res.data);
        posts.value = res.data.reverse()
    })
}


// 关注方法
function attentionUser(u_id) {

    // 维持弹出框显示
    userInfoVisual.value = true
    // 进入加载状态
    loadingStatus.value = true
    // 获取当前用户id
    let op_u_id = userStore.get('u_id')

    // 发送请求
    attentionUserApi(op_u_id, u_id).then(res => {
        console.log(res);

        if (res.status == 200) {
            // 重新获取 当前用户和 关注用户信息
            refreshUser(op_u_id, u_id)
        }
    })
}
// 取消关注方法
function calcelAttentionUser(u_id) {
    // 维持弹出框显示
    userInfoVisual.value = true
    // 进入加载状态
    loadingStatus.value = true
    // 获取当前用户id
    let op_u_id = userStore.get('u_id')
    // 关注列表
    console.log(u_id);
    let attention = userStore.get("u_attention")
    let tempArr = attention.split(",")
    let res = <any>[]
    for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] != u_id) {
            res.push(tempArr[i])
        }
    }
    console.log(res.join(","));
    cancelAttentionUserApi(op_u_id, u_id, res.join(",")).then(res => {
        if (res.status == 200) {
            // 重新获取 当前用户和 关注用户信息
            refreshUser(op_u_id, u_id)
        }
    })

}


// 刷新用户信息方法
function refreshUser(op_u_id, u_id) {
    getUserByUId(op_u_id).then(res1 => {
        userStore.setCurrentUser(res1.data)
        if (res1.status == 200) {
            getUserByUId(u_id).then(res2 => {
                if (res2.status == 200) {
                    user.value = res2.data
                }
            }).finally(() => {
                loadingStatus.value = false
            })
        }
    }).finally(() => {
        loadingStatus.value = false
    })

    // 获取回复和分区
    // 发送请求获取分区和回复数
    getUserZoneAndReplyCountApi(u_id).then(res => {
        console.log(res.data);
    }).finally(() => {
        loadingStatus.value = false
    })
}


// 是否打开更多信息样式
let moreStyle = ref(false)
// 打开
function switchMoreStyle(boolean) {
    moreStyle.value = boolean
}


// 跳转到分区或提帖子方法
function ToZoneDetails2Fun(zone, post) {
    ToZoneDetails2(zone)
    if (post) {
        emits('refreshPost', post)
    } else {
        emits('refreshPost')
    }
}

// 关闭
function closeFun() {
    console.log("close");

    emits("close")
}
</script>

<style lang="less" scoped>
.moreStyle {
    height: 400px !important;
    width: 600px !important;
}

.otherUser {
    height: 200px;
    width: 300px;
    background-color: white;
    // border: 1px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-direction: column;
    user-select: none;
    transition: all 0.2s;
    border-radius: 10px;
    box-shadow:
        0px 0px 10px rgba(0, 0, 0, 0.11),
        0px 0px 80px rgba(0, 0, 0, 0.22);

    .title {
        height: 25px;
        line-height: 25px;
        color: white;
        text-align: center;
        cursor: default;
        user-select: none;
        background-color: #817ff6;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        .close {
            float: right;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            background-color: red;
            margin-top: 5px;
            margin-right: 5px;
            cursor: pointer;
        }
    }

    .main {
        flex: 1;
        background-image: url("../../assets/img/preview_bg.jpg");
        /* 背景图垂直、水平均居中 */
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .userMsg {
            // height: 100px;
            padding: 10px;
            // backdrop-filter: blur(9px);
            display: flex;

            >img {
                border: 1px solid #5865f5;
                border-radius: 5px;
                height: 80px;
                width: 80px;
                vertical-align: middle;
            }

            .value {
                flex: 1;

                .uNick {
                    height: 20px;
                    line-height: 20px;
                    margin-left: 10px;
                    display: flex;

                    div {
                        cursor: default;
                        color: #5865f5;
                        font-size: 20px;
                        background-color: rgba(255, 2552, 255, .5);
                        padding-left: 5px;
                        padding-right: 5px;
                        border-radius: 5px;
                        max-width: 100px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: 16px;
                    }

                    .addFriend {
                        height: 18px;
                        width: 20px;
                        // border: 1px solid #817ff6;
                        cursor: pointer;
                        margin-left: 10px;
                        font-size: 10px;

                        &:hover {
                            // border: 1px solid #4d4b92;
                        }
                    }


                }

                .fensi {
                    height: 20px;
                    margin-top: 10px;
                    padding-left: 10px;

                    >span {
                        >span {
                            color: #ff1ee8;
                        }
                    }
                }

                .lv {
                    height: 20px;
                    margin-top: 10px;
                    padding-left: 10px;

                    >span {
                        >span {
                            color: red;
                        }
                    }
                }
            }
        }

        .moreMsg {
            height: 30px;
            line-height: 30px;
            margin-top: 10px;

            >span {
                >span {
                    color: red;
                }
            }

            >span:nth-child(1) {
                margin-right: 20px;
            }

            >span:last-child {
                >span {
                    color: rgb(66, 130, 108);
                }
            }
        }

        .moreBtn {
            height: 20px;
            line-height: 20px;
            margin-top: 5px;
            text-align: right;
            padding-right: 20px;
            position: fixed;
            bottom: 20px;
            right: 20px;

            >span {
                cursor: pointer;
                color: #5865f5;

                &:hover {
                    border-bottom: 1px solid #5865f5;
                }
            }
        }

        .zoneAndPost {
            height: 220px;
            display: flex;

            .zone {
                flex: 1;
                overflow: auto;

                .zone_attention {
                    display: flex;
                    // height: 100%;
                    flex-wrap: wrap;
                    padding: 10px;
                    // border: 1px dotted #ccc;
                    overflow: auto;
                    animation: heightTransition 0.3s;

                    @keyframes heightTransition {
                        0% {
                            height: 0px;
                        }

                        100% {
                            height: 100%;
                        }
                    }

                    .zone_item {
                        height: 80px;
                        width: 80px;
                        cursor: pointer;
                        padding: 5px;
                        padding-bottom: 0px;
                        border-radius: 7px;

                        &:hover {
                            box-shadow:
                                0px 0px 10px rgba(18, 82, 202, 0.671),
                                0px 0px 80px rgba(0, 0, 0, 0.18);
                        }

                        .img {
                            text-align: center;

                            img {
                                height: 40px;
                                width: 40px;
                                border-radius: 5px;
                                border: 1px solid #ccc;
                                padding: 5px;
                            }
                        }


                        .message {
                            >div {
                                text-align: center;
                                margin: 0 auto;
                                width: 52px;
                                font-size: 14px;
                                /* 强制不换行 */
                                white-space: nowrap;
                                /* 文字用省略号代替超出的部分 */
                                text-overflow: ellipsis;
                                /* 匀速溢出内容，隐藏 */
                                overflow: hidden;
                            }


                        }
                    }
                }
            }

            .post {
                flex: 1;
                overflow: auto;

                .post_item:first-child {
                    border-top: 1px dotted #5865f5;
                }

                .post_item {
                    border-bottom: 1px dotted #5865f5;
                    margin-bottom: 5px;

                    // padding-left: 10px;
                    .post_zone {
                        cursor: pointer;

                        >img {
                            vertical-align: middle;
                        }

                        >span {
                            font-size: 16px;
                        }
                    }

                    .post_title,
                    .post_content {
                        padding-left: 10px;
                        width: 270px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        color: rgb(70, 70, 70);
                        font-size: 12px;
                    }

                    .post_title {
                        color: #5865f5;
                        height: 20px;
                        line-height: 20px;
                        cursor: pointer;
                        font-size: 14px;

                        >span {
                            &:hover {
                                border-bottom: 1px solid #5865f5;
                            }
                        }

                    }
                }

            }
        }
    }
}
</style>