<template>
    <div class="personal">
        <img class="avatar" :src="apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar')" alt="">
        <div>
            <span class="name">{{ userStore.get('u_nick') }}</span>
        </div>
        <div style="flex: 1;text-align: right;">
            <img @click="showSetting" class="setting" src="../../assets/img/setting.png" alt="">
        </div>
        <div class="settingBox" v-show="settingVisual">
            <div class="title">
                <span>昵称颜色</span>
            </div>

            <div class="colorList">
                <div class="color" @click="setNameColor(color)" v-for="(color) in nameColorList"
                    :style="{ backgroundColor: color }">
                </div>
            </div>
            <hr>
            <div class="title">
                <span>聊天消息颜色</span>
            </div>

            <div class="colorList">
                <div class="color" @click="setColor(color['str'], color['lv'])" v-for="(color) in messageColorList"
                    :style="{ backgroundColor: color['str'] }">
                    <div class="mask" v-show="userStore.get('u_lv') < color['lv']">
                        <span>lv.{{ color['lv'] }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../../store/user"
import { storeOfApi } from "../../store/api"
import { setNameColorApi, setChatColorApi } from "../../api/roomAPI"
import { ElMessage } from 'element-plus'
const userStore = storeOfUser()
const apiStore = storeOfApi()

let settingVisual = ref(false)

function showSetting() {
    settingVisual.value = !settingVisual.value
}
// 昵称颜色列表
let nameColorList = ref(['#ffffff', '#d2b2f4', '#87d0ec'])
// 消息颜色列表
let messageColorList = ref([
    {
        lv: 1,
        str: '#FFFFFF'
    },
    {
        lv: 1,
        str: "#63F945"
    },
    {
        lv: 2,
        str: '#24BCFE'
    },
    {
        lv: 2,
        str: "#FEC024"
    },
    {
        lv: 3,
        str: "#FF42F6"
    }
])

function setNameColor(color) {
    setNameColorApi(userStore.get('u_id'), color).then(res => {
        if (res.status == 200) {
            message(1, "设置成功")
            // 更新store中的值
            userStore.setPro('color', color)
        } else {
            message(2, "设置失败")
        }
    })
}
function setColor(color, needLv) {
    if (userStore.get('u_lv') >= needLv) {
        setChatColorApi(userStore.get('u_id'), color).then(res => {
            if (res.status == 200) {
                message(1, "设置成功")
                userStore.setPro('chat_color', color)
            } else {
                message(2, "设置失败")
            }
        })
    } else {
        message(2, "等级不足")
    }
}

// 消息提示方法
function message(type, content) {
    ElMessage({
        message: content,
        type: type == 1 ? 'success' : 'warning',
    })
}
</script>

<style lang="less" scoped>
.personal {
    height: 80px;
    line-height: 80px;
    width: 250px;
    background-color: #232428;
    position: fixed;
    bottom: 0px;
    display: flex;
    user-select: none;

    .avatar {
        line-height: 80px;
        height: 40px;
        width: 40px;
        margin: 10px;
        margin-top: 20px;
        border-radius: 100%;
    }

    .name {
        color: white;
    }

    .setting {
        height: 30px;
        width: 30px;
        cursor: pointer;
        margin-top: 25px;
        margin-right: 10px;
    }

    .settingBox {
        // height: 150px;
        width: 90%;
        background-color: white;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 80px;
        border-radius: 5px;
        padding: 10px;

        .title {
            height: 20px;
            line-height: 20px;
        }

        .colorList {
            display: flex;
            flex-wrap: wrap;

            .color {
                height: 20px;
                width: 20px;
                border-radius: 3px;
                border: 1px solid #ccc;
                cursor: pointer;
                margin: 5px;
                line-height: 20px;
                text-align: center;

                .mask {
                    height: 22px;
                    width: 22px;
                    background-color: rgba(0, 0, 0, .5);
                    z-index: 2;
                    font-size: 12px;
                    color: white;
                    cursor: default;
                }
            }


        }
    }
}
</style>