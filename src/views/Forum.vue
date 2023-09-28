<template>
    <div class="forum">
        <!-- 标题组件 -->
        <Header></Header>
        <div class="main">

            <div class="left_userInfo">

                <!-- 个人信息组件 -->
                <Brief_information></Brief_information>
                <!-- 关注分区列表组件 -->
                <Attention></Attention>

                <!-- 最新帖子 -->
                <Newest></Newest>

            </div>
            <div class="right_subzone">

                <!-- 热门分区组件 -->
                <Hot_zone></Hot_zone>
                <!-- 热议贴 -->
                <Hot_post></Hot_post>

            </div>
            <!-- 公告板 -->
            <div class="friend_list">
                <FriendList></FriendList>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { Search, Link } from '@element-plus/icons-vue'
import { loginByid } from "../api/loginAPI"
import { storeOfUser } from "../store/user"
import FriendList from "../components/forum/FriendList.vue"

const userStore = storeOfUser()
// 自动登录
onMounted(() => {


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
// 热门分区组件
import Hot_zone from "../components/forum/Hot_zone.vue"
// 热门帖子组件
import Hot_post from "../components/forum/Hot_post.vue"
// 最新帖子组件
import Newest from "../components/forum/Newest.vue"


// left_userInfo >>


// 定义新帖子列表

// left_userInfo <<

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
        height: calc(100% - 60px);

        background-image: url("../assets/img/hot_zone_bg.jpg");
        /* 背景图垂直、水平均居中 */
        background-position: center center;
        /* 背景图不平铺 */
        background-repeat: no-repeat;
        /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
        background-attachment: fixed;
        /* 让背景图基于容器大小伸缩 */
        background-size: cover;
        background-color: white;

        .left_userInfo {
            width: 200px;
            height: 100%;
            // background: @LeftListLinear;
            // background: @LeftListLinear2;
            background-color: rgba(255, 255, 255, 0.5);



        }


        .right_subzone {
            flex: 1;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.5);


        }

        .friend_list {
            width: 160px;
            height: 100%;
            border: 1px solid #ccc;
        }
    }
}
</style>