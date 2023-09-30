<template>
    <div class="friend_list" @click="bgClick()">
        <!-- 右键菜单 -->
        <RightClickMenu :x="positionX" :y="positionY" v-show="rightClickMenuVisual"></RightClickMenu>
        <div class="searchUser">
            <div style="font-size: 14px;">查找用户</div>
            <div style="display: flex;">
                <input>
                <button>搜索</button>
            </div>
        </div>
        <hr>
        <div class="list scrollbar" :style="{ height: extendFriendList ? '500px' : '22px' }">
            <div class="friendTitle" @click="extendShift">
                好友
                <img src="../../assets/img/xiala.png" alt="">
            </div>
            <div v-show="showFriendItem">
                <div class="friend_item" @click="openChatWindow(friend)" @contextmenu.prevent="openRightClickMenu"
                    v-for="(friend) in friend_list" :key="friend['u_id']">
                    <div class="avatar">
                        <img src="../../assets/img/art.jpg">
                    </div>
                    <div class="msg">
                        <div>
                            {{ friend['u_nick'] }}
                        </div>
                        <div class="status">
                            <!-- <img src="../../assets/img/online.png"><span>在线</span> -->
                            <!-- <img src="../../assets/img/noonline.png"><span>离线</span> -->
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getFriendListApi } from "../../api/userAPI"
import { storeOfUser } from "../../store/user"
import { storeOfChat } from "../../store/chat"
import RightClickMenu from "../RightClickMenu.vue"
const userStore = storeOfUser()
const chatStore = storeOfChat()

onMounted(() => {
    let attStr = userStore.get("u_attention").split(",")

    attStr.splice(0, 1)
    getFriendFn(JSON.stringify(attStr))
})


// 好友列表
let friend_list = ref([])

// 获取好友列表方法
function getFriendFn(attStr) {
    getFriendListApi(attStr).then(res => {
        console.log(res);
        if (res.status == 200) {
            friend_list.value = res.data
        }
    })
}
// 是否展开好友列表
let extendFriendList = ref(false)
// 是否显示好友
let showFriendItem = ref(false)
// 展开
function extendShift() {
    extendFriendList.value = !extendFriendList.value
    if (extendFriendList.value) {
        setTimeout(() => {
            showFriendItem.value = true
        }, 250);
    } else {
        showFriendItem.value = false
    }
}

// \背景点击方法
function bgClick() {
    rightClickMenuVisual.value = false
}

// 打开聊天窗口
function openChatWindow(user) {
    chatStore.open(user)
}
// 右键菜单是否显示(失败)
let rightClickMenuVisual = ref(false)
// 右击方法
let positionX = ref(0)
let positionY = ref(0)
function openRightClickMenu(e) {
    rightClickMenuVisual.value = true
    positionX.value = e.x
    positionY.value = e.y
}
</script>

<style lang="less" scoped>
.friend_list {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .8);

    .searchUser {
        padding: 5px;
        margin: 5px;

        input {
            width: 60%;
            border: none;
            outline: none;
            border: 0.5px solid #5865f5;
            border-right: none;
        }

        button {
            width: 40%;
            border: 0.5px solid #5865f5;
            border-left: none;
            cursor: pointer;

            &:hover {
                background-color: #5865f5;
                color: white;

            }
        }
    }

    .list {
        background-color: white;
        height: 22px;
        transition: height 0.3s;
        overflow: auto;

        .friendTitle {
            height: 20px;
            line-height: 20px;
            background-color: rgb(255, 255, 255);
            border: 1px solid #ccc;
            padding-left: 10px;
            cursor: pointer;

            img {
                vertical-align: middle;
                float: right;
                margin-right: 10px;
            }
        }

        .friend_item {
            font-size: 12px;
            height: 30px;
            // margin: 2px;
            // margin-bottom: 5px;
            padding: 5px;
            // background-color: #e7e7e7;
            // border-radius: 5px;
            border-bottom: 0.5px solid #ececec;
            cursor: pointer;
            display: flex;

            &:hover {
                background-color: #ececec;
            }

            .avatar {
                img {
                    height: 30px;
                    width: 30px;
                    border-radius: 3px;
                }

            }

            .msg {
                padding-left: 5px;
                max-width: 120px;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;

                .status {
                    margin-top: 4px;
                    color: #ccc;

                    img {
                        height: 10px;
                        width: 10px;
                    }
                }

            }
        }
    }
}
</style>