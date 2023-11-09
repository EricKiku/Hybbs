<template>
    <div class="zonelist scrollbar">
        <div class="title">
            <img src="../assets/img/paihangbang.png" alt="">
            <div>
                分区排行
            </div>
        </div>
        <div @click="routerToZoneDetail(zone['z_id'])" class="zone" v-for="(zone) in zones" :key="zone['z_id']">
            <img :src="apiStore.getBaseUrl() + apiStore.getPort() + zone['z_icon']" alt="">
            <div class="name">
                <div class="z_name">{{ zone['z_name'] }}</div>
                <div class="message">帖子个数: <span>{{ zone['z_posts'] }}</span> </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getZone } from "../api/zoneAPI"
import { storeOfApi } from "../store/api"
import { useRouter } from "vue-router"
const apiStore = storeOfApi()
const router = useRouter()
onMounted(() => {
    allZones()
})
// 所有分区对象
let zones = ref([])
// 获取所有分区
function allZones() {
    getZone().then(res => {
        if (res.status == 200) {
            zones.value = sortByPosts(res.data)
        } else {
            zones.value = []
        }
    })
}

// 排序方法，按照帖子数量排序
function sortByPosts(array) {
    return array.sort((v1, v2) => {
        if (v1['z_posts'] <= v2['z_posts']) {
            return 1
        } else {
            return -1
        }
    })
}

// 跳转到分区详情
function routerToZoneDetail(zId) {
    router.push({
        name: "zone",
        query: {
            zId
        }
    })
}



</script>

<style lang="less" scoped>
.zonelist {
    width: 250px;
    height: 100%;
    background-color: white;
    height: 500px;
    overflow: auto;
    border-radius: 5px;

    .title {
        height: 40px;
        display: flex;
        padding: 0px 20px;
        border-bottom: 1px solid #ccc;

        img {
            height: 40px;
            width: 40px;
        }

        div {
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            font-weight: bold;
            color: #676A79;
        }
    }

    .zone {
        display: flex;
        height: 60px;
        margin: 5px;
        box-sizing: border-box;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            box-shadow: rgba(96, 96, 255, 0.25) 0px 30px 60px -12px inset, rgba(4, 196, 255, 0.3) 0px 18px 36px -18px inset;
        }

        img {
            height: 50px;
            width: 50px;
            border-radius: 5px;
        }

        .name {
            flex: 1;
            // text-align: center;
            padding: 0px 10px;

            >div {
                height: 25px;
                line-height: 25px;
            }

            .z_name {
                font-size: 20px;
                color: #676A79;
                font-family: "黑体";
            }

            .message {
                font-size: 12px;
                color: #ccc;

                span {
                    font-size: 16px;
                    color: #9b9b9b;
                }
            }
        }
    }
}
</style>