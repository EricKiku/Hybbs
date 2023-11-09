<template>
    <div class="head">
        <div style="width: 300px;border-top-left-radius: 10px;line-height: 35px;">
            <button @click="signin()"
                :class="{ signin: !userStore.isAlreadySignin, alreadySignin: userStore.isAlreadySignin }">{{
                    userStore.isAlreadySignin ? "已签到" : "签到" }}</button>
            已签到 <span>{{ signincount }}</span> 天
        </div>
        <div class="search" :class="{ search_focus: acquire, search_unfocus: !acquire }">
            <input @keyup.enter="search()" @click="search_box_focus_event('acquire')" @blur="search_box_focus_event('lose')"
                type="text" v-model="searchContent" placeholder="搜索：分区、帖子、用户">
            <el-icon @click="search()" title="搜一下">
                <Search />
            </el-icon>

        </div>

        <div v-if="searchResultVisual" class="searchResult" v-loading="loadingStatus"
            element-loading-background="rgba(0, 0, 0, 0.2)">
            <div class="class">
                <div @click="switchClass('zone')" class="item">
                    <div class="inside" :class="{ tabActiveZone: tab == 'zone' }">
                        <img src="../../assets/img/zone.png" alt="">
                        分区
                    </div>
                </div>
                <div @click="switchClass('post')" class="item">
                    <div class="inside" :class="{ tabActivePost: tab == 'post' }">
                        <img src="../../assets/img/posts.png" alt="">
                        帖子
                    </div>

                </div>
                <div @click="switchClass('user')" class="item">
                    <div class="inside" :class="{ tabActiveUser: tab == 'user' }">
                        <img src="../../assets/img/user.png" alt="">
                        用户
                    </div>

                </div>
            </div>
            <div class="searchContent">
                <div class="zoneList scrollbar" v-show="tab == 'zone'">
                    <div class="empty" v-if="!searchResult['zones']">
                        <div class="content">
                            还没有这个分区，快去创建吧
                        </div>
                    </div>
                    <div class="zoneItem" @click="ToZoneDetails2(zone)" v-for="(zone) in searchResult['zones']"
                        :key="zone['z_id']">
                        <img :src="apiStore.getBaseUrl() + apiStore.getPort() + zone['z_icon']">
                        <div class="zoneName" :title="zone['z_name']">{{ zone['z_name'] }}</div>
                        <div class="zoneInfo">
                            <span><img src="../../assets/img/followNumber.png" alt="">:{{ zone['z_follows'] }}</span>
                            <span><img src="../../assets/img/Document.png" alt="">:{{ zone['z_posts'] }}</span>
                        </div>
                    </div>
                </div>
                <div class="postList scrollbar" v-show="tab == 'post'">
                    <div class="empty" v-if="!searchResult['posts']">
                        <div class="content">
                            未查询到帖子
                        </div>
                    </div>
                    <div class="postItem" @click="ToPostDetails(post['z_id'], post)" v-for="(post) in searchResult['posts']"
                        :key="post['p_id']">
                        <div class="post_zone">
                            <img src="../../assets/img/zone.png">
                            <span>[{{ post['z_name'] }}]</span>
                        </div>
                        <div class="post_title">
                            <span>{{ post['p_title'] }}</span>
                        </div>
                        <div class="post_content">
                            <span>{{ post['p_content'] }}</span>
                        </div>
                    </div>
                </div>
                <div class="userList scrollbar" v-show="tab == 'user'">
                    <div class="empty" v-if="!searchResult['users']">
                        <div class="content">
                            没有该用户
                        </div>
                    </div>
                    <div class="userItem" @click="goToOtherUser(user['u_id'])" v-for="(user) in searchResult['users']"
                        :key="user['u_id']">
                        <img :src="apiStore.getBaseUrl() + apiStore.getPort() + user['u_avatar']">
                        <span>{{ user['u_nick'] }}</span>
                    </div>
                </div>
                <div class="closeSearh" @click="closeSearch()">
                    关闭
                </div>
            </div>
        </div>
        <div class="userInfo">
            <div v-if="userStore.currentUser.u_email">
                <div class="userNick">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <span class="nick"><b>{{ userStore.currentUser.u_nick ? userStore.currentUser.u_nick :
                                userStore.currentUser.u_email
                            }}</b></span>
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="router_login()"> 切换账号 </el-dropdown-item>
                                <el-dropdown-item @click="createZone()"> 创建分区 </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <el-button v-if="!userStore.currentUser.u_email" type="primary" :icon="Link"
                @click="router_login()">登录</el-button>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
