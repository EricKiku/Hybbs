<template>
    <div class="head">
        <div style="width: 300px;border-top-left-radius: 10px;"></div>
        <div class="search" :class="{ search_focus: acquire, search_unfocus: !acquire }">
            <input @click="search_box_focus_event('acquire')" @blur="search_box_focus_event('lose')" type="text"
                v-model="searchContent" placeholder="搜索：分区、帖子、用户">
            <el-icon title="搜一下">
                <Search />
            </el-icon>
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
                            <div>
                                111111111111111
                            </div>
                            <div>
                                1111111111111111
                            </div>
                            <div>
                                1111111111111111
                            </div>
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
import { ref } from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
import { Search, Link } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { storeOfUser } from "../../store/user"
const router = useRouter();
const userStore = storeOfUser()
// head >>
let searchContent = ref("")
// 搜索框焦点事件
let acquire = ref(false)
function search_box_focus_event(status) {
    acquire.value = status == 'acquire'
}

// 按钮点击事件
function router_login() {
    router.push({
        name: "/login"
    })
}
// head <<
</script>

<style lang="less" scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
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
                &:hover{
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