<template>
    <div class="lr">
        <div class="lrMain" v-loading="loadingStatus" element-loading-text="Loading..."
            element-loading-background="rgba(122, 122, 122, 0.5)">
            <div v-if="submitNickDialog" class="mask"></div>
            <div v-if="submitNickDialog" class="dialog">
                <div class="tip">
                    起一个好听的名字吧
                </div>
                <div class="nickInput">
                    <input v-model="nick">
                </div>
                <button @click="submitNick">确定</button>
            </div>
            <div class="back">
                <button @click="goBack">返回</button>
            </div>
            <div class="title">
                <b v-show="status == 'log'">登录</b>
                <b v-show="status == 'reg'">注册</b>
                <br>
                <span v-show="status == 'log'" class="fu_title">欢迎回来</span>
                <span v-show="status == 'reg'" class="fu_title">欢迎注册</span>
            </div>
            <div class="input">
                <span>请输入电子邮箱</span>
                <input :class="{ error: loginError }" style="letter-spacing: 3px;" placeholder="xxxxxxx@qq.com"
                    v-model="email">
            </div>
            <div v-show="status == 'reg'" class="input">
                <span>请输入验证码</span>
                <br>
                <div style="display: flex;">
                    <input v-model="yzm" id="yzm_input">
                    <button v-show="!have_been_sent" @click="getYzm()" id="yzm_button">获取验证码</button>
                    <button id="yzm_button_wait" v-show="have_been_sent">{{ second }}</button>
                </div>

            </div>
            <div class="input">
                <span>请输入密码</span>
                <input :class="{ error: loginError }" v-model="password" type="password">
            </div>
            <div class="input">
                <button @click="login()" v-show="status == 'log'">登录</button>
                <button @click="regist()" v-show="status == 'reg'">注册</button>
            </div>
            <div class="input">
                <span v-show="status == 'log'">还没有账号?</span><span @click="shift('reg')" v-show="status == 'log'"
                    class="shiftReg">注册</span>
                <span v-show="status == 'reg'">已经拥有账号?</span><span @click="shift('log')" v-show="status == 'reg'"
                    class="shiftReg">登录</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { getYzmAPI, findEmailAPI, registerAPI, loginAPI } from "../api/loginAPI"
import { setNickApi } from "../api/userAPI"
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import { storeOfUser } from "../store/user"
import { UpdateAttentions } from "../tools/tools"
let router = useRouter()
const userStore = storeOfUser();
// 当前是登录还是注册
let status = ref("log");

function shift(value) {
    status.value = value
}


// 输入邮箱
let email = ref("2966678301@qq.com")
// 验证码
let yzm = ref("")
// 正确验证码
let yzmValid = ref("")
// 密码
let password = ref("15097688803")

// 加载状态
let loadingStatus = ref(false)
// 注册方法
function regist() {
    // 进入加载状态
    loadingStatus.value = true
    // 判断有没有信息没有填写
    if (email.value == "" || yzm.value == "" || password.value == "") {
        ElMessage({
            message: '信息填写不完全',
            type: 'warning',
        })
    } else {
        // 填写完全再请求
        if (yzm.value == yzmValid.value) {
            // console.log('验证码正确');
            registerAPI(email.value, password.value).then(res => {
                if (res.status == 200) {
                    ElMessage({
                        message: '注册成功，正在前往登录...。',
                        type: 'success',
                    })
                    // 打开昵称对话框
                    submitNickDialog.value = true

                }

            }).finally(() => { loadingStatus.value = false })

        } else {

            ElMessage({
                message: '验证码填写错误',
                type: 'warning',
            })
        }
    }

}
// 是否进入30s倒计时
let have_been_sent = ref(false)
// 计时
let second = ref(50)
// 获取验证码方法
let time
function getYzm() {

    // 正则验证邮箱
    var aqq = /^[1-9][0-9]{4,10}@qq.com$/;
    let res = aqq.test(email.value)
    if (!res) {
        ElMessage.error('不是qq邮箱.')
        // 计时器归位
        second.value = 50
    } else {

        // 改为已发送状态
        have_been_sent.value = true
        // 开始计时
        time = setInterval(() => {
            second.value -= 1;
            if (second.value <= 1) {
                // 切换会未发送状态
                have_been_sent.value = false
                // 计时器归位
                second.value = 50
            }
        }, 1000);
        // 先验证邮箱是否存在
        findEmailAPI(email.value).then(resp => {
            if (resp.status == 201) {
                // 已存在
                ElMessage.error("邮箱已存在，请登录")
                // 转换 按钮的状态
                have_been_sent.value = false
                // 清空秒表
                clearInterval(time)
                second.value = 50

            } else {
                ElMessage({
                    message: '已发送验证码，请注意查看。',
                    type: 'success',
                })
                // 如果不存在，再发送请求
                // 发送邮箱验证码请求
                getYzmAPI(email.value).then(res => {
                    yzmValid.value = res.data
                })
            }
        })

    }

}

