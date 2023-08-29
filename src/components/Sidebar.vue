<template>
    <!-- 侧边栏 -->
    <div class="Sidebar">

        <div class="siderbar_item" @click="SwitchingRoute('forum')">
            <div class="activeStatus" :class="{ active: route.path == '/', unactive: route.path != '/' }"></div>
            <div>
                <img class="img unactive_img" v-show="route.path != '/'" src="../assets/img/forum.png" alt="">
                <img class="img active_img" v-show="route.path == '/'" src="../assets/img/forum-a.png" alt="">
                <!-- <div class="text">
                    论坛
                </div> -->
            </div>
            <div>

            </div>

        </div>
        <div class="siderbar_item" @click="SwitchingRoute('plaza')">
            <div class="activeStatus" :class="{ active: route.path == '/plaza', unactive: route.path != '/plaza' }"></div>
            <div>
                <img v-show="route.path != '/plaza'" src="../assets/img/plaza.png" alt="">
                <img v-show="route.path == '/plaza'" src="../assets/img/plaza-a.png" alt="">
                <!-- <div class="text">
                    广场
                </div> -->
            </div>
            <div>

            </div>

        </div>


    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
// 引入路由
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();
// 创建切换路由方法
function SwitchingRoute(type) {
    console.log(route.path);
    if (type === 'forum') {
        router.push({
            name: "/forum"
        })
    } else if (type === 'plaza') {
        router.push({
            name: "/plaza"
        })
    }
}


</script>

<style lang="less" scoped>
// 激活样式
.active {
    height: 40px;

}

.active_img {
    border-radius: 20%;
}

// 未激活样式
.unactive {
    height: 0px;
}

.unactive_img {
    border-radius: 100%;
}

.Sidebar {
    width: 60px;
    height: 100%;
    background: @OutBackgroundLinear;
    background: @SidBackgroundLinear;

    .siderbar_item {
        // 开启flex
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        cursor: pointer;
        height: 50px;

        .activeStatus {
            width: 4px;
            transition: height 0.2s;
            background-color: #5865F2;
            box-shadow:
                0px 0px 2.2px rgba(0, 0, 0, 0.037),
                0px 0px 5.3px rgba(0, 0, 0, 0.053),
                0px 0px 10px rgba(0, 0, 0, 0.065),
                0px 0px 17.9px rgba(119, 35, 35, 0.077),
                0px 0px 33.4px rgba(0, 0, 0, 0.093),
                0px 0px 80px rgba(0, 0, 0, 0.13);
            border-top-right-radius: 1px;
            border-bottom-right-radius: 1px;
        }

        .img {
            transition: border-radius 1s;
        }

        .text {
            height: 20px;
            text-align: center;
            border: 1px solid #b0b0b0;
            line-height: 20px;
            border-radius: 5px;
        }
    }
}
</style>