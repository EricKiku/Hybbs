<template>
    <div class="user">
        <div class="main scrollbar" v-loading="loadingStatusMain" element-loading-background="rgba(0, 0, 0, 0.2)">
            <div class="top"></div>
            <div class="one" v-if="otherUser">
                <div class="one_1">
                    <img :src="apiStore.getBaseUrl() + apiStore.getPort() + otherUser['u_avatar']">
                </div>
                <div class="one_2">
                    <span>
                        {{ otherUser['u_nick'] }}
                    </span>
                </div>
                <div class="one_3">
                    <div class="lv">
                        <span title="用户等级">等级 Lv</span>：<span><i>{{ otherUser['u_lv'] }}</i></span>
                    </div>
                    <div class="fensi">
                        <img src="../assets/img/fensi.png" title="粉丝">：
                        <span class="fensiNum">{{ otherUser['u_fensi'] }}</span>
                    </div>
                    <div class="addFriend">
                        <div class="add"
                            v-show="userStore.get('u_attention') ? userStore.get('u_attention').indexOf(otherUser['u_id']) == -1 : true">
                            <span @click="attentionUser(otherUser['u_id'])">
                                <img src="../assets/img/jiahaoyou.png">
                                加好友
                            </span>
                        </div>
                        <div class="cancel"
                            v-show="userStore.get('u_attention') ? userStore.get('u_attention').indexOf(otherUser['u_id']) != -1 : false">
                            <span @click="calcelAttentionUser(otherUser['u_id'])">
                                <img src="../assets/img/cancelAttentionUser.png">
                                取消关注
                            </span>
                        </div>

                    </div>
                    <div class="Contact">

                    </div>
                </div>
            </div>
            <div class="container">
                <div class="two">
                    <div>
                        关注的分区
                    </div>
                    <div class="zone_attention scrollbar" v-loading="loadingStatus"
                        element-loading-background="rgba(0, 0, 0, 0.2)">
                        <!-- vfor store中的关注列表 -->
                        <div v-if="attentionZones" @click="toZoneDetails(zone['z_id'])" class="zone_item"
                            v-for="(zone, index) in attentionZones" :key="zone['z_id']">
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
                <hr>
                <MyZone :uId="uId"></MyZone>
                <hr>
                <div class="post_reply">
                    <MyPosts :uId="uId"></MyPosts>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfUser } from "../store/user"
import { getAttentionZone, getUserByUId, attentionUserApi, cancelAttentionUserApi } from "../api/userAPI"
import { getZone } from "../api/zoneAPI"
import { ElMessage } from 'element-plus'
import { storeOfZone } from "../store/zone"
import { useRouter, useRoute } from "vue-router"
import MyZone from "../components/userInfo/MyZone.vue"
import MyPosts from "../components/userInfo/MyPosts.vue"
import MyReply from "../components/userInfo/MyReply.vue"
import { storeOfApi } from "../store/api"
const userStore = storeOfUser()
const router = useRouter()
const route = useRoute()
const zoneStore = storeOfZone()
const apiStore = storeOfApi()

const uId = route.query.uId

let otherUser = ref()
let loadingStatus = ref(false)
let loadingStatusMain = ref(false)
// 获取用户的关注分区，用户的分区，用户的帖子
onMounted(() => {
    // 获取当前用户id
    let op_u_id = userStore.get('u_id')
    refreshOtherUserInfo(op_u_id, uId)
})




// 获取用户信息方法
function refreshOtherUserInfo(opUId, uId) {
    loadingStatusMain.value = true
    // 获取用户
    getUserByUId(opUId).then(opUser => {
        if (opUser.status == 200) {
            userStore.setCurrentUser(opUser.data)
            getUserByUId(uId).then(res => {
                if (res.status == 200) {
                    otherUser.value = res.data
                    getAttentionZoneFn()
                }
            }).finally(() => loadingStatusMain.value = false)
        }
    }).finally(() => loadingStatusMain.value = false)

}




// 获取关注分区
let attentionZones = <any>ref([])
function getAttentionZoneFn() {
    loadingStatus.value = true
    // 清空已有的数据
    attentionZones.value = []
    // 先获取关注分区字符串
    getAttentionZone(uId).then(u_att_zone => {
        // 再获取全部分区
        if (u_att_zone.status == 200) {
            getZone().then(zones => {
                if (zones.status == 200) {
                    // 依次和关注字符串对比，拿出来对应的分区
                    let attArr = u_att_zone.data.split(",")
                    for (let i = 0; i < zones.data.length; i++) {
                        if (attArr.indexOf(zones.data[i]['z_id'] + '') != -1) {
                            attentionZones.value.push(zones.data[i])
                        }
                    }

                }
            }).finally(() => loadingStatus.value = false)
        }

    }).finally(() => loadingStatus.value = false)
}



// >> 管理分区
// 点击分区跳转到详情页
function toZoneDetails(z_id) {
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}
// << 管理分区
// 消息提示方法
function message(type, content) {
    ElMessage({
        message: content,
        type: type == 1 ? 'success' : 'warning',
    })
}

// 关注方法
function attentionUser(u_id) {
    // 进入加载状态
    loadingStatus.value = true
    // 获取当前用户id
    let op_u_id = userStore.get('u_id')

    // 发送请求
    attentionUserApi(op_u_id, u_id).then(res => {
        if (res.status == 200) {
            // 重新获取 当前用户和 关注用户信息
            refreshOtherUserInfo(op_u_id, u_id)
        }
    })
}
// 取消关注方法
function calcelAttentionUser(u_id) {
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
            refreshOtherUserInfo(op_u_id, u_id)
        }
    })

}
</script>

