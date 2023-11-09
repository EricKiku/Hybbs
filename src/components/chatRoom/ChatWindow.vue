<template>
    <div class="cw">
        <div class="head">
            <span class="zName">{{ chatRoomStore.getCurrentRunningRoom()['r_name'] }}</span>
            <div class="ad">
                <img src="../../assets/img/laba.png" alt="">
            </div>
        </div>
        <div ref="chatContent" class="chatContent scrollbar">
            <div class="chatIntm" v-for="(chatItem, index) in chatList" :key="index">
                <div class="avatar">
                    <img :src="apiStore.getBaseUrl() + apiStore.getPort() + chatItem['u_avatar']" alt="">
                </div>
                <div class="msg">
                    <div class="name">
                        <span :style="{ color: chatItem['name_color'] }">{{ chatItem['u_nick'] }}</span>
                        <span class="time">{{ chatItem['ctg_date'] }}</span>
                    </div>
                    <div class="message">
                        <span :style="{ color: chatItem['msg_color'] }">{{ chatItem['ctg_message'] }}</span>
                    </div>
                </div>
            </div>
            <div class="newMessage" @click="goToBottom" v-show="newMessage">有新消息</div>
        </div>
        <div class="send">
            <input v-model="sendMessage" @keyup.enter="send()" type="text"
                :placeholder="'在 ' + chatRoomStore.getCurrentRunningRoom()['r_name'] + ' 中发送消息'">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, nextTick } from "vue"
import { storeOfChatRoom } from "../../store/chatRoom"
import { storeOfUser } from "../../store/user"
import { getCurrentDate } from "../../tools/date"
import { storeOfApi } from "../../store/api"
import { getColorApi, getRoomChats } from "../../api/roomAPI"
import { useRouter, useRoute } from "vue-router"
const chatRoomStore = storeOfChatRoom()
const userStore = storeOfUser()
const apiStore = storeOfApi()
const router = useRouter()
const route = useRoute()
onMounted(() => {
    if (!chatRoomStore.currentRunningRoom['r_id']) {
        router.push({
            name: "/default"
        })
    }
})
// 聊天界面列表
let chatList = <any>ref([])
// WebSocket连接代码
// 连接状态
let connectStatus = ref("与服务器连接中...")
let ws
// 监听chatRoomStore中的当前聊天变化
watchEffect(() => {
    let u_id = userStore.get('u_id')
    let g_id = chatRoomStore.getCurrentRunningRoom()['r_id']
    // 清空当前聊天记录列表
    chatList.value = []
    //  获取该频道的记录
    getRoomChats(g_id).then(async res => {
        console.log(res.data);
        if (res.status == 200 && res.data.length != 0) {
            chatList.value = res.data.reverse()
            // scrollToBottom()
            await nextTick()
            chatContent.value.scrollTop = chatContent.value.scrollHeight
        }
    })
    // 发起ws连接请求
    wsConnect(u_id, g_id)
})
// 用户在该频道的name颜色
let nameColor = ref("#FFFFFF")
// 用户本次聊天内容颜色
let msgColor = ref("#FFFFFF")
watchEffect(() => {
    nameColor.value = userStore.currentUser['color']
    msgColor.value = userStore.currentUser['chat_color']
})


