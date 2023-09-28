<template>
    <div class="user">
        <div class="mask" v-show="dialogVisual"></div>
        <div class="dialog" v-if="dialogVisual">
            <div class="close" @click="dialogVisual = false">
            </div>
            <el-transfer :titles="['关注分区', '取消关注']" v-model="cacelAttentions" :data="data" />
            <el-button type="primary" @click="submit()">确定</el-button>
        </div>
        <div class="main scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
            <div class="top"></div>
            <div class="one">
                <div class="one_1">
                    <img src="../assets/img/art.jpg" title="点击切换头像">
                </div>
                <div class="one_2">
                    <span v-show="!editNickStatus">
                        {{ userStore.currentUser.u_nick }}
                    </span>
                    <input maxlength="8" v-show="editNickStatus" v-model="nick">
                    <img v-show="!editNickStatus" title="修改昵称" src="../assets/img/edit.png" @click="shiftEditNick()">
                    <img v-show="editNickStatus" title="确定修改" src="../assets/img/sure.png" @click="editNick()">
                    <img v-show="editNickStatus" title="取消修改" src="../assets/img/cancel.png" @click="shiftEditNick()">

                </div>
                <div class="one_3" v-if="userOfMe">
                    <div class="lv">
                        <span title="用户等级">等级 Lv</span>：<span><i>{{ userOfMe['u_lv'] }}</i></span>
                    </div>
                    <div class="fensi">
                        <img src="../assets/img/fensi.png" title="粉丝">：
                        <span class="fensiNum">{{ userOfMe['u_fensi'] }}</span>
                    </div>
                    <div class="Contact">

                    </div>
                </div>
            </div>
            <div class="container">
                <div class="two">
                    <div>
                        关注的分区
                        <img @click="settingZone" class="setting" src="../assets/img/settings.png" title="管理关注分区">
                    </div>
                    <div class="zone_attention scrollbar">
                        <!-- vfor store中的关注列表 -->
                        <div @click="toZoneDetails(zone['z_id'])" class="zone_item"
                            v-for="(zone, index) in userStore.attentionZones" :key="zone['z_id']">
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
                <MyZone></MyZone>
                <hr>
                <div class="post_reply">
                    <MyPosts></MyPosts>
                    <MyReply></MyReply>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfUser } from "../store/user"
import { setNickApi, setAttentionZone, getUserByUId } from "../api/userAPI"
import { ElMessage } from 'element-plus'
import { UpdateAttentions } from "../tools/tools"
import { storeOfZone } from "../store/zone"
import { useRouter } from "vue-router"
import MyZone from "../components/userInfo/MyZone.vue"
import MyPosts from "../components/userInfo/MyPosts.vue"
import MyReply from "../components/userInfo/MyReply.vue"
const userStore = storeOfUser()
const router = useRouter()
const zoneStore = storeOfZone()

let loadingStatus = ref(false)

// 我的用户信息
let userOfMe = ref()
// 获取用户
onMounted(() => {
    getMy()
})

// 获取用户
function getMy() {
    loadingStatus.value = true
    let uId = userStore.get("u_id")
    getUserByUId(uId).then(res => {
        console.log("my:", res.data);
        if (res.status == 200) {
            userOfMe.value = res.data
        }
    }).finally(() => loadingStatus.value = false)
}



// 昵称
let nick = ref("")
// 当前是否是修改昵称状态
let editNickStatus = ref(false)
// 切换昵称修改状态
function shiftEditNick() {
    editNickStatus.value = !editNickStatus.value
    // 把 当前昵称给nick
    nick.value = userStore.currentUser.u_nick
}
// 发送编辑昵称请求
function editNick() {
    // 既不为空，也不与原来相同
    if (nick.value != "" && nick.value != userStore.currentUser.u_nick) {
        let email = userStore.currentUser.u_email

        setNickApi(email, nick.value).then(res => {
            console.log(res);
            // 如果成功，修改current的nick。然后退出修改昵称状态
            if (res.status == 200) {
                userStore.setPro('u_nick', nick.value)
                message(1, "修改成功")
            } else {
                message(2, "修改失败")
            }
            // 退出修改状态
            editNickStatus.value = false
        }, rej => {
            ElMessage.error('服务器错误，请稍后重试.')
            // 退出修改状态
            editNickStatus.value = false
        })
    }

}

// >> 管理分区
interface Option {
    key: number
    label: string
}
// 对话框是否显示
let dialogVisual = ref(false)
// 穿梭框源数据
let data
// 穿梭到右侧的数据
let cacelAttentions = ref([])
// 设置按钮点击方法，设置好数据，显示对话框
function settingZone() {
    data = ref<Option[]>(generateData())

    dialogVisual.value = true
}

// 获取源数据
const generateData = () => {
    const data: Option[] = []

    for (let i = 0; i < userStore.attentionZones.length; i++) {

        data.push({
            key: userStore.attentionZones[i]['z_id'],
            label: userStore.attentionZones[i]['z_name']
        })
    }

    return data
}


// 确认提交
function submit() {
    let tempArr = <any>[];
    for (let i = 0; i < data.value.length; i++) {
        let id = <never>data.value[i].key
        if (cacelAttentions.value.indexOf(id) == -1) {
            tempArr.push(data.value[i].key)
        }
    }
    // 调用API，请求更新关注列表
    setAttentionZone(tempArr.length == 1 ? tempArr[0] + "," : tempArr.join(',') + ',', userStore.currentUser.u_id).then(res => {
        if (res.status == 200) {
            for (let i = 0; i < cacelAttentions.value.length; i++) {
                message(1, "操作成功，已取消关注-" + getZoneName(cacelAttentions.value[i]))
            }
            // 更新store 的 u_att_zone
            userStore.setPro('u_att_zone', tempArr.join(',') + ',')
            // 利用 u_att_zone 更新列表，并且是立即更新
            UpdateAttentions(true)
            // 关掉对话框
            dialogVisual.value = false
        }
    })

}
// 获取分区name方法
function getZoneName(z_id) {
    for (let i = 0; i < userStore.attentionZones.length; i++) {
        if (userStore.attentionZones[i]['z_id'] == z_id) {
            return userStore.attentionZones[i]['z_name'];
        }
    }
}

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
</script>

<style lang="less" scoped>
.user {
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/user_bg.png");
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
            background-image: url("../assets/img/user_info_bg.jpg");
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
                        border-radius: 5px;
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
                        border-radius: 5px;
                    }

                    .addFriend {
                        margin-left: 20px;
                        border: 1px solid #979ff7;
                        padding: 2px;
                        cursor: pointer;
                        border-radius: 5px;

                        &:hover {
                            background-color: #979ff7;
                        }
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