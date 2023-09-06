<template>
    <div class="brief_information">

        <div v-if="userStore.currentUser.u_email" class="avatar">
            <img src="../../assets/img/art.jpg">
        </div>
        <div v-if="userStore.currentUser.u_email" style="flex: 1;">
            <div class="nick text" :title="userStore.currentUser.u_nick">
                <div>[</div>
                <div class="overflow">
                    {{ userStore.currentUser.u_nick }}
                </div>
                <div>
                    ]
                </div>
            </div>
            <div class="lv text">
                Lv.{{ userStore.currentUser.u_lv }}
            </div>
            <div class="personage text" @click="toUserInfo()">
                个人信息 >>
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
const userStore = storeOfUser()
const router = useRouter()

// 去登录
function router_login() {
    router.push({
        name: "/login"
    })
}

// 去用户信息界面
function toUserInfo() {
    router.push({
        name: "/userinfo"
    })
}
</script>

<style lang="less" scoped>
.brief_information {
    // 开启flex
    display: flex;
    padding: 10px;

    .avatar {
        height: 85px;
        width: 85px;
        border: 2px solid #ccc;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            height: 80px;
            width: 80px;

        }
    }

    .text {

        height: 30px;
        text-align: center;
    }

    .nick {
        line-height: 30px;
        padding-left: 5px;
        width: 90px;
        cursor: default;
        display: flex;

        .overflow {
            width: 90px;
            /* 强制不换行 */
            white-space: nowrap;
            /* 文字用省略号代替超出的部分 */
            text-overflow: ellipsis;
            /* 匀速溢出内容，隐藏 */
            overflow: hidden;
        }



    }

    .lv {
        line-height: 30px;
    }

    .personage {
        line-height: 30px;
        color: @Theme;
        cursor: pointer;
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