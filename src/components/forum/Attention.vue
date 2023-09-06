<template>
    <!-- 关注的分区 -->
    <div class="attention_subzone">
        <div class="title">
            <img src="../../assets/img/follow.png">
            <span>关注的分区</span>
            <img @click="refreshAttZone()" title="刷新" class="refresh" src="../../assets/img/Refresh.png" alt="">
        </div>
        <div class="list_subzone scrollbar">
            <div class="list_item" v-for="(item, index) in userStore.attentionZones" :key="item['z_id']">
                <div><span @click="toZoneDetails(item['z_id'])" :title="item['z_name']">{{ item['z_name'] }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import { storeOfUser } from "../../store/user"
import { getZone } from "../../api/zoneAPI"
import { TtoZoneDetails } from "../../tools/tools"
import { storeOfZone } from "../../store/zone"
import { useRouter } from "vue-router"
const userStore = storeOfUser()
const zoneStore = storeOfZone()
const router = useRouter()
onMounted(() => {
    getAttentionZone()
})
// 刷新关注分区栏
function refreshAttZone() {
    // 先把store中的关注分区栏设为空数组
    userStore.setAttentionZones([])
    // 在发送请求
    getAttentionZone()
}
// 获取关注分区栏请求方法
function getAttentionZone() {
    let attentionStr = userStore.currentUser.u_att_zone
    let attentionArray = attentionStr.split(",")
    getZone().then(res => {
        if (res.status == 200) {
            // 外层遍历所有分组
            let tempArr = <any>[]
            for (let j = 0; j < attentionArray.length; j++) {
                for (let i = 0; i < res.data.length; i++) {
                    // 内层遍历所有关注字符串
                    if (attentionArray[j] == res.data[i]["z_id"]) {
                        // 获得关注的分区信息，追加到result中
                        tempArr.push(res.data[i])
                    }
                }
            }
            // 把tempArr给result，如果store中有则不赋予，把store中的赋予，让用户手动刷新
            if (!userStore.attentionZones.length) {
                userStore.setAttentionZones(tempArr)
            }

        }
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
        display: flex;
        justify-content: space-between;

        .refresh {
            cursor: pointer;
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