<style lang="less" scoped>
.user {
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/otherBg.jpg");
    background-repeat: no-repeat;
    background-size: 100%;

    .dialog {
        position: absolute;
        // height: 300px;
        // width: 400px;
        background-color: white;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 2;

        .close {
            height: 15px;
            width: 15px;
            background-color: red;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            top: 5px;
            left: calc(100% - 20px);
        }

        .el-transfer {
            margin-top: 10px;
            height: 290px;
            width: 562px;
            display: flex;
        }

        .el-button {
            display: block;
            margin: 0 auto;
            width: 40%;
        }
    }

    .main {
        width: 70%;
        height: 95%;
        background-color: rgba(228, 228, 228, 0.5);

        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        overflow: auto;
        // display: none;
        // padding-bottom: 50px;
        box-shadow:
            0px 0px 2.2px rgba(0, 0, 0, 0.025),
            0px 0px 5.3px rgba(0, 0, 0, 0.036),
            0px 0px 10px rgba(0, 0, 0, 0.045),
            0px 0px 17.9px rgba(0, 0, 0, 0.054),
            0px 0px 33.4px rgba(0, 0, 0, 0.065),
            0px 0px 80px rgba(0, 0, 0, 0.09);

        .top {
            width: 100%;
            height: 100px;
            background-color: white;
            background-image: url("../assets/img/otherTopBg.jpg");
            /* 背景图垂直、水平均居中 */
            background-position: center center;
            /* 背景图不平铺 */
            background-repeat: no-repeat;
            /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
            background-attachment: fixed;
            /* 让背景图基于容器大小伸缩 */
            background-size: cover;
            /* 设置背景颜色，背景图加载过程中会显示背景色 */
            background-color: #464646;
        }

        .one {
            display: flex;
            height: 60px;

            .one_1 {
                width: 160px;

                img {
                    height: 100px;
                    width: 100px;
                    position: relative;
                    top: -70%;
                    left: 50px;
                    padding: 2px;
                    border: 1px dotted #5865F2;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }

            .one_2 {
                line-height: 60px;
                font-size: 18px;
                color: rgb(52, 52, 52);
                margin-left: 15px;

                input {
                    border: 1px solid #5865F2;
                    padding: 5px;

                    &:hover {

                        outline: none;
                    }

                    &:focus {

                        outline: none;
                    }
                }

                img {
                    cursor: pointer;
                    vertical-align: middle;
                }
            }

            .one_3 {
                flex: 1;
                padding-left: 20px;
                padding-right: 20px;
                line-height: 60px;
                display: flex;
                justify-content: space-around;

                .lv {
                    user-select: none;

                    span:first-child {
                        padding: 2px;
                        background-color: #5865f5;
                        color: white;
                        font-size: 13px;
                        cursor: default;
                        border-radius: 5px;
                    }

                    span:last-child {
                        height: 18px;
                        background-color: white;
                        border: 1px solid #5865f5;
                        padding-left: 10px;
                        padding-right: 10px;
                        border-radius: 2px;
                        border-top: none;
                        border-bottom: none;
                        color: #5865F2;
                    }
                }

                .fensi {
                    user-select: none;

                    img {
                        vertical-align: middle;
                    }

                    .fensiNum {
                        height: 18px;
                        background-color: white;
                        border: 1px solid #5865f5;
                        padding-left: 10px;
                        padding-right: 10px;
                        border-radius: 2px;
                        border-top: none;
                        border-bottom: none;
                    }


                }

                .addFriend {
                    padding: 2px;

                    border-radius: 5px;
                    display: flex;

                    &:hover {}

                    .add {
                        >span {
                            border: 1px solid green;
                            height: 20px;
                            cursor: pointer;
                            padding: 5px;
                            border-radius: 5px;
                            transition: all 0.2s;

                            &:hover {
                                color: white;
                                background-color: green;
                            }
                        }
                    }

                    .cancel {
                        >span {
                            // border: 1px solid red;
                            height: 20px;
                            cursor: pointer;
                            padding: 5px;
                            border-radius: 5px;
                            transition: all 0.2s;

                            &:hover {
                                color: white;
                                background-color: red;
                            }
                        }
                    }

                    img {
                        vertical-align: middle;
                        height: 24px;
                        width: 24px;
                    }
                }
            }
        }

        .container {
            border-radius: 10px;
            background-color: rgba(255, 255, 255, .6);
            box-shadow:
                5.4px 4.6px 10px rgba(0, 0, 0, 0.06),
                43px 37px 80px rgba(0, 0, 0, 0.12);

            .two {
                margin-top: 15px;
                padding-top: 15px;
                // height: 100px;
                padding-left: 50px;
                margin-right: 50px;

                // line-height: 40px;
                .setting {
                    cursor: pointer;
                }

                .zone_attention {
                    display: flex;
                    height: 80px;
                    flex-wrap: wrap;
                    padding: 10px;
                    // border: 1px dotted #ccc;
                    overflow: auto;

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
        }

        .post_reply {
            display: flex;
            height: 265px;
            margin-left: 50px;
            margin-right: 50px;
        }
    }
}
</style>