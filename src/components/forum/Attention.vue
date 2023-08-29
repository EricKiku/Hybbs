<template>
    <!-- 关注的分区 -->
    <div class="attention_subzone">
        <div class="title">
            <img src="../../assets/img/following.png">
            <span>关注的分区</span>
        </div>
        <div class="list_subzone scrollbar">
            <div class="list_item" v-for="(item, index) in subzones_attention" :key="item.id">
                <div :href="item.link"><span>{{ item.name }}</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
// 定义一个临时关注分区列表
let subzones_attention = [
    {
        id: 1,
        name: "王者荣耀",
        link: "www"
    },
    {
        id: 2,
        name: "和平精英",
        link: "www"
    },
    {
        id: 3,
        name: "孙笑川",
        link: "www"
    },
    {
        id: 4,
        name: "弱智吧",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    },
    {
        id: 5,
        name: "Vue",
        link: "www"
    }

]
</script>

<style lang="less" scoped>
.attention_subzone {
    height: 230px;
    padding: 10px;


    .title {
        height: 25px;
        line-height: 25px;
        text-align: center;
        width: 100%;
        background-color: @TitleBack;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        img {
            float: left;
        }
    }

    .list_subzone {
        height: 200px;
        width: 100%;
        overflow: auto;
        background-color: #FBF7EA;
        box-shadow:
            0px 0px 10px rgba(0, 0, 0, 0.03),
            0px 0px 80px rgba(0, 0, 0, 0.06);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        .list_item {
            padding: 5px;


            span {
                border-bottom: 1px solid #ccc;
                cursor: pointer;
            }
        }
    }
}
</style>