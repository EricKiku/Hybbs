<template>
    <div class="postDet scrollbar">
        <div class="title">
            <div class="back" @click="goBack" @mouseenter="backMouseHover = true" @mouseleave="backMouseHover = false">
                <img :src="backMouseHover ? '/src/assets/img/back-active.png' : '/src/assets/img/back.png'" alt="">
            </div>
            <div class="text">
                帖子详情
            </div>
        </div>

        <div class="post" v-if="post">
            <div class="user">
                <img :src="apiStore.getBaseUrl() + apiStore.getPort() + post['u_avatar']" alt="">
                <div class="nick">{{ post['u_nick'] }}</div>
            </div>
            <div class="title">{{ post['p_title'] }}</div>
            <div class="content">{{ post['p_content'] }}</div>
            <div class="video" v-if="post['p_filetype'] == 'v'">
                <div class="item" v-for="(video, index) in post['p_picture'].split('?')" :key="index">
                    <video height="300" v-if="video" controls>
                        <source :src="apiStore.getBaseUrl() + apiStore.getPort() + video">
                    </video>
                </div>
            </div>
            <div class="picture" v-if="post['p_filetype'] == 'p'">
                <div class="item" v-for="(pic, index) in post['p_picture'].split('?')" :key="index">
                    <img v-if="pic" :src="apiStore.getBaseUrl() + apiStore.getPort() + pic" alt="">
                </div>
            </div>
            <!-- 有可能是文件 -->
            <div class="file" v-if="post['p_filetype'] == 'f'">
                <!-- 以后再对文件处理 -->
            </div>
            <div class="p_bottom">
                <div class="bt_item">
                    <img src="/src/assets/img/pinglun.png" alt="">
                    评论(<span>{{ post['p_reply'] }}</span>)
                </div>
                <div class="dot"></div>
                <div class="bt_item">
                    <img src="/src/assets/img/postzone.png" alt="">
                    <span class="zone">{{ post['z_name'] }}</span>
                </div>
            </div>
        </div>
        <div class="hr"></div>
        <!-- 回复 -->
        <div class="reply">
            <div class="title">回复</div>
            <div class="replyLoad" v-show="getReplyLoad">
                正在加载回复...
            </div>
            <div class="replylist" v-if="!getReplyLoad && replys.length != 0">
                <div class="replyItem" v-for="(reply) in replys" :key="reply['r_id']">
                    <img :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['u_avatar']" alt="">
                    <div>
                        <div class="user">
                            <div class="nick" :style="{ color: reply['color'] }">{{ reply['u_nick'] }}</div>
                            <div>
                                <!-- 此位置或许会增加一些东西 -->
                            </div>
                            <div class="date">{{ reply['r_date'] }}</div>
                        </div>
                        <div class="content" :style="{ color: reply['chat_color'] }">
                            <span>{{ reply['r_content'] }}</span>
                        </div>
                        <div class="replytoreply" v-if="reply['lowerReply'].length != 0">
                            <div class="remainingReply" @click="toReplyDetail(reply['r_id'])">
                                <span :style="{ color: reply['chat_color'] }">{{ reply['lowerReply'].length }}</span>个回复
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, onUnmounted, onDeactivated, onActivated } from "vue"
import { useRouter, useRoute } from "vue-router"
import { storeOfApi } from "../store/api"
import { getPostByPidApi } from "../api/postAPI"
import { getReplyByPIdApi } from "../api/replyAPI"
import { replyHandle } from "../tools/tools"
const router = useRouter()
const route = useRoute()
const apiStore = storeOfApi()
// 返回图标是否被鼠标悬浮
let backMouseHover = ref(false)
// 路由后退
function goBack() {
    // 路由后退
    router.go(-1)
    // 鼠标悬浮因为keepAlive的原因不会重置，所以需要重置
    backMouseHover.value = false
}

