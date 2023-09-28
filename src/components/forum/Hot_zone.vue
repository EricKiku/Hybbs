<template>
    <!-- 热门分区 -->
    <div class="hot_zone" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
        <div class="hot_zone_title">
            <img src="../../assets/img/hot.png" alt="">
            <span>热门分区</span>
            <div style="flex:1;line-height: 25px;text-align: right;">
                <img @click="refreshZone()" style="vertical-align: middle;cursor: pointer;"
                    src="../../assets/img/refresh2.png" title="点击刷新">
            </div>
        </div>
        <div class="zone_list scrollbar">
            <div class="zone_item" v-for="(item, index) in zoneStore.allZone" :key="index">
                <img @click="ToZoneDetails2(item)" class="zoneIcon" :src="'src/zoneIcon/' + item['z_id'] + '.jpg'"
                    :title="item['z_name']">
                <div class="information">
                    <div class="zone_name" :title="item['z_name']">{{ item['z_name'] }}</div>
                    <div class="zone_number" title="关注">
                        <img src="../../assets/img/followNumber.png">
                        <div>{{ item['z_follows'] }}</div>
                    </div>
                    <div class="zone_number" title="帖子">
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
import { ToZoneDetails2 } from "../../tools/tools"
const zoneStore = storeOfZone()
const router = useRouter()
onMounted(() => {
    // 先去store中找，如果有就不用请求了
    if (zoneStore.allZone.length == 0) {
        refreshZone()
    }

})

// 加载状态
let loadingStatus = ref(false)
// 刷新所有分区
function refreshZone() {
    // 进入加载装填
    loadingStatus.value = true
    getZone().then(res => {
        // 保存所有分区列表
        zoneStore.setAllZone(res.data)

    }).finally(() => {
        // 关闭加载状态
        loadingStatus.value = false
    })
}



// 测试方法
function test(zone) {
    console.log(zone);
}
</script>

<style lang="less" scoped>
.hot_zone {
    width: calc(100% - 10px);
    height: 200px;
    border-radius: 5px;
    padding-top: 10px;
    padding-left: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);

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
            transition: all 0.3s;

            &:hover {
                // outline: 1px solid #545454;
                border-radius: 5px;
                box-shadow:
                    0px 0px 10px rgba(0, 0, 0, 0.06),
                    0px 0px 80px rgba(0, 0, 0, 0.12);
            }

            >img {
                border-radius: 5px;
                height: 72px;
                width: 72px;
                cursor: pointer;
            }

            .information {
                width: 70px;
                padding-left: 5px;

                .zone_name {
                    height: 23px;
                    width: 70px;
                    cursor: default;
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
                    color: #555555;
                    cursor: default;
                    // 开启flex
                    display: flex;
                    vertical-align: middle;

                    img {
                        margin-top: 3px;
                        height: 16px;
                        width: 16px;
                        vertical-align: middle;
                        padding-right: 5px;
                    }
                }
            }
        }
    }
}
</style>