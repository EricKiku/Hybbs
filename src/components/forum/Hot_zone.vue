<template>
    <!-- 热门分区 -->
    <div class="hot_zone">
        <div class="hot_zone_title">
            <img src="../../assets/img/hot.png" alt="">
            <span>热门分区</span>
        </div>
        <div class="zone_list scrollbar">
            <div class="zone_item" v-for="(item, index) in hot_zone" :key="index">
                <img :src="item.zoneIcon" :title="item.zoneName">
                <div class="information">
                    <div class="zone_name">{{ item.zoneName }}</div>
                    <div class="zone_number">
                        <img src="../../assets/img/followNumber.png">
                        <div>{{ item.zoneFollowNumber }}</div>
                    </div>
                    <div class="zone_number">
                        <img src="../../assets/img/posts.png">
                        <div>
                            {{ item.zonePostsNumber }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
// hot zone >>
// 定义热门分区列表
let hot_zone = [
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },
    {
        zoneId: 1,
        zoneName: "王者荣耀",
        zoneIcon: "src/assets/img/wzry.jpg",
        zoneFollowNumber: 1521,
        zonePostsNumber: 3000
    },

]

// hot zone <<
</script>

<style lang="less" scoped>
.hot_zone {
    width: calc(100% - 10px);
    height: 200px;
    border: 1px solid #e3e3e3;
    padding-top: 10px;
    padding-left: 10px;

    .hot_zone_title {
        height: 25px;
        display: flex;
        padding-right: 10px;

        span {
            line-height: 25px;
        }

        .paging {
            flex: 1;
            line-height: 25px;
            display: flex;
            justify-content: center;

            .page {
                color: #949494;

                .currentPg {
                    font-size: 18px;
                }
            }

            .PageTurningBtn {
                height: 15px;
                width: 15px;
                margin-top: 5px;
                border-radius: 7.5px;
                background-color: #E9E8EB;
                cursor: pointer;

                img {
                    margin-bottom: 4px;
                }
            }
        }
    }

    .zone_list {
        height: calc(100% - 35px);
        width: calc(100% - 10px);
        // 开启flex
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        padding-top: 5px;

        // 修改滚动条样式


        .zone_item {
            height: 72px;
            margin: 5px;
            display: flex;
            cursor: pointer;

            >img {
                border-radius: 5px;
            }

            .information {
                width: 70px;
                padding-left: 5px;

                .zone_name {
                    height: 23px;
                    line-height: 23px;
                }

                .zone_number {
                    height: 23px;
                    line-height: 23px;
                    color: #bfbfbf;
                    cursor: pointer;
                    // 开启flex
                    display: flex;

                    img {
                        margin-top: 1px;
                    }
                }
            }
        }
    }
}
</style>