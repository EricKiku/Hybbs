<template>
    <div class="user">
        <div class="main">
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
            </div>
            <div class="two">
                <div>
                    关注的分区
                </div>
                <div class="zone_attention">
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../store/user"
import { setNickApi } from "../api/userAPI"
import { ElMessage } from 'element-plus'
const userStore = storeOfUser()
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

    .main {
        width: 70%;
        height: 95%;
        background-color: rgba(255, 255, 255, .7);

        margin: 0 auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);

        // display: none;
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
            background-image: url("../assets/img/top_bg.jpg");
            background-repeat: no-repeat;
            background-size: 100%;
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
                line-height: 55px;
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

        }

        .two {
            margin-top: 15px;
            height: 50px;
            padding-left: 50px;
            // line-height: 40px;

            .zone_attention{
                display: flex;
            }
        }
    }
}
</style>