// 是否启动登录失败样式
let loginError = ref(false)
// 登录方法
function login() {
    // 进入加载状态
    loadingStatus.value = true
    if (email.value == "" || password.value == "") {
        ElMessage({
            message: '数据填写不完整',
            type: 'warning',
        })
    } else {
        // 调用登录请求
        loginAPI(email.value, password.value).then(res => {
            // 201 登录失败
            if (res.status == 201) {
                ElMessage.error("邮箱或验证码错误")
                // 启动错误样式
                loginError.value = true
                // 2s 后撤销错误样式
                setTimeout(() => {
                    loginError.value = false
                }, 5000);
            } else if (res.status == 200) {
                // 200 登录成功
                ElMessage({
                    message: '登录成功，欢迎回来(即将跳转..)',
                    type: 'success',
                })
                const user = res.data
                // 把用户数据存储在store中
                localStorage.setItem("user_id", user.u_id)
                userStore.setCurrentUser(user)
                // 更新attentionZones
                UpdateAttentions(true)
                // userStore.setCurrentUser()
                setTimeout(() => {
                    goBack()
                }, 1000);
            } else {
                ElMessage({
                    message: '服务器错误，请稍后重试',
                    type: 'warning',
                })
            }

        }).finally(() => {
            loadingStatus.value = false
        })
    }
}

// 提交昵称nick
let submitNickDialog = ref(false)
let nick = ref("")
function submitNick() {
    if (nick.value != "") {
        setNickApi(email.value, nick.value).then(res => {
            if (res.status == 200) {
                ElMessage({
                    message: '设置成功，即将跳转登录..',
                    type: 'success',
                })
                // 转成登录模式，取消遮罩屏
                setTimeout(() => {
                    submitNickDialog.value = false
                    status.value = "log"
                }, 2000);
            }
        })
    } else {
        ElMessage({
            message: '昵称不能为空',
            type: 'warning',
        })
    }
}

// 返回上一级方法
function goBack() {
    router.go(-1)
}
</script>

<style lang="less" scoped>
// 邮箱或密码错误样式效果
.error {
    outline: 1px solid red !important;
}

// 遮罩层

.lr {
    height: 100%;
    width: 100%;
    background-color: rgb(108, 104, 104);
    background-image: url('../assets/img/login_back.png');
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


    .lrMain {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        height: 500px;
        width: 800px;
        background: rgba(255, 255, 255, 0.3);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        border-radius: 25px;
        box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);

        // 遮罩层
        .mask {
            height: 100%;
            width: 100%;
            background-color: #000;
            opacity: 0.3;
            border-radius: 25px;
            position: absolute;

        }

        // 对话框
        .dialog {
            height: 130px;
            width: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            background-color: #fff;
            border-radius: 10px;
            box-shadow:
                0px 0px 10px rgba(191, 234, 250, 1),
                0px 0px 80px rgba(191, 234, 250, 1);
            background: rgb(191, 234, 250);
            background: linear-gradient(159deg, rgba(191, 234, 250, 1) 0%, rgba(239, 216, 250, 1) 19%, rgba(219, 195, 255, 1) 33%, rgba(165, 203, 255, 1) 50%, rgba(121, 250, 255, 1) 71%, rgba(166, 255, 248, 1) 87%, rgba(171, 255, 171, 1) 100%);

            color: white;
            z-index: 1;

            .tip {
                text-align: center;
                font-size: 24px;
                color: #4752C4;
                font-family: "楷体";
                padding-top: 10px;
                padding-bottom: 10px;
            }

            .nickInput {
                width: 60%;
                margin: 0 auto;

                input {
                    width: 100%;
                    padding: 5px;
                    outline: 0px;
                    border: 2px solid #F4CEC3;
                    border-radius: 9px;
                    font-size: 20px;
                    text-align: center;
                }
            }

            button {

                height: 30px;
                width: 100px;
                display: block;
                margin: 0 auto;
                margin-top: 10px;
                border: none;
                border-radius: 5px;
                background-color: #6a73d7;
                color: white;
                cursor: pointer;

                &:hover {
                    background-color: #3b3e6b;
                }
            }
        }

        .back {
            height: 20px;

            button {
                height: 20px;
                width: 50px;
                border: 0px;
                background-color: #6a73d7;
                color: white;
                margin-left: 30px;
                margin-top: 10px;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: #4752C4;
                }
            }
        }

        .title {
            font-size: 30px;
            margin-top: 30px;
            text-align: center;
            color: #69cf60;

            .fu_title {
                font-size: 18px;
                color: #8b8a8a;
            }
        }

        .input {

            width: 40%;
            margin: 0 auto;
            margin-top: 30px;

            input {
                height: 25px;
                padding: 5px;
                width: 100%;
                margin-top: 5px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                padding-left: 10px;
                letter-spacing: 5px;

                &:focus {
                    outline: 0px;
                }
            }

            button {
                display: block;
                width: calc(100% + 15px);
                height: 35px;
                border: none;
                border-radius: 5px;
                background-color: #727ad9;
                color: white;
                cursor: pointer;

                &:hover {
                    background-color: #4752C4;
                }
            }

            .shiftReg {
                color: #727ad9;
                border-bottom: 1px solid #727ad9;
                cursor: pointer;
            }
        }

        #yzm_input {
            // width: 50%;
            padding-right: 15px;
            border-bottom-right-radius: 0px;
            border-top-right-radius: 0px;
        }

        #yzm_button {
            width: 50%;
            margin-top: 5px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }

        #yzm_button_wait {
            width: 50%;
            margin-top: 5px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            background-color: #8b8a8a;
            cursor: auto;

        }
    }


    .bottom {
        position: fixed;
        bottom: 0px;
    }
}
</style>