// 是否有新消息
let newMessage = ref(false)
function wsConnect(u_id, g_id) {
    ws = new WebSocket(`ws://192.168.43.70:1234/chatRoom/ws?u_id=${u_id}&g_id=${g_id}`)

    // ws连接成功触发
    ws.onopen = (evt) => {
        connectStatus.value = "连接成功"
    };

    // 接收到消息时触发  
    ws.onmessage = (e) => {
        let msg = JSON.parse(e.data)
        console.log("ws:", msg);
        chatList.value.push(msg)
        //  当有新消息时，计算：必须 dom.scrollHeight-dom.clientHeight == dom.scrollTop 时，才滚动，其他一律不滚
        if (chatContent.value.scrollHeight - chatContent.value.clientHeight == chatContent.value.scrollTop) {
            scrollToBottom()
        } else {
            newMessage.value = true
        }
    };
    // 连接关闭时触发
    ws.onclose = (e) => {
        console.log("连接关闭");

    }
}
// 发送消息
let sendMessage = ref("")
// 发送消息结构体
let messageStruct = {
    u_id: 0,
    ctg_group: 0,
    ctg_message: "",
    ctg_date: "",
    u_avatar: "",
    u_nick: "",
    time: "",
    name_color: "",
    msg_color: ""
}
const send = () => {
    console.log("发送");

    if (sendMessage.value != "") {
        // if (false) {
        messageStruct.u_id = userStore.get('u_id')
        messageStruct.ctg_group = chatRoomStore.getCurrentRunningRoom()['r_id']
        messageStruct.ctg_message = sendMessage.value
        messageStruct.ctg_date = getCurrentDate()
        messageStruct.u_avatar = userStore.get('u_avatar')
        messageStruct.u_nick = userStore.get('u_nick')
        messageStruct.time = new Date().getTime() + '';
        messageStruct.name_color = nameColor.value
        messageStruct.msg_color = msgColor.value
        // 给list追加一条本记录
        // list.value.push(messageStruct)
        sendMessage.value = ""
        ws.send(JSON.stringify(messageStruct))
        // 滚动,如果再最后，就平滑滚，不是就直接滚
        if (chatContent.value.scrollHeight - chatContent.value.clientHeight == chatContent.value.scrollTop) {
            scrollToBottom()
        } else {
            scrollToBottom(true)
        }

    }

}

// 点击新消息
function goToBottom() {
    newMessage.value = false
    scrollToBottom()
}



let chatContent = ref()
// 参数：directScroll ，是否直接到最后
async function scrollToBottom(directScroll = false) {
    await nextTick()
    if (directScroll) {
        chatContent.value.scrollTop = chatContent.value.scrollHeight
        return
    }
    let timer = setInterval(() => {
        if (chatContent.value.scrollTop + 5 < chatContent.value.scrollHeight - chatContent.value.clientHeight) {
            chatContent.value.scrollTop = chatContent.value.scrollTop + 5
        } else {
            chatContent.value.scrollTop = chatContent.value.scrollHeight
            clearInterval(timer)
        }

    }, 10);
}
</script>

<style lang="less" scoped>
.cw {
    color: white;
    height: 100%;

    .head {
        height: 40px;
        line-height: 40px;
        background-color: #2B2D31;
        display: flex;

        .zName {
            margin-left: 10px;
            margin-right: 10px;
        }

        img {
            height: 20px;
            width: 20px;
            margin-top: 10px;
        }
    }

    .chatContent {
        height: calc(100% - 90px);
        overflow: auto;

        // flex-direction: column-reverse;
        // height: 100%;
        .chatIntm {
            width: 80%;
            display: flex;
            padding: 10px;

            .avatar {
                padding: 10px;
                user-select: none;

                img {
                    height: 40px;
                    width: 40px;
                    border-radius: 100%;
                }
            }

            .msg {
                padding-top: 15px;

                .name {
                    font-size: 14px;
                    font-weight: bold;
                    user-select: none;

                    .time {
                        font-size: 12px;
                        color: rgb(148, 155, 164);
                        padding-left: 20px;
                    }
                }

                .message {
                    margin-top: 10px;
                    font-size: 16px;
                    letter-spacing: 2px;
                    line-height: 20px;
                }
            }
        }

        .newMessage {
            position: fixed;
            bottom: 60px;
            right: 10px;
            height: 20px;
            line-height: 20px;
            width: 70px;
            font-size: 14px;
            text-align: center;
            letter-spacing: 2px;
            background-color: rgb(35, 149, 35);
            color: white;
            border-radius: 5px;
            padding: 5px;
            user-select: none;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background-color: green;
            }
        }
    }

    .send {
        text-align: center;
        height: 50px;

        input {
            width: 90%;
            height: 40px;
            border: none;
            outline: none;
            background-color: #383A40;
            border-radius: 5px;
            color: white;
            font-family: "黑体";
            font-size: 20px;
            padding-left: 15px;
            padding-right: 15px;
            letter-spacing: 2px;
            margin-left: 10px;
            border: 1px solid #626262;

            &::placeholder {
                color: rgb(121, 121, 121);
            }
        }
    }
}
</style>