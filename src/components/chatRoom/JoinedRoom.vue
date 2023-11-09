<template>
    <div class="joined">
        <div @click="chatRoomStore.setCurrentRunningRoom(jr)" class="joinedRoom_item"
            :class="{ active_room: ((chatRoomStore.getCurrentRunningRoom()['r_id'] == jr['r_id']) && (route.path.indexOf('/chatwindow') != -1)) }"
            v-for="(jr) in chatRoomStore.getJoinedRooms()" :key="jr['r_id']">
            <img :src="apiStore.getBaseUrl() + apiStore.getPort() + jr['r_ico']" alt="">
            <div class="name">{{ jr['r_name'] }}</div>
            <div class="member">
                <div class="dot"></div>
                <span class="num">{{ jr['r_member'] }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getJoinedRoom } from "../../api/roomAPI"
import { storeOfUser } from "../../store/user"
import { storeOfChatRoom } from "../../store/chatRoom"
import { storeOfApi } from "../../store/api"
import { useRouter, useRoute } from "vue-router"

const userStore = storeOfUser()
const chatRoomStore = storeOfChatRoom()
const apiStore = storeOfApi()
const router = useRouter()
const route = useRoute()
onMounted(() => {
    refreshJoinedRoom()
})
// 刷新加入的频道列表
function refreshJoinedRoom() {
    let u_id = userStore.get('u_id')
    // 发起请求
    getJoinedRoom(u_id).then(res => {
        if (res.status == 200) {
            chatRoomStore.setJoinedRooms(res.data)
        }
    })
}
</script>

<style lang="less" scoped>
.joined {
    width: 100%;

    .active_room {
        background-color: #46484a;
        color: white !important;
    }

    // height: 400px;
    .joinedRoom_item {
        padding: 5px;
        height: 30px;
        line-height: 30px;
        border-radius: 5px;
        color: #bfbfbf;
        margin-top: 10px;
        display: flex;
        user-select: none;
        cursor: pointer;

        &:hover {
            background-color: #46484a;
            color: white;
        }

        img {
            height: 30px;
            width: 30px;
            vertical-align: middle;
            border-radius: 100%;
        }

        .name {
            margin-left: 5px;
            // max-width: 145px;
            flex: 1;
            /* 强制不换行 */
            white-space: nowrap;
            /* 文字用省略号代替超出的部分 */
            text-overflow: ellipsis;
            /* 匀速溢出内容，隐藏 */
            overflow: hidden;
        }

        .member {
            width: 30px;
            // flex: 1;
            text-align: right;
            display: flex;

            .dot {
                height: 8px;
                width: 8px;
                background-color: greenyellow;
                border-radius: 100%;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }

            .num {
                flex: 1;
                text-align: center;
            }
        }
    }
}
</style>