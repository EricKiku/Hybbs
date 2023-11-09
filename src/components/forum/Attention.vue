<template>
    <!-- 关注的分区 -->
    <div class="attention_subzone">
        <div class="hr"></div>
        <div class="outside">
            <div class="title">
                <span>关注的分区</span>
                <img @click="refreshAttZone()" title="刷新" class="refresh" src="../../assets/img/Refresh.png" alt="">
            </div>
            <div class="list_subzone scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
                <div class="list_item" @click="toZoneDetails(item['z_id'])" v-for="(item) in userStore.attentionZones"
                    :key="item['z_id']">
                    <div class="hidden">
                        <span :title="item['z_name']">
                            {{ item['z_name'] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import { storeOfUser } from "../../store/user"
import { getZone } from "../../api/zoneAPI"
import { TtoZoneDetails, UpdateAttentions } from "../../tools/tools"
import { storeOfZone } from "../../store/zone"
import { useRouter } from "vue-router"
import { storeOfStatus } from "../../store/status"
const userStore = storeOfUser()
const zoneStore = storeOfZone()
const router = useRouter()
const statusStore = storeOfStatus()
onMounted(() => {
    getAttentionZone()
})
// 加载状态
let loadingStatus = ref(false)
// 刷新关注分区栏
function refreshAttZone() {

    // 先把store中的关注分区栏设为空数组
    userStore.setAttentionZones([])
    // 在发送请求
    getAttentionZone()
}
// 获取关注分区栏请求方法
function getAttentionZone() {
    // 进入加载状态
    console.log('loading...');

    loadingStatus.value = true;
    // 使用关注分区字符串更新关注分区列表
    UpdateAttentions()
    // 监听statusStore
    let timer = setInterval(() => {
        if (statusStore.getLoadingSuccess()) {
            // 关闭加载状态，把store值设为false，关闭计时器
            loadingStatus.value = false
            statusStore.setLoadingSuccess(false)
            clearInterval(timer)
        }
    }, 100);
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
.attention_subzone {
    height: 230px;
    // height: calc(100% - 40px);
    padding: 10px;
    background-color: rgba(255, 255, 255, .8);
    .hr {
        height: 1px;
        background-color: #ccc;
        margin-bottom: 15px;
    }

    .title {
        height: 20px;
        line-height: 20px;
        text-align: center;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .refresh {
            cursor: pointer;
        }
    }

    .outside {
        border-radius: 10px;

    }

    .list_subzone {
        height: 200px;
        width: 100%;
        overflow: auto;


        .list_item {
            padding: 5px;
            cursor: pointer;
            margin-top: 5px;
            z-index: 1;
            position: relative;
            font-size: inherit;
            font-family: inherit;
            color: #5865f5;
            // padding: 0.5em 1em;
            outline: none;
            border: none;
            // background-color: hsl(237, 55%, 86%);
            overflow: hidden;
            transition: color 0.4s ease-in-out;
            border-radius: 5px;

            &:hover {
                border-radius: 5px;
                // background-color: white;
                color: white;

                &::before {
                    transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
                }
            }

            &::before {
                content: '';
                z-index: -1;
                position: absolute;
                top: 100%;
                right: 100%;
                width: 1em;
                height: 1em;
                border-radius: 50%;
                background-color: #5865f5;
                transform-origin: center;
                transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
                transition: transform 0.45s ease-in-out;
            }

            .hidden {
                max-width: 135px;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
            }

            span {}
        }
    }
}
</style>