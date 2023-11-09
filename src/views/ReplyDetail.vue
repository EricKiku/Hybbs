<template>
    <div class="replyDet scrollbar">
        <div class="title">
            <div class="back" @click="goBack" @mouseenter="backMouseHover = true" @mouseleave="backMouseHover = false">
                <img :src="backMouseHover ? '/src/assets/img/back-active.png' : '/src/assets/img/back.png'" alt="">
            </div>
            <div class="text">
                回复详情
            </div>
        </div>

        <div class="reply" v-if="reply">
            <div class="user">
                <img :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['u_avatar']" alt="">
                <div class="nick" :style="{ color: reply['color'] }">{{ reply['u_nick'] }}</div>
                <div class="dot"></div>
                <div class="date">{{ reply['r_date'] }}</div>
            </div>
            <div class="content" :style="{ color: reply['chat_color'] }">{{ reply['r_content'] }}</div>
            <div class="video" v-if="reply['r_pov'] == 'v'">
                <div class="item" v-for="(video, index) in reply['p_picture'].split('?')" :key="index">
                    <video height="300" v-if="video" controls>
                        <source :src="apiStore.getBaseUrl() + apiStore.getPort() + video">
                    </video>
                </div>
            </div>
            <div class="picture" v-if="reply['r_pov'] == 'p'">
                <div class="item" v-for="(pic, index) in reply['r_file'].split('?')" :key="index">
                    <img v-if="pic" :src="apiStore.getBaseUrl() + apiStore.getPort() + pic" alt="">
                </div>
            </div>
            <!-- 有可能是文件 -->
            <div class="file" v-if="reply['p_filetype'] == 'f'">
                <!-- 以后再对文件处理 -->
            </div>
        </div>
        <div class="hr"></div>
        <!-- 回复 -->
        <div class="replytoreply" v-if="replys">
            <div class="title"><span>{{ replys.length }}</span>个回复</div>
            <div class="replylist">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getReplyByRId } from "../api/replyAPI"
import { storeOfApi } from "../store/api"
const route = useRoute()
const router = useRouter()
const apiStore = storeOfApi()
// 回复对象
let reply = ref()
// 该回复的回复
let replys = ref()
onMounted(() => {
    console.log("query:", route.query.rid);
    // 如果rid为空，则返回到postdetails页面
    if (!route.query.rid) {
        router.go(-1)
    } else {
        // 获取回复和回复给该回复的回复
        getReplyByRId(route.query.rid).then(res => {
            if (res.status == 200) {
                console.log(res.data);

                // 回复对象拿取的是返回数据的第一个元素
                reply.value = res.data[0]
                // 其他回复是拿取的剩下的所有元素
                replys.value = res.data.slice(1)
            } else {
                reply.value = []
            }
        })
    }

})
// 返回图标是否被鼠标悬浮
let backMouseHover = ref(false)
// 路由后退
function goBack() {
    // 路由后退
    router.go(-1)
    // 鼠标悬浮因为keepAlive的原因不会重置，所以需要重置
    backMouseHover.value = false
}
</script>

<style lang="less" scoped>
.replyDet {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    max-height: calc(100% - 80px);
    overflow: auto;

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


    .reply {
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

            .date {
                line-height: 40px;
                padding: 0px 5px;
                font-size: 12px;
                color: #a7a7a8;
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

    .replytoreply {
        .title {
            margin: 5px 0px;
            font-size: 14px;
            letter-spacing: 4px;

            span {
                font-weight: bold;
            }

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