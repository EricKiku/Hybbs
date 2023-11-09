<template>
    <div class="reply" @click="toReplyDetail(reply['r_id'], reply['r_reply'])">
        <div class="r_userinfo">
            <img class="r_useravatar" :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['u_avatar']" alt="">
            <div class="r_info">
                <div class="r_usernick">
                    <span :style="{ color: reply['color'] }">{{ reply['u_nick'] }}</span>
                </div>
                <div class="r_currdate">
                    {{ reply['p_date'] }}
                </div>
            </div>
        </div>
        <div class="r_content">
            {{ reply['r_content'] }}
            <div class="file" v-if="reply['r_fileType'] != ''">
                <!-- 图片 -->
                <div v-if="reply['r_fileType'] == 'p'">
                    <img v-if="reply['r_fileType'] == 'p'"
                        @click.stop="previewPicture(apiStore.getBaseUrl() + apiStore.getPort() + reply['r_file'])"
                        :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['r_file']" alt="">
                    <br>
                </div>
                <!-- 视频 -->
                <div style="width: 100%;" @click.stop="" v-if="reply['r_fileType'] == 'v'">
                    <video height="300" controls>
                        <source :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['r_file']">
                    </video>
                </div>
            </div>
        </div>
        <div class="r_post" @click.stop="toPostDetail(reply['p_id'])">
            <div class="zone" @click.stop="toZoneDetail(reply['z_id'])">
                <img :src="apiStore.getBaseUrl() + apiStore.getPort() + reply['z_icon']" alt="">
                <div class="zname">
                    {{ reply['z_name'] }}
                </div>
            </div>
            <div class="pname">
                {{ reply['p_title'] }}
            </div>
            <div class="ico">
                <img v-show="reply['p_filetype'] == 'v'" src="../assets/img/replyPostIcoVideo.png" alt="" title="帖子携带视频">
                <img v-show="reply['p_filetype'] == 'p'" src="../assets/img/replyPostIcoPicture.png" alt="" title="帖子携带图片">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfZone } from "../store/zone"
import { storeOfApi } from "../store/api"
import { useRoute, useRouter } from "vue-router"
const apiStore = storeOfApi()
const zoneStore = storeOfZone()
const router = useRouter()
let props = defineProps(["reply"])


// 图片预览
function previewPicture(path) {
    zoneStore.setPicturePreviewPath(path)
}
// 跳转到帖子详情
function toPostDetail(pId) {
    router.push({
        name: "postDet",
        query: {
            pId
        }
    })
}
// 跳转到回复详情
function toReplyDetail(rid, torid) {
    // torid 为0 就是回复给帖子，不为0就是回复给回复
    // 如果是回复给其他的回复，则跳到回复给的回复
    if (!torid) {
        // 跳到rid
        router.push({
            name: "replyDet",
            query: {
                rid
            }
        })
    } else {
        router.push({
            name: "replyDet",
            query: {
                rid: torid
            }
        })
    }

}
// 跳转到分区详情
function toZoneDetail(zId) {
    router.push({
        name: "zone",
        query: {
            zId
        }
    })
}
</script>

<style lang="less" scoped>
.reply {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    margin: 10px 0px;

    .r_userinfo {
        height: 40px;
        display: flex;

        .r_useravatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .r_info {
            height: 40px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 0px 15px;

            >div {
                height: 15px;
                line-height: 15px;
            }

            .r_usernick {
                font-weight: bold;
            }

            .r_currdate {
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

    .r_content {
        font-size: 16px;
        font-family: "黑体";
        line-height: 20px;
        margin: 10px 0px;

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

    .r_post {
        display: flex;
        height: 40px;
        background-color: #ebeaea;
        padding: 5px;
        border-radius: 5px;

        .zone {
            display: flex;
            cursor: pointer;
            background-color: #7eb6ff;
            color: white;
            border-radius: 5px;
            transition: all 0.2s;

            &:hover {
                background-color: #3a8fff;
            }

            img {
                border-radius: 5px;
                height: 40px;
                width: 40px;
            }

            .zname {
                line-height: 40px;
                padding: 0px 5px;
            }
        }




        .pname {
            line-height: 40px;
            padding: 0px 10px;
            color: #676a79;
        }

        .ico {
            img {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

}
</style>