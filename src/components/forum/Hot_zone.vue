<template>
    <!-- 热门分区 -->
    <div class="hot_zone">
        <div class="hot_zone_title">
            <img src="../../assets/img/hot.png" alt="">
            <span>热门分区</span>
        </div>
        <div class="zone_list scrollbar">
            <div @click="toZoneDetails(item['z_id'])" class="zone_item" v-for="(item, index) in zoneStore.allZone"
                :key="index">
                <img class="zoneIcon" :src="'src/zoneIcon/' + item['z_id'] + '.jpg'" :title="item['z_name']">
                <div class="information">
                    <div class="zone_name">{{ item['z_name'] }}</div>
                    <div class="zone_number">
                        <img src="../../assets/img/followNumber.png">
                        <div>{{ item['z_follows'] }}</div>
                    </div>
                    <div class="zone_number">
                        <img src="../../assets/img/posts.png">
                        <div>
                            {{ item['z_posts'] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getZone } from "../../api/zoneAPI"
import { storeOfZone } from "../../store/zone"
import { useRouter } from "vue-router"
const zoneStore = storeOfZone()
const router = useRouter()
onMounted(() => {
    // 先去store中找，如果有就不用请求了
    if (zoneStore.allZone.length == 0) {
        refreshZone()
    }

})

// 刷新所有分区
function refreshZone() {
    getZone().then(res => {
        // 保存所有分区列表
        zoneStore.setAllZone(res.data)
    })
}

// 点击分区跳转到详情页
function toZoneDetails(z_id) {
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }

}
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

            &:hover {
                outline: 1px solid #ccc;
                border-radius: 5px;
            }

            >img {
                border-radius: 5px;
                height: 72px;
                width: 72px;
            }

            .information {
                width: 70px;
                padding-left: 5px;

                .zone_name {
                    height: 23px;
                    width: 70px;
                    /* 强制不换行 */
                    white-space: nowrap;
                    /* 文字用省略号代替超出的部分 */
                    text-overflow: ellipsis;
                    /* 匀速溢出内容，隐藏 */
                    overflow: hidden;
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