import { Search, Link } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { storeOfUser } from "../../store/user"
import { createZoneApi } from "../../api/zoneAPI"
import { searchApi } from "../../api/searchAPI"
import { signinApi } from "../../api/userAPI"
import { ElMessage } from 'element-plus'
import { getCurrentDate } from "../../tools/date"
import { ToZoneDetails2, ToPostDetails, goToOtherUser, addExpTool } from "../../tools/tools"
import { storeOfApi } from "../../store/api"
const router = useRouter();
const userStore = storeOfUser()
const apiStore = storeOfApi()
// head >>
let searchContent = ref("")
// 搜索框焦点事件
let acquire = ref(false)
function search_box_focus_event(status) {
    acquire.value = status == 'acquire'
}
// 是否签到
let isAlreadySignin = ref(false)
// 签到天数
let signincount = ref(0)
function signin() {
    if (isAlreadySignin.value) {
        return
    }
    let u_id = userStore.get("u_id")
    let date = getCurrentDate()
    signinApi(u_id, date).then(res => {
        if (res.status == 200) {
            // 更新userStore中的签到
            addExpTool(u_id, 10, message)
            isAlreadySignin.value = true
            signincount.value += 1
        }
    })

}

onMounted(() => {
    signincount.value = userStore.get("u_signin_count")
    console.log("签到：", userStore.get("u_signin_date").substring(0, 10));
    console.log('今天：', getCurrentDate().substring(0, 10));
    if (userStore.get("u_signin_date")) {
        console.log("是否相等：", userStore.get("u_signin_date").substring(0, 10) + "" == getCurrentDate().substring(0, 10));

        if (userStore.get("u_signin_date").substring(0, 10) + "" == getCurrentDate().substring(0, 10)) {
            isAlreadySignin.value = true
        }
    }

})
// 按钮点击事件
function router_login() {
    router.push({
        name: "/login"
    })
}
// 创建一个分区
function createZone() {
    // 转到创建分区路由
    router.push({
        name: "/create_zone"
    })
}
// head <<

// 搜索结果
let searchResult = ref([])
// 显示结果
let searchResultVisual = ref(false)
// 加载
let loadingStatus = ref(false)
// 搜索事件
function search() {

    loadingStatus.value = true
    // 如果搜索栏是空，则不响应
    if (searchContent.value == "") {
        loadingStatus.value = false
        return;
    }
    searchResultVisual.value = true
    searchApi(searchContent.value).then(res => {
        if (res.status == 200) {
            message(1, "搜索成功")
            searchResult.value = res.data
            // 再把结果集都反转
            searchResult.value['zones'] = searchResult.value['zones'].reverse()
            searchResult.value['posts'] = searchResult.value['posts'].reverse()
            searchResult.value['users'] = searchResult.value['users'].reverse()
            loadingStatus.value = false
            console.log("搜索结果：", searchResult.value);

        } else {
            message(2, "搜索失败")
            searchResultVisual.value = false
        }
    }).finally(() => { loadingStatus.value = false })
}
// 关闭结果显示
function closeSearch() {
    searchResultVisual.value = false
}
// 切换分类
let tab = ref("zone")
function switchClass(value) {
    tab.value = value
}


// 消息提示方法
function message(type, content) {
    ElMessage({
        message: content,
        type: type == 1 ? 'success' : 'warning',
    })
}
</script>

<style lang="less" scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

// 分类选中样式
.tabActiveZone {
    background-color: #f1f1f1;
    border-right: 1px solid #b8b8b8;
    border-top-left-radius: 5px;
}

.tabActivePost {
    background-color: #f1f1f1;
    border-left: 1px solid #b8b8b8;
    border-right: 1px solid #b8b8b8;
}

.tabActiveUser {
    background-color: #f1f1f1;
    border-left: 1px solid #b8b8b8;
    border-top-right-radius: 5px;
}

