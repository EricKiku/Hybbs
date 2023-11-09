<template>
    <div class="chat_room_list">
        <div class="room_bgimg">
            <div class="room_name">
                {{ chatRoomStore.getCurrentRunningRoom()['r_id'] ? chatRoomStore.getCurrentRunningRoom()['r_name'] : '频道名称'
                }}
            </div>
        </div>
        <div class="bar searchRoom" @click.stop="shiftSearchRoomVisual(true)">
            <img src="../../assets/img/searchRoom.png" alt="">
            <span>搜索频道</span>
            <div class="createRoom" title="创建一个频道" @click.stop="shiftCreateRoomVisual(true)">
                <img class="" src="../../assets/img/createRoom.png" alt="">
            </div>
        </div>
        <div class="hr1"></div>

        <div class="managed_room component">
            <div class="title">
                <span>我管理的频道</span>
            </div>
            <ManagedRoom></ManagedRoom>
        </div>
        <div class="joined_room component">
            <div class="title">
                <span>加入的频道</span>
            </div>
            <JoinedRoom></JoinedRoom>
        </div>
        <Personal></Personal>
        <!-- 创建频道组件 -->
        <CreateRoom @close="shiftCreateRoomVisual" v-if="createRoomVisual"></CreateRoom>
        <!-- 搜索频道组件 -->
        <SearchRoom @close="shiftSearchRoomVisual" v-if="searchRoomVisual"></SearchRoom>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import CreateRoom from "./CreateRoom.vue"
import SearchRoom from "./SearchRoom.vue"
import ManagedRoom from "./ManagedRoom.vue";
import JoinedRoom from "./JoinedRoom.vue"
import Personal from "./Personal.vue"
import { storeOfChatRoom } from "../../store/chatRoom"
const chatRoomStore = storeOfChatRoom()
// 创建频道窗口显示
let createRoomVisual = ref(false)
// 搜索频道窗口显示
let searchRoomVisual = ref(false)
// 切换显示窗口
function shiftCreateRoomVisual(bool) {
    createRoomVisual.value = bool
}
// 切换搜索窗口显示
function shiftSearchRoomVisual(bool) {
    searchRoomVisual.value = bool
}
</script>

<style lang="less" scoped>
.chat_room_list {
    background-color: #2B2D31;
    width: 250px;
    height: 100%;

    .room_bgimg {
        width: 100%;
        height: 150px;
        background-color: white;
        background-image: url("../../assets/img/chatroombg.jpg");
        /* 背景图垂直、水平均居中 */
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        // background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;

        .room_name {
            position: relative;
            top: 10px;
            left: 20px;
            font-size: 22px;
            color: white;
            font-family: "黑体";
            letter-spacing: 5px;
        }
    }

    .bar {
        width: 90%;
        height: 30px;
        margin: 0 auto;
        margin-top: 10px;
        color: #bfbfbf;
        line-height: 30px;
        padding-left: 15px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            color: white;
            background-color: #46484a;
        }
    }

    .searchRoom {

        >img {
            vertical-align: middle;
            margin-left: 5px;
            margin-right: 5px;
            height: 20px;
            width: 20px;
        }

        .createRoom {
            display: inline;
            vertical-align: middle;
            float: right;
            width: 30px;
            height: 30px;
            text-align: center;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;

            &:hover {
                background-color: #343637;
                border-left: 1px solid #343637;

            }

            img {
                width: 20px;
                height: 20px;
                margin-top: 5px;
            }
        }
    }

    .hr1 {
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;

        background-color: #3B3D44;
        color: #3B3D44;
        height: 1px;
    }

    .component {
        width: 90%;
        margin: 0 auto;
        min-height: 100px;
        margin-top: 20px;

        .title {
            font-size: 12px;
            color: #949ba4;
            height: 24px;
            line-height: 24px;
        }
    }

}
</style>