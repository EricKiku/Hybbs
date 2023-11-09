<template>
    <div class="rm">
        <div class="title">
            管理您的频道
        </div>
        <div class="baseInfo">
            <div class="icon">
                <img :src="'http://localhost:1234' + chatRoomStore.getManageChatRoomStats('r_ico')" alt="">
            </div>
            <div class="msg">
                <div class="table">
                    <div class="col">
                        <div class="row1">
                            频道名称
                        </div>
                        <div class="row2">
                            <span>{{ chatRoomStore.getManageChatRoomStats('r_name') }}</span>
                        </div>
                    </div>
                    <div class="hr_col"></div>
                    <div class="col">
                        <div class="row1">
                            <span>频道成员</span>
                        </div>
                        <div class="row2">
                            <span>{{ chatRoomStore.getManageChatRoomStats('r_member') }}</span>
                        </div>
                    </div>
                    <div class="hr_col"></div>
                    <div class="col">
                        <div class="row1">
                            <span>创建时间</span>
                        </div>
                        <div class="row2" style="font-size: 12px;">
                            <span>{{ chatRoomStore.getManageChatRoomStats('r_create_date') }}</span>
                        </div>
                    </div>
                    <div class="hr_col"></div>
                    <div class="col">
                        <div class="row1">
                            <span>是否可搜索</span>
                        </div>
                        <div class="row2">
                            <el-switch @change="switchChange" v-model="searchable" active-text="Yes" inactive-text="No" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hr"></div>
        <div class="member_list">
            <div class="tab">
                <div class="tab_item">
                    <span @click="switchTab('member')" class="content" :class="{ tab_active: tabActive == 'member' }">
                        成员列表
                    </span>
                </div>
                <div class="tab_item">
                    <span @click="switchTab('apply')" class="content" :class="{ tab_active: tabActive == 'apply' }">
                        申请列表
                    </span>
                </div>
            </div>
            <div class="list">
                <div class="a_list scrollbar" v-if="tabActive == 'member'">
                    <div class="a_list_item" v-for="(member) in memberList" :key="member['aj_id']">
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>用户ID</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ member['u_id'] }}</span>
                            </div>
                        </div>
                        <div class="list_col" title="点击查看用户" @click="goToOtherUser(member['u_id'])">
                            <div class="a_list_item_row1">
                                <span>用户昵称</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ member['u_nick'] }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>用户等级</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ member['u_lv'] }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>操作</span>
                            </div>
                            <div class="a_list_item_row2">
                                <button @click="goOutRoom(member['ujr_id'])" class="deny">踢出频道</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="a_list scrollbar" v-if="tabActive == 'apply'">
                    <div class="a_list_item" v-for="(a_member) in applyList" :key="a_member['aj_id']">
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>编号</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ a_member['aj_id'] }}</span>
                            </div>
                        </div>
                        <div class="list_col" title="点击查看用户" @click="goToOtherUser(a_member['u_id'])">
                            <div class="a_list_item_row1">
                                <span>用户昵称</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ a_member['u_nick'] }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>用户等级</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ a_member['u_lv'] }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>申请时间</span>
                            </div>
                            <div class="a_list_item_row2">
                                <span>{{ a_member['a_date'] }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>状态</span>
                            </div>
                            <div class="a_list_item_row2"
                                :style="{ color: a_member['pass_or_not'] == -1 ? 'white' : a_member['pass_or_not'] == 0 ? 'red' : 'green' }">
                                <span>{{ a_member['pass_or_not'] == -1 ? '未处理' : a_member['pass_or_not'] == 0 ? '未通过' :
                                    '已通过' }}</span>
                            </div>
                        </div>
                        <div class="list_col">
                            <div class="a_list_item_row1">
                                <span>操作</span>
                            </div>
                            <div class="a_list_item_row2">
                                <button @click="permitOrDeny(a_member['aj_id'], 1, a_member['u_id'])" class="allow"
                                    v-show="a_member['pass_or_not'] == -1">接受</button>
                                <button @click="permitOrDeny(a_member['aj_id'], 0, a_member['u_id'])" class="deny"
                                    v-show="a_member['pass_or_not'] == -1">拒绝</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { storeOfChatRoom } from "../../store/chatRoom"
import { useRouter, useRoute } from "vue-router"
import { updateStats, getApplyMember, updatePermitOrDeny, getRoomMembers, goOutRoomApi } from "../../api/roomAPI"
import { message, goToOtherUser } from "../../tools/tools"
import { storeOfUser } from "../../store/user"
const router = useRouter()
const route = useRoute()
const chatRoomStore = storeOfChatRoom()
const userStore = storeOfUser()
if (!chatRoomStore.getManageChatRoom()['r_id']) {
    router.go(-1)
}
// 频道是否可搜索
let searchable = ref(chatRoomStore.getManageChatRoomStats('r_searchable') == '1' ? true : false)
// 开关切换方法
function switchChange(bool) {
    // 发送请求
    updateStats(chatRoomStore.getManageChatRoom()['r_id'], "r_searchable", (bool ? 1 : 0) + '').then(res => {
        if (res.status == 200) {
            message(1, "修改成功")
        } else {
            message(2, res['msg'])
            // 失败后要回归原位
            searchable.value = chatRoomStore.getManageChatRoomStats('r_searchable') ? true : false
        }
    })
}
onMounted(() => {
    // 进来先获取频道成员
    refreshRoomMember()
})
// 切换选项卡
let tabActive = ref("member")
// 成员列表
let memberList = ref([])
// 申请列表
let applyList = ref([])
function switchTab(value) {
    tabActive.value = value
    if (value == "member") {
        // 发起请求，获取成员
        refreshRoomMember()
    } else if (value == "apply") {
        // 发起请求,获取申请人
        refreshApplyMember()
    }
}
// 刷新申请人
function refreshApplyMember() {
    let u_id = userStore.get("u_id")
    getApplyMember(u_id).then(res => {
        if (res.status == 200) {
            applyList.value = res.data.reverse()
        }
    })
}
// 刷新频道成员
function refreshRoomMember() {
    getRoomMembers(chatRoomStore.getManageChatRoom()['r_id']).then(res => {
        if (res.status == 200) {
            memberList.value = res.data
        }
    })
}
// 允许按钮
function permitOrDeny(aj_id, value, u_id,) {
    let r_id = chatRoomStore.getManageChatRoom()['r_id'];
    updatePermitOrDeny(aj_id, value, u_id, r_id).then(res => {
        console.log(res);
        if (res.status == 200) {
            refreshApplyMember()
        }
    }).finally(() => { refreshApplyMember() })
}
// 踢出频道
function goOutRoom(ujr_id) {
    goOutRoomApi(ujr_id).then(res => {
        console.log(res);

    }).finally(() => { refreshRoomMember() })
}
</script>

<style lang="less" scoped>
.rm {
    height: 100%;
    width: 100%;

    .title {
        font-family: "黑体";
        font-size: 24px;
        color: white;
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;
    }

    .baseInfo {
        height: 150px;
        width: 90%;
        margin: 0 auto;
        // line-height: 150px;
        display: flex;

        .icon {
            height: 150px;
            line-height: 150px;

            img {

                height: 100px;
                width: 100px;
                border-radius: 100px;
                vertical-align: middle;
                border: 1px solid white;
            }
        }


        .msg {
            height: 150px;
            width: 100%;

            .table {
                height: 100px;
                width: 80%;
                background-color: black;
                margin: 0 auto;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 10px;
                display: flex;
                color: white;
                user-select: none;

                .col {
                    height: 100%;
                    flex: 1;

                    .row1 {
                        height: 30px;
                        line-height: 40px;
                        padding: 5px;
                        text-align: center;
                        font-size: 14px;
                        font-family: "黑体";
                    }

                    .row2 {
                        height: 50px;
                        line-height: 50px;
                        padding: 5px;
                        text-align: center;
                        font-size: 18px;
                        font-family: "黑体";
                    }
                }

                .hr_col {
                    width: 2px;
                    height: 60%;
                    background-color: #5a5a5a;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                    margin-left: 5px;
                    margin-right: 5px;
                }
            }
        }
    }

    .hr {
        width: 90%;
        height: 2px;
        background-color: #5a5a5a;
        color: #3B3D44;
        margin: 0 auto;
        margin-top: 10px;
    }

    .member_list {
        width: 90%;
        height: 500px;
        margin: 0 auto;
        margin-top: 20px;

        .tab {
            display: flex;
            height: 40px;
            line-height: 40px;
            font-size: 18px;

            .tab_item {
                height: 40px;
                width: 100px;
                line-height: 40px;
                text-align: center;
                user-select: none;

                .tab_active {
                    border-top: 1px solid rgb(174, 174, 174);
                    border-left: 1px solid rgb(174, 174, 174);
                    border-right: 1px solid rgb(174, 174, 174);
                    color: white !important;
                }

                .content {
                    cursor: pointer;
                    color: rgb(174, 174, 174);
                    font-family: "黑体";
                    padding: 5px;
                    text-align: center;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;

                    &:hover {
                        border-top: 1px solid rgb(174, 174, 174);
                        border-left: 1px solid rgb(174, 174, 174);
                        border-right: 1px solid rgb(174, 174, 174);
                        color: white;
                    }
                }
            }
        }

        .list {
            height: 100%;
            width: 100%;
            user-select: none;

            .m_list {}

            .a_list {
                height: calc(100% - 40px);
                width: 100%;
                overflow: auto;

                .a_list_item {
                    display: flex;
                    justify-content: space-around;
                    height: 40px;
                    margin: 0 auto;
                    border-radius: 5px;
                    margin-top: 15px;
                    padding: 5px;
                    text-align: center;
                    background-color: #434343;
                    color: white;
                    cursor: pointer;

                    &:hover {
                        background-color: #505050;
                    }

                    .a_list_item_row1 {
                        height: 20px;
                        line-height: 20px;
                        font-family: "黑体";
                        font-size: 12px;
                    }

                    .a_list_item_row2 {
                        height: 20px;
                        line-height: 20px;

                        button {
                            border: none;
                            cursor: pointer;
                            border-radius: 3px;
                            font-family: "黑体";
                        }

                        button:last-child {
                            margin-left: 5px;
                        }

                        .allow {
                            background-color: green;
                            color: white;
                        }

                        .deny {
                            background-color: red;
                            color: white;
                        }
                    }
                }
            }
        }
    }
}
</style>