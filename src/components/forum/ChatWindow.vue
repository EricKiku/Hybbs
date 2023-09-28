<template>
    <div class="chat">
        <div class="title">
            <img src="../../assets/img/art.jpg">
            <div>{{ chatStore.getChatUserByStats("u_nick") }}</div>
            <div>
                ({{ connectStatus }})
            </div>
            <div class="close" @click="chatStore.close()" title="关闭"></div>
        </div>
        <div class="chatMain scrollbar" ref="chatMain">
            <div class="chat_item" v-for="(item, index) in list" :key="index">
                <!-- 自己的聊天 -->
                <div class="self" v-if="item['sendId'] == sendUId">
                    <div class="content ">
                        <div class="nick me">
                            {{ userStore.get('u_nick') }}
                        </div>
                        <div class="chat_message">
                            {{ item['message'] || item["c_message"] }}
                        </div>

                    </div>
                    <div class="avator">
                        <img src="../../assets/img/art.jpg" alt="">
                    </div>
                </div>
                <!-- 对方的聊天 -->
                <div style="display: flex;" v-if="item['sendId'] == receUId">
                    <div class="avator">
                        <img src="../../assets/img/art.jpg" alt="">
                    </div>
                    <div class="content">
                        <div class="nick">
                            {{ chatStore.getChatUserByStats('u_nick') }}
                        </div>
                        <div class="chat_message">
                            {{ item['message'] }}
                        </div>

                    </div>
                </div>

            </div>
        </div>
        <div class="newMessage" v-show="newMessageTip" @click="scrollToBottom()">
            {{ newMessageTip }}
        </div>
        <div class="sendComponent">

            <input @keyup.enter="send()" type="text" v-model="sendMessage" placeholder="在此输入消息，按回车发送">
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue"
import { storeOfChat } from "../../store/chat";
import { storeOfUser } from "../../store/user"
import { wsConnApi } from "../../api/wsApi"
import { getCurrentDate } from "../../tools/date"
import { getChatBySendAndReceId } from "../../api/chatAPI"
const chatStore = storeOfChat()
const userStore = storeOfUser()
let sendUId = userStore.get("u_id")
let receUId = chatStore.getChatUserByStats("u_id")
onMounted(() => {
    // 获取历史记录
    getHistoryChat()


})
// 聊天列表
let list = <any>ref([])

// 获取历史聊天
function getHistoryChat() {
    getChatBySendAndReceId(sendUId, receUId).then(res => {
        if (res.status == 200) {
            // 存入聊天列表
            list.value = res.data
            // 建立ws连接
            wsConnect()
            // 滚动
            // 滚动
            scrollToBottom()
        }


    })
}

// 让元素滚动到最后
let chatMain = <any>ref()
async function scrollToBottom() {
    // 关掉新消息提示
    newMessageTip.value = ""
    await nextTick()
    let top = chatMain.value.scrollTop;
    let height = chatMain.value.scrollHeight;
    if (top == 0) {
        top = 500
    }
    let speed = (height / top) * 50;
    let scrollTimer = setInterval(() => {
        // 5s 后关掉计时器
        setTimeout(() => {
            clearInterval(scrollTimer)
        }, 5000);
        console.log("timer是否未关闭字符串");
        if (height - top > 470) {
            if (top + speed + 470 >= height) {
                chatMain.value.scrollTop = chatMain.value.scrollHeight;
                clearInterval(scrollTimer)
            }
            chatMain.value.scrollTop += speed;
            top = chatMain.value.scrollTop;
            speed = (height / top) * 50

        } else {
            clearInterval(scrollTimer)
        }
    }, 10);
}

// 新消息提示
let newMessageTip = ref("")

