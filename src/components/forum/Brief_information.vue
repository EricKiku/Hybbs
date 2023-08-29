<template>
    <div class="brief_information">
        <div class="avatar">
            <img src="../../assets/img/art.jpg">
        </div>
        <div style="flex: 1;">
            <div class="nick text">
                [{{ 'EricKiku' }}]
            </div>
            <div class="lv text">
                Lv.{{ '0' }}
            </div>
            <div class="personage text">
                个人信息 >>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

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
            cursor: pointer;
            transition: all 0.1s;

            &:hover {
                width: 82px;
                height: 82px;
            }
        }
    }

    .text {

        height: 30px;
        text-align: center;
    }

    .nick {
        line-height: 30px;
    }

    .lv {
        line-height: 30px;
    }

    .personage {
        line-height: 30px;
        color: @Theme;
        cursor: pointer;
    }
}
</style>