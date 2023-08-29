<template>
    <div class="hot_post scrollbar">
        <div class="post_item" v-for="(item, index) in hot_post" :key="index">
            <div class="post_item_zone">
                <img src="../../assets/img/zone.png">
                <span title="分区">{{ item.zone }}</span>
            </div>
            <div class="post_item_title">
                <span>
                    {{ item.title }}
                    <span class="post_item_comment">
                        {{ item.comment }}
                    </span>
                </span>

            </div>

            <div class="post_item_content">
                {{ item.content }}
            </div>
            <div style="display: flex;margin-top: 10px;">
                <div class="post_item_user post_item_info">
                    <div style="height: 16px;">
                        <img src="../../assets/img/user.png" alt="">
                    </div>
                    <span>{{ item.user }}</span>
                </div>
                <div class="post_item_date post_item_info">
                    <div style="height: 16px;">
                        <img src="../../assets/img/date.png" alt="">
                    </div>
                    <span>{{ item.date }}</span>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
// hot post >>

// 定义热门帖子
let hot_post = [
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
    {
        post_id: 1,
        zone: "王者荣耀",
        title: "王者荣耀新英雄即将登场...",
        content: "王者荣耀新英雄，可以",
        user: "EricKiku",
        date: "2023-08-04",
        comment: "0"
    },
]

// hot post <<
</script>

<style lang="less" scoped>
.hot_post {
    height: 470px;
    width: 100%;
    margin-top: 20px;
    border: 1px solid #ccc;
    overflow: auto;

    .post_item {
        padding: 10px;

        .post_item_zone {

            height: 18px;

            span {
                cursor: pointer;

                &:hover {
                    border-bottom: 1px solid #000;
                }
            }

        }

        .post_item_title {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 20px;
            line-height: 18px;

            >span {
                color: @Theme;
                cursor: pointer;

                >span {
                    color: red;
                }

                &:hover {
                    border-bottom: 1px solid @Theme;
                }
            }
        }

        .post_item_comment {
            font-size: 14px;
        }

        .post_item_content {
            font-size: 16px;
        }

        .post_item_info {
            font-size: 14px;
            color: #b4b4b4;
            // 开启flex
            display: flex;

            img {
                margin-top: 1px;
            }
        }

        .post_item_user>span {
            cursor: pointer;
            line-height: 18px;

            &:hover {
                border-bottom: 1px solid #b4b4b4;
            }
        }

        .post_item_date {
            margin-left: 10px;

            >span {
                line-height: 18px;
            }
        }
    }
}
</style>