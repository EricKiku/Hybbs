<template>
    <picturePreview v-show="zoneStore.getPicturePreviewPath()" :imgPath="zoneStore.getPicturePreviewPath()">
    </picturePreview>
    <div class="forum">
        <!-- 标题组件 -->
        <Header></Header>
        <div class="main scrollbar">

            <div class="left_userInfo">

                <!-- 个人信息组件 -->
                <Brief_information></Brief_information>
                <!-- 关注分区列表组件 -->
                <Attention></Attention>
                <!-- 最新帖子 -->
                <!-- <Newest></Newest> -->
                <div class="information">
                    <span @click="toUserInfo(userStore.get('u_id'))">个人主页</span>
                </div>

            </div>
            <div class="right_subzone">
                <router-view v-slot="{ Component }">
                    <keep-alive :include="['Hot_post', 'PostDetails']">
                        <component :is="Component" :key="route.name" v-if="route.meta.keepAlive"></component>
                    </keep-alive>
                </router-view>
                <!-- <router-view></router-view> -->

            </div>
            <!-- 公告板 -->
            <div class="friend_list">
                <ZoneList></ZoneList>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onActivated, onDeactivated } from "vue"
import { Search, Link } from '@element-plus/icons-vue'
import { loginByid } from "../api/loginAPI"
import { storeOfUser } from "../store/user"
// import FriendList from "../components/forum/FriendList.vue"
import ZoneList from "../components/ZoneList.vue"
import picturePreview from "../components/picturePreview.vue"
import { storeOfZone } from "../store/zone"
import { useRouter, useRoute } from "vue-router"
const userStore = storeOfUser()
const zoneStore = storeOfZone()
const router = useRouter()
const route = useRoute()
// 自动登录
onMounted(() => {
    console.log("onmounted");
    if (localStorage.getItem("user_id") && !userStore.currentUser.u_id) {
        let id = localStorage.getItem("user_id")
        loginByid(id).then(res => {
            userStore.setCurrentUser(res.data)
        })
    }
})
// Head组件
import Header from "../components/forum/Head.vue"
// Brief_information组件
import Brief_information from "../components/forum/Brief_information.vue";
// 关注组件
import Attention from "../components/forum/Attention.vue"


// 去个人主页
function toUserInfo(uid) {
    router.push({
        name: "personhp",
        query: {
            uid
        }
    })
}
</script>

<style lang="less" scoped>
.forum {
    width: 100%;
    background-color: white;
    // 左侧阴影
    // box-shadow: -6px 3px 8px -5px rgb(135, 135, 135);
    border-top-left-radius: 10px;

    overflow: hidden;

    .main {
        // 开启flex
        display: flex;
        justify-content: center;
        height: calc(100% - 60px);
        // overflow: auto;
        background-color: #EFF2F6;
        padding: 20px;
        background-image: url("../assets/img/postsbg.jpg");
        /* 背景图垂直、水平均居中 */
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;
        /* 设置背景颜色，背景图加载过程中会显示背景色 */
        background-color: white;

        .left_userInfo {
            width: 250px;
            height: 500px;
            border: 1px solid rgba(0, 0, 0, 0.09);
            background-color: white;
            overflow: hidden;
            border-radius: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: left;

            .information {
                height: 40px;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
                border-top: 1px solid #ccc;
                line-height: 40px;

                span {
                    color: #0f6fec;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: bold;
                }
            }
        }


        .right_subzone {
            width: 600px;
            height: calc(100vh - 90px);
            margin: 0px 20px;
        }

        .friend_list {
            width: 250px;
            height: 100%;
            // background-color: white;
        }
    }
}
</style>