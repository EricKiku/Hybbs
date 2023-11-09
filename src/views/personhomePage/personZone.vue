<template>
    <div class="zones">
        <div class="zone" v-for="(zone) in zones" :key="zone['z_id']" @click="routerToZoneDetail(zone['z_id'])">
            <div class="top">
                <img :src="apiStore.getBaseUrl() + apiStore.getPort() + zone['z_icon']" alt="">
                <div class="name">{{ zone['z_name'] }} </div>
            </div>
            <div class="bottom">
                <img src="../../assets/img/personZonePostIco.png" alt="" title="帖子数量">
                <div class="posts">{{ zone['z_posts'] }}</div>
                <img src="../../assets/img/personZoneFollowIco.png" alt="" title="关注数量">
                <div class="follows">{{ zone['z_follows'] }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { zonesByUIdApi } from "../../api/zoneAPI"
import { useRouter, useRoute } from "vue-router"
import { storeOfApi } from "../../store/api";
const route = useRoute()
const router = useRouter()
const apiStore = storeOfApi()
// 分区列表
let zones = ref([])
onMounted(() => {
    if (!route.query.uid) {
        router.go(-1)
    } else {
        zonesByUIdApi(route.query.uid).then(res => {
            console.log("zoneshp:", res.data);
            if (res.status == 200) {
                zones.value = res.data
            } else {
                zones.value = []
            }
        })
    }
})
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
.zones {
    display: flex;
    flex-wrap: wrap;

    .zone {
        border-radius: 10px;
        background-color: white;
        margin: 10px 10px;
        padding: 10px;
        box-sizing: border-box;
        width: fit-content;
        border: 3px solid white;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            border: 3px solid #489AFF;
        }

        .top {
            display: flex;
            height: 60px;

            img {
                height: 60px;
                width: 60px;
                border-radius: 5px;
            }

            .name {
                line-height: 60px;
                font-size: 20px;
                font-weight: bold;
                color: #676a79;
                padding: 0px 20px;
            }
        }

        .bottom {
            display: flex;
            height: 30px;
            margin: 10px 0px;

            img {
                height: 30px;
                width: 30px;
            }

            .posts,
            .follows {
                font-size: 16px;
                font-style: italic;
                color: #489AFF;
                height: 20px;
                // width: 20px;
                padding: 0px 10px;
                text-align: center;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                line-height: 20px;
                border-radius: 5px;
                font-weight: bold;
            }

            .follows {
                color: #d4237a;
            }
        }

    }
}
</style>