// 传送过来的post对象
let post = ref()
onActivated(() => {
    // 如果下次传进来的pid与上次不一致，则先清空posts
    if (post.value) {
        if (route.query.pId == post.value['p_id']) {
            // pid没有变化，则继续之前的缓存
        } else {
            // 有变化，先清空post
            post.value = null
        }
    }
    if (!route.query.pId) {
        router.go(-1)
    } else {
        console.log("传送的pid:", route.query.pId);
        getPostByPidApi(route.query.pId).then(res => {
            if (res.status == 200) {
                post.value = res.data
                //  获取回复
                getReply(post.value['p_id'])
            }
        })
    }
})
// 回复相关
// 获取回复中...
let getReplyLoad = ref(false)
// 回复
let replys = ref<any>([])
// 获取回复方法
function getReply(pid) {
    getReplyLoad.value = true
    getReplyByPIdApi(pid).then(res => {
        if (res.status == 200) {
            // 处理嵌套回复
            replys.value = replyHandle(res.data)
            console.log("处理回复：", replys.value);

        } else {
            replys.value = []
        }
    }).finally(() => {
        getReplyLoad.value = false
    })
}



// 点击查看回复详情
function toReplyDetail(rid) {
    console.log("rid:", rid);

    router.push({
        name: "replyDet",
        query: {
            rid
        }
    })
}
</script>

<style lang="less" scoped>
.postDet {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    max-height: calc(100% - 80px);
    overflow: auto;

    >.title {
        position: relative;
        border-bottom: 0.5px solid #ccc;
        margin-bottom: 5px;

        .back {
            height: 20px;
            width: 30px;
            padding: 5px;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 5px;
            text-align: center;

            &:hover {
                background-color: rgb(227, 227, 227);
            }
        }

        .text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            font-size: 16px;
            font-weight: bold;
        }
    }


    .post {
        .user {
            display: flex;
            padding: 5px 0px;
            height: 40px;

            img {
                height: 40px;
                width: 40px;
                border-radius: 50%;
            }

            .nick {
                line-height: 40px;
                padding-left: 10px;
                font-weight: bold;
                font-family: "黑体";
            }
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            margin: 10px 0px;
        }

        .content {
            margin: 5px 0px;
            font-size: 16px;
            font-family: "黑体";

        }

        .video {
            video {
                margin: 5px 0px;
                border-radius: 5px;
            }
        }

        .picture {
            img {
                margin: 5px 0px;
                height: 300px;
                border-radius: 5px;
            }
        }

        .p_bottom {
            display: flex;
            height: 40px;
            box-sizing: border-box;
            padding: 20px 0px 0px 0px;

            .bt_item {
                height: 20px;
                font-size: 14px;
                line-height: 20px;
                color: #676a79;

                img {
                    height: 15px;
                    width: 15px;
                    vertical-align: middle;
                    margin-top: -2.5px;
                }

                span {
                    font-weight: bold;
                }
            }

            .dot {
                width: 5px;
                height: 5px;
                background-color: #a7a7a8;
                border-radius: 50%;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                margin: 0px 10px;
            }

            .zone {
                margin-left: 5px;
                font-weight: normal !important;
                cursor: pointer;

                &:hover {
                    font-weight: bold !important;
                }
            }
        }
    }

    .hr {
        height: 1px;
        width: 80%;
        margin: 10px auto;
        color: #a1a1a8;
        background-color: currentColor;
        border: 0;
        opacity: 0.25;
    }

    .reply {
        .title {
            margin: 5px 0px;
            font-weight: bold;
            font-size: 16px;
            letter-spacing: 4px;


        }

        .replyLoad {
            color: #676a79;
            font-size: 14px;
            text-align: center;
        }

        .replylist {
            .replyItem {
                padding: 10px 0px;
                display: flex;

                img {
                    height: 30px;
                    width: 30px;
                    border-radius: 50%;
                }

                .user {
                    height: 30px;
                    display: flex;

                    >.nick {
                        line-height: 30px;
                        padding: 0px 5px;
                        font-size: 14px;
                    }

                    .date {
                        line-height: 30px;
                        padding: 0px 5px;
                        font-size: 12px;
                        color: #a7a7a8;
                    }
                }

                .content {
                    font-size: 16px;
                    font-weight: 400;
                    font-family: "黑体";
                    padding: 5px 0px;
                }

                .replytoreply {
                    width: fit-content;
                    font-size: 14px;
                    margin: 10px 0px 0px 0px;
                    background-color: #ebebeb;
                    color: #808080;
                    padding: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s;

                    &:hover {
                        background-color: #dedede;
                    }
                }
            }
        }
    }
}
</style>