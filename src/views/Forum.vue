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


                <div class="newest_post">
                    <div class="title">
                        <img src="../assets/img/newest.png" alt="">
                        最新帖子
                    </div>
                    <div class="post_list scrollbar">
                        <div class="list_item" v-for="(item, index) in newest_post" :key="index">
                            {{ item }}<br>{{ item }}<br>{{ item }}<br>{{ item }}<br>
                            {{ item }}<br>{{ item }}<br>{{ item }}<br>{{ item }}<br>
                            {{ item }}<br>{{ item }}<br>{{ item }}<br>{{ item }}<br>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_subzone">

                <!-- 热门分区组件 -->
                <Hot_zone></Hot_zone>
                <!-- 热议贴 -->
                <Hot_post></Hot_post>

            </div>
            <!-- 公告板 -->
            <div class="call_board">
                公告板
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { Search, Link } from '@element-plus/icons-vue'
import { loginByid } from "../api/loginAPI"
import { storeOfUser } from "../store/user"
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



// left_userInfo >>


// 定义新帖子列表
let newest_post = ['新帖子1号', '新帖子1号', '新帖子1号', '新帖子1号',]
// left_userInfo <<

</script>

<style lang="less" scoped>
.forum {
    width: 100%;
    background-color: white;
    // 左侧阴影
    // box-shadow: -6px 3px 8px -5px rgb(135, 135, 135);
    border-top-left-radius: 10px;



    .main {
        // 开启flex
        display: flex;
        height: calc(100% - 60px);

        .left_userInfo {
            width: 200px;
            height: 100%;
            background: @LeftListLinear;
            background: @LeftListLinear2;

            .newest_post {
                padding: 10px;

                .title {
                    color: #7c7c7c;
                }

                .post_list {
                    overflow: auto;
                    height: 290px;
                    width: 100%;
                }
            }
        }


        .right_subzone {
            flex: 1;
            padding: 10px;
            background-color: @MainBack;
        }

        .call_board {
            width: 150px;
            height: 100%;
            border: 1px solid #ccc;
        }
    }
}
</style>