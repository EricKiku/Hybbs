<template>
    <div class="myZone">
        <div v-show="props.uId" class="title">TA的分区</div>
        <div v-show="!props.uId" class="title">我的分区</div>
        <!-- <div class="main scrollbar">
            <div class="zone_item" v-for="(item) in myZones" :key="item['z_id']">
                <img @click="toZoneDetails(item['z_id'])" :src="'src/zoneIcon/' + item['z_id'] + '.jpg'">
                <div :title="item['z_name']">{{ item['z_name'] }}</div>
            </div>
        </div> -->
        <div class="zone_attention scrollbar" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0.2)">
            <!-- vfor store中的关注列表 -->
            <div @click="toZoneDetails(item['z_id'])" class="zone_item" v-for="(item) in myZones" :key="item['z_id']">
                <div class="img">
                    <img :src="'src/zoneIcon/' + item['z_id'] + '.jpg'" :alt="item['z_name']" :title="item['z_name']">
                </div>
                <div class="message">
                    <div :title="item['z_name']">{{ item['z_name'] }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { getZone } from "../../api/zoneAPI"
import { TtoZoneDetails } from "../../tools/tools"
const zoneStore = storeOfZone()
const userStore = storeOfUser()

let props = defineProps(["uId"])
let myZones = <any>ref([])
let loadingStatus = ref(false)
onMounted(() => {
    loadingStatus.value = true
    // 获取用户id
    // 判断是看自己的信息还是别人的信息
    let userId
    if (props.uId) {
        userId = props.uId
    } else {
        userId = userStore.get('u_id')
    }
    // 获取所有的分区
    getZone().then(res => {

        let zones = res.data
        // 循环遍历，找出uid是用户id的分区
        for (let i = 0; i < zones.length; i++) {
            if (zones[i]['u_id'] == userId) {
                myZones.value.push(zones[i])
            }
        }
    }).finally(() => loadingStatus.value = false)


})

// z转到分区详情页
function toZoneDetails(z_id) {
    TtoZoneDetails(z_id)
}
</script>

<style lang="less" scoped>
.myZone {
    // height: 150px;
    margin-top: 10px;
    padding-left: 50px;
    margin-right: 50px;

    .title {
        height: 16px;
    }

    .main {
        height: 80px;
        margin-top: 10px;
        width: 100%;
        overflow: auto;
        // border: 1px dotted #ccc;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;

        .zone_item {
            padding: 10px;
            height: 80px;
            width: 80px;
            cursor: pointer;
            padding: 5px;
            padding-bottom: 0px;
            border-radius: 7px;
            text-align: center;

            &:hover {
                cursor: pointer;
            }

            img {

                height: 40px;
                width: 40px;
                border: 1px solid #ccc;
                padding: 5px;
            }

            >div {
                text-align: center;
                font-size: 14px;
                width: 52px;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
                cursor: default;
            }
        }
    }

    .zone_attention {
        display: flex;
        height: 80px;
        flex-wrap: wrap;
        padding: 10px;
        // border: 1px dotted #ccc;
        overflow: auto;

        .zone_item {
            height: 80px;
            width: 80px;
            cursor: pointer;
            padding: 5px;
            padding-bottom: 0px;
            border-radius: 7px;


            .img {
                text-align: center;

                img {
                    height: 40px;
                    width: 40px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    padding: 5px;
                }
            }


            .message {
                >div {
                    text-align: center;
                    margin: 0 auto;
                    width: 52px;
                    font-size: 14px;
                    /* 强制不换行 */
                    white-space: nowrap;
                    /* 文字用省略号代替超出的部分 */
                    text-overflow: ellipsis;
                    /* 匀速溢出内容，隐藏 */
                    overflow: hidden;
                }


            }
        }
    }
}
</style>