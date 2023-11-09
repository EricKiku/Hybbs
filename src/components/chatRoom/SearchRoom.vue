<template>
    <div class="searchRoom">
        <div class="close">
            <img @click="close" src="../../assets/img/closeCreateRoom.png" alt="">
        </div>
        <div class="searchInput">
            <input @keyup.enter="search" v-model="searchInput" type="text" placeholder="在此输入频道名。以回车键开始搜索">
        </div>
        <div class="searchRes">
            <div class="title">搜索结果</div>
            <div class="roomList scrollbar">
                <div class="roomItem" v-for="(room) in searchResult" :key="room['r_id']">
                    <span>{{ room['r_name'] }}</span>
                    <span style="color: #9f9f9f;">{{ room['r_create_date'] }}</span>
                    <span><button @click="applyJoin(room['r_create_user'])">申请加入</button></span>
                </div>
                <div v-show="searchComp && !searchResult">
                    <div class="noRes">{{ '没有结果' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { searchRoomApi, applyJoinRoomApi } from "../../api/roomAPI"
import { storeOfUser } from "../../store/user"
import {getCurrentDate} from "../../tools/date"
const userStore = storeOfUser()
let emits = defineEmits(['close'])
// 搜索关键字
let searchInput = ref("")
// 搜索结果
let searchResult = ref([])
// 是否搜索完成
let searchComp = ref(false)
// 回车开始搜索
function search() {
    searchComp.value = false
    // 判断有没有值
    if (searchInput.value) {
        searchRoomApi(searchInput.value).then(res => {
            if (res.status == 200) {
                searchResult.value = res.data
            }
        }).finally(() => { searchComp.value = true })
    }
}

// 申请加入
function applyJoin(r_create_user) {
    let u_id = userStore.get("u_id")
    applyJoinRoomApi(u_id, r_create_user,getCurrentDate()).then(res => {
        console.log(res);
    })
}


// 关闭
function close() {
    emits("close", false)
}
</script>

<style lang="less" scoped>
.searchRoom {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 400px;
    width: 500px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;

    .close {
        text-align: right;

        img {
            cursor: pointer;
        }
    }

    .searchInput {
        width: calc(100% - 14px);
        height: 50px;
        border: 2px solid #717171;
        padding: 5px;
        border-radius: 5px;
        // margin-top: 20px;

        input {
            border: none;
            outline: none;
            padding: 5px;
            background-color: #717171;
            font-size: 18px;
            border-radius: 5px;
            width: calc(100% - 15px);
            height: calc(100% - 10px);
            color: white;
            letter-spacing: 2px;
            padding-left: 10px;
        }

        input[type='text']::-webkit-input-placeholder {
            color: rgb(209, 209, 209);
        }
    }

    .searchRes {
        width: 100%;
        height: 290px;
        margin-top: 10px;

        .title {
            font-size: 16px;
            color: #949ba4;
            margin-left: 20px;
        }

        .roomList {
            overflow: auto;

            .roomItem {
                height: 50px;
                width: calc(100% - 40px);
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                padding-left: 20px;
                padding-right: 20px;
                cursor: pointer;
                border-radius: 5px;
                user-select: none;
                margin-top: 10px;
                margin-bottom: 10px;

                &:hover {
                    background-color: #c9c9c9;
                }

                button {
                    width: 85px;
                    height: 25px;
                    border: none;
                    background-color: #5865f5;
                    color: white;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
            .noRes{
                
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                color: #717171;
            }
        }
    }
}
</style>