.head {
    height: 35px;
    border-bottom: 1px solid #ccc;
    padding-top: 10px;
    padding-bottom: 10px;
    border-top-left-radius: 9px;
    // 开启flex
    display: flex;
    justify-content: space-between;
    // 渐变背景样式
    background: @HeadLinear;
    background: @HeadLinear2;

    .signin {
        margin-left: 10px;
        height: 35px;
        width: 100px;
        border: none;
        border: 3px solid #5865F2;
        color: #5865F2;
        font-size: 18px;
        letter-spacing: 5px;
        border-radius: 17px;
        cursor: pointer;
        font-weight: bold;

        &:hover {
            background-color: #5865F2;
            color: white;
        }
    }

    .alreadySignin {
        margin-left: 10px;
        height: 35px;
        width: 100px;
        border: none;
        border: 3px solid #ccc;
        color: #ccc;
        font-size: 18px;
        letter-spacing: 5px;
        border-radius: 17px;
        font-weight: bold;
    }

    // 搜索边框获取焦点样式
    .search_focus {
        // border: 1px solid green;
        border: 1px solid @Theme;
        box-shadow:
            0px 5px 17px rgba(0, 0, 0, 0.22);
    }

    // 搜索边框失去焦点样式
    .search_unfocus {
        border: 1px solid #ccc;
    }

    .search {
        height: 30px;
        width: 300px;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 5px;
        padding-bottom: 2px;
        border-radius: 5px;
        transition: all 0.2s;

        i {
            height: 30px;
            width: 30px;
            cursor: pointer;
        }

        input {
            font-size: 16px;
            height: 27px;
            width: 270px;
            border: 0px;
            padding: 0px;
            opacity: .7;


            &:focus {
                outline: 0px;
            }
        }


    }

    .searchResult {
        position: absolute;
        top: 80px;
        left: calc(50% + 30px);
        transform: translateX(-50%);
        height: 300px;
        width: 320px;
        background-color: white;
        z-index: 5;
        border-radius: 5px;
        box-shadow:
            0px 0px 10px rgba(0, 0, 0, 0.115),
            0px 0px 80px rgba(0, 0, 0, 0.23);
        transition: all 0.2s;

        .class {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: center;
            cursor: pointer;
            user-select: none;

            .item {
                text-align: center;
                flex: 1;
                transition: all 0.2s;

                &:hover {
                    background-color: #f1f1f1;
                }

                .inside {
                    width: 98%;
                    margin: 0 auto;
                    height: 100%;
                }

                img {
                    height: 20px;
                    width: 20px;
                    vertical-align: middle;
                }
            }
        }

        .searchContent {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            height: 260px;
            width: 100%;
            background-color: #f1f1f1;

            .empty {
                width: 100%;
                height: 260px;

                .content {
                    text-align: center;
                    position: absolute;
                    width: 200px;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                }
            }

            .zoneList {
                overflow: auto;
                height: 260px;

                .zoneItem {
                    display: flex;
                    margin-left: 5px;
                    margin-right: 5px;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 5px;
                    margin-top: 10px;
                    // background-color: rgb(219, 219, 219);
                    // background-color: white;
                    cursor: pointer;
                    color: #5865F2;

                    &:hover {
                        background-color: #5865F2;
                        color: white;
                    }

                    >img {
                        height: 30px;
                        width: 30px;
                        vertical-align: middle;
                        border-radius: 5px;
                        margin-right: 10px;
                    }

                    .zoneName {
                        width: 110px;
                        /* 强制不换行 */
                        white-space: nowrap;
                        /* 文字用省略号代替超出的部分 */
                        text-overflow: ellipsis;
                        /* 匀速溢出内容，隐藏 */
                        overflow: hidden;
                    }

                    .zoneInfo {
                        flex: 1;
                        display: flex;
                        justify-content: space-around;
                        color: #8d8d8d;

                        img {
                            height: 18px;
                            width: 18px;
                            vertical-align: middle;

                        }
                    }
                }
            }

            .postList {
                overflow: auto;
                height: 260px;

                .postItem {
                    margin-left: 5px;
                    margin-right: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 5px;
                    border-bottom: 1px solid #ccc;

                    &:hover {
                        background-color: white;
                        // color: white;
                    }

                    .post_zone {
                        height: 20px;
                        line-height: 20px;
                        font-size: 16px;
                        color: #94a3b5;

                        img {
                            height: 15px;
                            width: 10px;
                            vertical-align: middle;
                        }
                    }

                    .post_title {
                        font-size: 18px;
                    }

                    .post_content {
                        font-size: 14px;
                        color: #737373;
                        height: 30px;
                        /* 强制不换行 */
                        white-space: nowrap;
                        /* 文字用省略号代替超出的部分 */
                        text-overflow: ellipsis;
                        /* 匀速溢出内容，隐藏 */
                        overflow: hidden;
                    }
                }
            }

            .userList {
                overflow: auto;
                height: 260px;

                .userItem {
                    margin-left: 5px;
                    margin-right: 5px;
                    padding: 5px;
                    height: 20px;
                    line-height: 20px;
                    cursor: pointer;
                    border-radius: 5px;

                    &:hover {
                        background-color: #b8b8b8;
                    }

                    img {
                        height: 20px;
                        width: 20px;
                        border-radius: 5px;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                }
            }

            .closeSearh {
                width: 100%;
                background-color: red;
                text-align: center;
                color: white;
                cursor: pointer;
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }

    .userInfo {
        width: 300px;
        height: 100%;
        line-height: 35px;

        button {
            margin-left: 110px;
        }

        .userNick {
            line-height: 35px;
            text-align: center;

            .nick {
                font-size: 16px;
                cursor: pointer;

                &:hover {
                    border-bottom: 1px solid #5865F2;
                }
            }

            .el-dropdown {
                margin-top: 9.5px;

            }

            .el-icon {
                cursor: pointer;
            }
        }
    }
}
</style>