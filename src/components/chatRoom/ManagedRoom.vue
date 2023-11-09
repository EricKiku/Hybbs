<template>
    <div class="managedRoomList">
        <div class="roomItem" v-if="room['r_id']">
            <span class="img"><img @click="toRoomManage(room)" title="频道管理" src="../../assets/img/pindao.png" alt=""></span>
            <div class="room_name" @click="chatRoomStore.setCurrentRunningRoom(room)" :title="room['r_name']">{{
                room["r_name"] }}</div>
            <div class="member" @click="chatRoomStore.setCurrentRunningRoom(room)" :title="'成员:' + room['r_member']">
                <img src="../../assets/img/member.png">
                <span>{{ room['r_member'] }}</span>
            </div>
        </div>
        <div v-if="!room['r_id']" style="color: white;font-family: '黑体';">
            <span>还没有频道，感觉去创建吧</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfUser } from "../../store/user"
import { getManagedRoomApi } from "../../api/roomAPI.js"
import { useRouter, useRoute } from "vue-router"
import { storeOfChatRoom } from "../../store/chatRoom"
const router = useRouter()
const route = useRoute()
const userStore = storeOfUser()
const chatRoomStore = storeOfChatRoom()
// 结果
let room = ref({
    r_id: "",
    r_name: "......",
    r_ico: "",
    r_member: "",
    r_bg_img: "",
    r_create_date: "",
    r_create_user: ""
})

onMounted(() => {
    let u_id = userStore.get("u_id")
    getManagedRoomApi(u_id).then(res => {
        if (res.status == 200) {
            room.value = res.data
        }
    })
})

// 跳转到频道管理
function toRoomManage(room) {
    console.log("跳转的room:", room);

    chatRoomStore.showManageChatRoom(room)
}


</script>

<style lang="less" scoped>
.managedRoomList {
    .roomItem {
        height: 30px;
        border-radius: 5px;
        margin-top: 10px;
        color: #bfbfbf;
        line-height: 30px;
        cursor: pointer;

        display: flex;
        user-select: none;

        &:hover {
            color: white;
            background-color: #46484a;
        }

        .img {
            padding-left: 10px;
            padding-right: 10px;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;

            // margin-right: 10px;
            &:hover {
                background-color: #343637;
            }

            img {
                cursor: pointer;
                vertical-align: middle;
                margin-bottom: 1px;
            }
        }

        .room_name {
            max-width: 100px;
            /* 强制不换行 */
            white-space: nowrap;
            /* 文字用省略号代替超出的部分 */
            text-overflow: ellipsis;
            /* 匀速溢出内容，隐藏 */
            overflow: hidden;
        }

        .member {
            flex: 1;
            text-align: right;
            line-height: 30px;
            padding-right: 5px;

            img {
                vertical-align: middle;
                margin-right: 5px;
                margin-bottom: 2px;
            }
        }

    }
}
</style>