<template>
    <div class="post" @click="routerToPostDetails(post['p_id'])">
        <div class="p_userinfo">
            <img @click.stop="toUserInfo(post['u_id'])" class="p_useravatar"
                :src="apiStore.getBaseUrl() + apiStore.getPort() + post['u_avatar']" alt="">
            <div class="p_info">
                <div class="p_usernick">
                    <span :style="{ color: post['color'] }">{{ post['u_nick'] }}</span>
                </div>
                <div class="p_currdate">
                    {{ post['p_date'] }}
                </div>
            </div>
            <div class="p_more">
                <div class="morebtn" @click.stop="extendMore()">
                    <img src="/src/assets/img/more.png" alt="">
                    <div class="more_item" v-show="moreExtendPid">
                        <div class="item">
                            关注该分区
                        </div>
                        <div class="item">
                            关注该用户
                        </div>
                        <div class="item">
                            删除该帖子
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="p_title">
            {{ post['p_title'] }}
        </div>
        <div class="p_content">
            {{ post['p_content'] }}
            <div class="file">
                <!-- 图片 -->
                <div v-if="post['p_filetype'] == 'p'">
                    <img @click.stop="previewPicture(apiStore.getBaseUrl() + apiStore.getPort() + post['p_picture'].split('?')[1])"
                        :src="apiStore.getBaseUrl() + apiStore.getPort() + post['p_picture'].split('?')[1]" alt="">
                    <br>
                    <div class="remain_num" v-show="post['p_picture'].split('?').length > 2">
                        还剩下{{ post['p_picture'].split('?').length - 2 }}个图片未显示
                    </div>
                </div>
                <!-- 视频 -->
                <div style="width: 100%;" @click.stop="" v-if="post['p_filetype'] == 'v'">
                    <video height="300" controls>
                        <source :src="apiStore.getBaseUrl() + apiStore.getPort() + post['p_picture'].split('?')[1]">
                    </video>
                </div>
                <div class="file" v-if="post['p_filetype'] == 'f'">
                    <!-- 以后再对文件处理 -->
                    <div class="item" v-for="(file, index) in post['p_picture'].split('?')" :key="index">
                        <File @click.stop="" v-show="file" :path="apiStore.getBaseUrl() + apiStore.getPort() + file"
                            :download="true" :file="{ name: file.slice(file.indexOf('_') + 1), size: '' }">
                        </File>
                    </div>
                </div>
            </div>
        </div>
        <div class="p_bottom">
            <div class="bt_item">
                <img src="/src/assets/img/pinglun.png" alt="">
                评论(<span>{{ post['p_reply'] }}</span>)
            </div>
            <div class="dot"></div>
            <div class="bt_item" @click.stop="">
                <img src="/src/assets/img/postzone.png" alt="">
                <span class="zone" @click.stop="routerToZoneDetail(post['z_id'])">{{ post['z_name'] || zName }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfZone } from "../store/zone"
import { storeOfApi } from "../store/api"
import { useRouter, useRoute } from "vue-router"
const zoneStore = storeOfZone()
const apiStore = storeOfApi()
const router = useRouter()
const route = useRoute()

// 接收参数dwad
let props = defineProps(["post", "zName"])

// 处理more按钮点击效果
// 定义“哪一个post的more展开”变量
let moreExtendPid = ref(false)
// 选择一个展开
function extendMore() {
    moreExtendPid.value = true
    // 给全局添加一个单击事件，用来关闭展开
    document.addEventListener('click', cancelExtendMore)
}
// 取消展开
function cancelExtendMore() {
    moreExtendPid.value = false
    // 销毁全局事件
    document.removeEventListener('click', cancelExtendMore)
}

// 图片预览
function previewPicture(path) {
    zoneStore.setPicturePreviewPath(path)
}




// 跳转到帖子详情
function routerToPostDetails(pId) {
    router.push({
        name: "postDet",
        query: {
            pId
        }
    })
}
// 跳转到分区详情
function routerToZoneDetail(zId) {
    router.push({
        name: "zone",
        query: {
            zId
        }
    })
}

// 去个人主页
function toUserInfo(uid) {
    router.push({
        name: "personhp",
        query: {
            uid
        }
    })
}
</script>

<style lang="less" scoped>
.post {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    margin: 10px 0px;

    .p_userinfo {
        height: 40px;
        display: flex;

        .p_useravatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .p_info {
            height: 40px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 0px 15px;

            >div {
                height: 15px;
                line-height: 15px;
            }

            .p_usernick {
                font-weight: bold;
            }

            .p_currdate {
                font-size: 14px;
                color: #676a79;
            }
        }

        .p_more {
            flex: 1;
            display: flex;
            justify-content: right;

            .morebtn {
                width: 40px;
                height: 30px;
                text-align: center;
                // padding: 5px;
                border-radius: 5px;
                cursor: pointer;
                position: relative;

                &:hover {
                    background-color: #ebeaea;
                }

                img {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .more_item {
                    position: absolute;
                    left: 0px;
                    top: 100%;
                    transform: translateX(-100%);
                    margin-left: 40px;
                    margin-top: 5px;
                    width: 150px;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    border-radius: 5px;
                    box-shadow: 0px 20px 30px rgba(83, 88, 93, 0.1), 0px 0px 30px rgba(83, 88, 93, 0.2);
                    background-color: white;

                    .item {
                        padding: 10px 5px;
                        color: #676a79;
                        font-size: 15px;

                        &:hover {
                            color: #0f6fec;
                        }
                    }
                }
            }


        }
    }

    .p_title {
        // 29号
        margin: 15px 0px;
        font-weight: bold;
        font-size: 18px;
    }

    .p_content {
        font-size: 16px;
        font-family: "黑体";
        line-height: 20px;

        .file {
            img {
                margin: 5px 0px;
                height: 300px;
                border-radius: 5px;
            }

            video {
                // width: 100%;
                margin: 5px 0px;
                border-radius: 5px;
            }

            .remain_num {
                padding: 5px;
                color: #676a79;
                cursor: pointer;
                width: auto;
                background-color: #ebeaea;
                display: inline-block;
                border-radius: 5px;
                font-size: 14px;

            }
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
</style>