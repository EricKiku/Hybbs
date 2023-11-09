<template>
    <div class="zoneinfo">
        <div class="top_bg"></div>
        <div class="avatar">
            <img @click="zoneStore.setPicturePreviewPath(apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar'))"
                :src="apiStore.getBaseUrl() + apiStore.getPort() + zone['z_icon']">
        </div>
        <div class="name">{{ zone['z_name'] }}</div>
        <div class="introduct">
            {{ zone['z_introduce'] }}
        </div>
        <div class="message">
            <div class="zone">
                <div class="value">
                    {{ zone['z_posts'] }}
                </div>
                <div class="text">
                    帖子数
                </div>
            </div>
            <div class="follow">
                <div class="value">
                    {{ zone['z_follows'] }}
                </div>
                <div class="text">
                    关注
                </div>
            </div>
        </div>
        <div class="more">
            分区详细信息
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfApi } from "../../store/api";
import { storeOfUser } from "../../store/user"
import { storeOfZone } from "../../store/zone"
const apiStore = storeOfApi()
const userStore = storeOfUser()
const zoneStore = storeOfZone()

// 接收props
let props = defineProps(['zone'])
</script>

<style lang="less" scoped>
.zoneinfo {
    // height: 210px;
    width: 250px;
    border: 1px solid rgba(0, 0, 0, 0.09);
    height: fit-content;
    border-radius: 10px;
    overflow: hidden;
    background-color: white;
    // 开启flex
    // display: flex;
    // padding: 10px;
    // background-color: rgba(255, 255, 255, .8);
    // height: 60px;
    .top_bg {
        height: 50px;
        background-image: url("../../assets/img/zonebg.jpg");
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
            background-color: white;
        }
    }


    .name {
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

    .introduct {
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

        .zone {
            box-sizing: border-box;
            border-right: 1px solid rgba(103, 106, 121, 0.25);
        }

        .fensi {
            box-sizing: border-box;
            border-left: 1px solid rgba(103, 106, 121, 0.25);
        }
    }

    .more {
        text-align: center;
        margin: 10px 0px 0px 0px;
        padding: 10px 0px;
        border-top: 1px solid #ccc;
        cursor: pointer;
        color: #489aff;
        transition: all 0.2s;

        &:hover {
            font-weight: bold;
        }
    }
}
</style>