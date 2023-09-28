<template>
    <!-- 关注的分区 -->
    <div class="attention_subzone">
        <div class="outside">
            <div class="title">
                <img src="../../assets/img/follow.png">
                <span>关注的分区</span>
                <img @click="refreshAttZone()" title="刷新" class="refresh" src="../../assets/img/Refresh.png" alt="">
            </div>
            <div class="list_subzone scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
                <div class="list_item" v-for="(item, index) in userStore.attentionZones" :key="item['z_id']">
                    <div><span @click="toZoneDetails(item['z_id'])" :title="item['z_name']">{{ item['z_name'] }}</span>
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
    padding: 10px;
    background-color: rgba(255, 255, 255, .8);


    .title {
        height: 25px;
        line-height: 25px;
        text-align: center;
        width: 100%;
        background-color: @TitleBack;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        justify-content: space-between;

        .refresh {
            cursor: pointer;
        }
    }

    .outside {
        box-shadow:
            0px 0px 10px rgba(0, 0, 0, 0.06),
            0px 0px 20px rgba(0, 0, 0, 0.12);
        border-radius: 10px;
    }

    .list_subzone {
        height: 200px;
        width: 100%;
        overflow: auto;
        background-color: #FBF7EA;

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