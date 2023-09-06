<template>
    <div class="createPost">
        <div class="whiteTitle">
            <img src="../../assets/img/publicPost.png">
            <span style="line-height: 20px;">书写一个标题</span>
            <input v-model="title" placeholder="在此处书写标题">
        </div>
        <div class="whiteContent">
            <textarea v-model="content" placeholder="在此处书写内容"></textarea>
        </div>
        <button @click="openDia" class="public">发表</button>
    </div>
    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" title="提示" width="50%">
        <span>确认发表</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="publish">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { publishPostApi } from "../../api/postAPI"
import { getCurrentDate } from "../../tools/date"
import { isLogin } from "../../tools/tools"
import { ElMessage } from 'element-plus'
const zoneStore = storeOfZone()
const userStore = storeOfUser()
// 发表帖子数据
let title = ref("")
let content = ref("")

// 注册事件
const emit = defineEmits(['submit'])
// 注册props
const props = defineProps(['zoneName'])


// 打开对话框方法
let dialogVisible = ref(false)
function openDia() {
    dialogVisible.value = true
}


// 发表方法
function publish() {
    // 关闭对话框
    dialogVisible.value = false
    // 判断登录
    if (isLogin()) {
        // 判断是否在分区内
        if (zoneStore.currentPreviewPost) {
            // 判断标题和内容
            if (title.value && content.value) {
                let z_id = zoneStore.currentPreviewPost['z_id']
                let u_id = userStore.currentUser['u_id']
                let u_name = userStore.currentUser['u_nick']
                publishPostApi(z_id, u_id, u_name, title.value, content.value, getCurrentDate()).then(res => {
                    if (res.status == 200) {
                        ElMessage({
                            message: '发表成功',
                            type: 'success',
                        })
                        emit("submit")
                    } else {
                        ElMessage({
                            message: '发表失败.',
                            type: 'warning',
                        })
                    }
                })
            }
        } else {
            console.log('错误');
        }
    } else {
        console.log('未登录');
    }
}
</script>

<style lang="less" scoped>
.createPost {
    width: 700px;
    height: 600px;
    background-color: white;
    padding: 30px;

    .whiteTitle {
        margin-top: 20px;
        width: 100%;

        input {
            width: calc(100% - 12px);
            height: 30px;
            margin-top: 10px;
            outline: 0px;
            border: 1px solid #ccc;
            padding-left: 10px;
            font-size: 16px;
        }
    }

    .whiteContent {
        margin-top: 20px;

        textarea {
            width: calc(100% - 14px);
            padding-left: 10px;
            height: 470px;
            outline: 0px;
            border: 1px solid #ccc;
            resize: none;
            font-size: 16px;
        }
    }

    .public {
        width: 100px;
        height: 30px;
        border: 0px;
        background-color: white;
        border: 1px solid #6a73d7;
        cursor: pointer;
        transition: all 0.2s;
        float: right;

        &:hover {
            background-color: #6a73d7;
            color: white;
        }
    }
}
</style>