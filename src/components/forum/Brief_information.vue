<template>
    <div class="brief_information">
        <div class="top_bg"></div>
        <div v-if="userStore.currentUser.u_email" class="avatar">
            <img @click="zoneStore.setPicturePreviewPath(apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar'))"
                :src="apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar')">
        </div>
        <div class="nick">{{ userStore.currentUser.u_nick }}<span>{{ userStore.currentUser.u_lv }}</span></div>
        <div class="self_introduct">
            {{ '个人简介个人简介个人简介个人简介' }}
        </div>
        <div class="message">
            <div class="post">
                <div class="value">
                    {{ userStore.get('posts') }}
                </div>
                <div class="text">
                    帖子数
                </div>
            </div>
            <div class="follow">
                <div class="value">
                    {{ userStore.get('u_attention').split(",").length - 1 }}
                </div>
                <div class="text">
                    关注
                </div>
            </div>
            <div class="fensi">
                <div class="value">
                    {{ userStore.get('u_fensi') }}
                </div>
                <div class="text">
                    被关注
                </div>
            </div>
        </div>
        <div class="noLogin" v-if="!userStore.currentUser.u_email">
            未登录<span @click="router_login">去登录-></span>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../../store/user";
import { useRouter } from "vue-router";
import { storeOfApi } from "../../store/api";
import { storeOfZone } from "../../store/zone"
const userStore = storeOfUser()
const apiStore = storeOfApi()
const zoneStore = storeOfZone()
const router = useRouter()

// 去登录
function router_login() {
    router.push({
        name: "/login"
    })
}
</script>

<style lang="less" scoped>
.brief_information {
    height: 210px;

    // 开启flex
    // display: flex;
    // padding: 10px;
    // background-color: rgba(255, 255, 255, .8);
    // height: 60px;
    .top_bg {
        height: 50px;
        background-image: url("../../assets/img/user_top_bg.jpg");
    }

    .avatar {
        height: 64px;
        width: 64px;
        border: 3px solid white;
        margin: 0 auto;
        margin-top: -32px;
        border-radius: 5px;

        img {
            height: 64px;
            width: 64px;
            border-radius: 3px;
        }
    }


    .nick {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-weight: bold;

        span {
            padding: 1px 5px;
            background-color: #489aff;
            color: white;
            font-size: 14px;
            border-radius: 3px;
            font-style: italic;
        }
    }

    .self_introduct {
        text-align: center;
        font-size: 14px;
        color: #676a69;
        padding: 5px 15px;
    }

    .lv {
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding: 5px 15px;
        text-align: center;
    }

    .message {
        height: 50px;
        display: flex;

        >div {
            flex: 1;

            >div {
                height: 25px;
                line-height: 25px;
                text-align: center;
            }

            .value {
                font-weight: bold;
            }

            .text {
                color: #676a79;
                font-size: 14px;
            }
        }

        .post {
            box-sizing: border-box;
            border-right: 1px solid rgba(103, 106, 121, 0.25);
        }

        .fensi {
            box-sizing: border-box;
            border-left: 1px solid rgba(103, 106, 121, 0.25);
        }
    }

    .noLogin {
        text-align: center;
        width: 100%;

        span {
            color: #5865F2;
            cursor: pointer;

            &:hover {
                border-bottom: 1px solid #5865F2;
            }
        }
    }
}
</style>