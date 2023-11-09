<template>
    <div class="creatrRoom">
        <div class="close" @click="close()">
            <img src="../../assets/img/closeCreateRoom.png" alt="">
        </div>
        <div class="title">
            创建一个由您管理的频道
        </div>
        <div class="secondTitle">
            设置一个图片和一个频道名称可以更好的使其他用户寻找到您的频道
        </div>
        <div class="roomIco">
            <div class="icoImg" title="挑选一个图标" @click="openFile">
                <!-- <div class="icoImg" title="挑选一个图标"> -->
                <input @change="selectFileChange" style="display: none;" ref="fileInput" type="file">
                <img class="previewImg" v-if="previewURL" :src="previewURL">
                <img class="noUrlImg" v-if="!previewURL" src="../../assets/img/xiangji.png">
            </div>
        </div>
        <div class="roomName">
            <div>频道名称</div>
            <input v-model="roomName" type="text" placeholder="请输入您的频道名称">
        </div>
        <div class="options">
            <div class="isSearched">
                <div style="font-size: 14px;">频道是否可被搜索到?</div>
                <el-switch v-model="searchable" active-text="Yes" inactive-text="No" />
            </div>
            <el-button :loading="loadingStatus" :disabled="!previewURL || !roomName || loadingStatus"
                @click="submit()">创建</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { getCurrentDate } from "../../tools/date"
import { createChatRoom } from "../../api/roomAPI"
import { ElMessage } from 'element-plus'
import { storeOfUser } from "../../store/user"
const userStore = storeOfUser()
let emits = defineEmits(['close'])
// 关闭
function close() {
    emits("close", false)
}

// 上传图片
// input dom元素
let fileInput = ref()
// 图片
let file_ico = ref()
// 频道名称
let roomName = ref()
// 点击打开文件选择
function openFile() {
    fileInput.value.click()
}
// 选择完毕后执行方法

let previewURL = ref("")
function selectFileChange(e) {
    // 拿到input上的文件
    let file = e.target.files[0];
    // 创建一个URL
    previewURL.value = URL.createObjectURL(file)
}
// 是否可搜索开关值
let searchable = ref(false)
// 提交方法
// 按钮加载状态属性
let loadingStatus = ref(false)
function submit() {
    // 加载
    loadingStatus.value = true
    let formData = new FormData();
    let file = fileInput.value.files[0]
    formData.append("icon", file)
    formData.append("rName", roomName.value)
    formData.append("createDate", getCurrentDate())
    // 频道拥有者
    formData.append("createUser", userStore.get("u_id"))
    // 频道是否可被搜索到
    formData.append("searchAble", (searchable.value ? 1 : 0) + '')

    // 发送请求
    createChatRoom(formData).then(res => {
        if (res.status == 200) {
            message(1, "创建成功")
            close()
        } else {
            message(2, "创建失败:" + res['msg'])
        }
    }).finally(() => { loadingStatus.value = false })
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
.creatrRoom {
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
        cursor: pointer;

        img {
            width: 30px;
            height: 30px;
            position: absolute;
            right: 20px;
            top: 20px;
        }
    }

    .title {
        font-size: 28px;
        text-align: center;
        font-weight: bold;
        margin-top: 10px;
    }

    .secondTitle {
        text-align: center;
        width: 70%;
        margin: 0 auto;
        margin-top: 20px;
        letter-spacing: 2px;
    }

    .roomIco {
        padding-top: 50px;
        width: 90%;
        margin: 0 auto;
        text-align: center;
        height: 150px;

        .icoImg {
            cursor: pointer;
            height: 100px;
            width: 100px;
            border-radius: 50%;
            border: 2px dotted black;
            margin: 0 auto;
            line-height: 80px;

            >.previewImg {
                vertical-align: middle;
                height: 100px;
                width: 100px;
                border-radius: 50%;
            }

            >.noUrlImg {
                // vertical-align: middle;
                height: 50px;
                width: 50px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .roomName {
        width: 90%;
        margin: 0 auto;
        font-size: 14px;
        font-family: "黑体";
        font-weight: bold;

        >input {
            width: calc(100% - 20px);
            height: 30px;
            border: none;
            outline: none;
            background-color: #eaeaea;
            border-radius: 5px;
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 10px;
            letter-spacing: 2px;
        }
    }

    .options {
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin: 0 auto;
        margin-top: 10px;

        button {
            cursor: pointer;
            border: none;
            outline: none;
            width: 80px;
            height: 40px;
            background-color: #737ef3;
            color: white;
            border-radius: 3px;

            &:hover {
                background-color: #4352f3;
            }
        }
    }
}
</style>