// WebSocket连接代码
// 连接状态
let connectStatus = ref("与服务器连接中...")
let ws
function wsConnect() {
    ws = new WebSocket(`ws://localhost:1234/ws/conn?sendUId=${sendUId}`)

    ws.onopen = (evt) => {
        connectStatus.value = "连接成功"
    };

    // 接收到消息时触发  
    ws.onmessage = (e) => {
        let msg = JSON.parse(e.data)
        console.log("ws:", msg);
        list.value.push(msg)

        // 如果往上划的太远，则提示有消息
        let top = chatMain.value.scrollTop;
        let height = chatMain.value.scrollHeight;
        console.log("top:", top, "height:", height);
        if (height - top <= 940) {
            scrollToBottom()
        } else {
            // 提示有新消息
            newMessageTip.value = "有一条新消息"
            setTimeout(() => {
                newMessageTip.value = ""
            }, 4000);
        }
    };

}
// 发送消息
let sendMessage = ref("")
// 发送消息结构体
let messageStruct = {
    sendId: 0,
    sendName: "",
    receId: 0,
    receName: "",
    message: "",
    date: ""
}
const send = () => {
    if (sendMessage.value != "") {
        // if (false) {
        messageStruct.sendId = userStore.get('u_id');
        messageStruct.sendName = userStore.get('u_nick')
        messageStruct.receId = chatStore.getChatUserByStats('u_id');
        messageStruct.receName = chatStore.getChatUserByStats('u_nick');
        messageStruct.message = sendMessage.value;
        messageStruct.date = getCurrentDate()
        // 给list追加一条本记录
        // list.value.push(messageStruct)
        sendMessage.value = ""
        ws.send(JSON.stringify(messageStruct))
        // 滚动
        scrollToBottom()
    }

}
</script>

<style lang="less" scoped>
.chat {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: white;
    height: 500px;
    width: 607px;
    z-index: 2;
    box-shadow:
        12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
        100px 100px 80px rgba(0, 0, 0, 0.07);

    .title {
        height: 30px;
        line-height: 30px;
        background-color: #6e6f90;
        display: flex;
        color: white;

        img {
            height: 30px;
            width: 30px;
        }

        .close {
            height: 20px;
            width: 20px;
            background-color: rgb(255, 97, 97);
            position: absolute;
            right: 5px;
            cursor: pointer;
            top: 5px;

            &:hover {
                background-color: red;
            }
        }

    }

    .chatMain {
        height: calc(100% - 30px);
        width: 100%;
        overflow: auto;
        background-color: #F4D3C0;
        background-image: url('../../assets/img/chat_bg.png');
        /* 背景图垂直、水平均居中 */
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;





        .chat_item {
            // display: flex;
            margin-top: 10px;

            img {
                height: 30px;
                width: 30px;
                border-radius: 50%;
                padding: 5px;
            }

            .content {
                .nick {
                    font-size: 12px;
                    color: rgb(162, 162, 248);
                }

                .me {
                    text-align: right;
                }

                .chat_message {
                    max-width: 510px;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    // border: 1px solid #0185F2;
                    // background-color: #0185F2;
                    // color: white;
                    background-color: white;
                    min-height: 20px;
                    line-height: 20px;
                    padding: 5px;
                    border-radius: 5px;
                    font-size: 18px;
                }
            }


            .self {
                display: flex;
                justify-content: right;
            }
        }

        .chat_item:last-child {
            margin-bottom: 60px;
        }
    }

    .newMessage {
        position: fixed;
        bottom: 40px;
        background-color: rgba(104, 165, 104, 0.821);
        color: white;
        width: 600px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .sendComponent {
        position: fixed;
        bottom: 0px;
        width: 600px;
        height: 40px;
        background-color: white;

        input {
            width: 582px;
            height: 20px;
            margin-left: 5px;
            margin-top: 5px;
            padding: 5px;
            border: 1px solid #ccc;
            outline: none;
            transition: all 0.2s;

            &:hover {
                border: 1px solid rgb(124, 124, 124);
            }

            &:focus {
                border: 1px solid black;
            }
        }
    }
}
</style>