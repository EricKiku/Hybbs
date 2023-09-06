<template>
    <div class="create_zone">
        <img class="bg" src="../assets/img/createzoneMainbg1.png" alt="">
        <div class="main">
            <div class="one border"></div>
            <div class="two border"></div>
            <div class="three border"></div>
            <div class="four border"></div>
            <div @click="close()" class="close">
            </div>
            <div class="line first">
                <div>
                    <span>请选择分区图标</span><br>
                    <!-- 用来上传图片 -->
                    <input ref="fileInput" type="file" name="file" placeholder="选择你的文件" style="display:none;"
                        @change="selectPicture">
                    <div v-if="!picturePath" class="picture" @click="uploadPicture()">
                        <img src="../assets/img/addPicture.png" alt="">
                    </div>
                    <img class="preview" @click="uploadPicture()" v-if="picturePath" :src="picturePath" alt="">
                </div>
                <div class="zone_name">
                    <span style="color: rgb(134, 134, 134);">分区名</span>
                    <input v-model="zoneName">
                </div>
            </div>
            <div class="second">
                <span style="color: rgb(134, 134, 134);">请介绍一下该分区</span>
                <input v-model="zoneIntroduction">
            </div>
            <div class="third">
                <span>区主:</span><br>
                <input
                    :value="userStore.currentUser.u_nick + '(' + userStore.currentUser.u_email + ')' + '-Lv:' + userStore.currentUser.u_lv"
                    disabled>
            </div>
            <button class="create" @click="createzone()" :disabled="createBtnDisabled">创建</button>


        </div>

        <el-dialog v-model="dialogVisible" title="确认" width="30%">
            <span>是否创建新的分区？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogSure()">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../store/user"
import { useRouter } from "vue-router";
import { createZoneApi, uploadpictureApi } from "../api/zoneAPI"
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
const userStore = storeOfUser()
const router = useRouter()
// 获取inputdom元素
const fileInput = ref<HTMLInputElement>()
const submitInput = ref<HTMLInputElement>()
// 关闭按钮
function close() {
    router.go(-1);
}
// 打开图片选区方法
function uploadPicture() {
    fileInput.value?.click()
}
// 选取图片的路径
let picturePath = ref("")
// 选取图片后方法
let formData = new FormData();
function selectPicture(e) {
    // 对图片进行处理，向后端请求
    let file = e.target.files[0]
    // 添加图片
    formData.append("icon", file)
    // 添加参数
    formData.append("email", userStore.currentUser.u_email)
    //  预览图片
    let url = URL.createObjectURL(file)
    picturePath.value = url
}

// 提交请求
// 分区名
let zoneName = ref("")
// 分区简介
let zoneIntroduction = ref("")
//  区主
let lord = userStore.currentUser.u_id
// 提交方法
function createzone() {
    // 先弹出对话框询问
    dialogVisible.value = true
}
// 对话框
const dialogVisible = ref(false)
// 创建按钮是否可点击
let createBtnDisabled = ref(false)
// 对话框确认
function dialogSure() {
    // 先判断有没有登录
    if (userStore.currentUser.u_id) {
        // 点击确认后再发送创建请求
        if (zoneName.value != "") {
            createZoneApi(zoneName.value, zoneIntroduction.value, lord).then(res => {
                //  创建成功才上传图片
                if (res.status == 200) {
                    // 获取到插入的id
                    let zoneId = res.data
                    // 调用上传图片api
                    formData.append("id", zoneId)
                    uploadpictureApi(formData).then(res => {
                        if (res.status == 200) {
                            dialogVisible.value = false
                            ElMessage({
                                message: '创建成功',
                                type: 'success',
                            })
                            // 成功后应该跳转走，并且按钮不可点击
                            createBtnDisabled.value = true
                            // 初始化formdata
                            formData = new FormData()
                            router.go(-1)
                        } else {
                            dialogVisible.value = false
                            ElMessage({
                                message: '创建失败',
                                type: 'warning',
                            })
                        }
                        // 初始化formdata
                        formData = new FormData()
                        // 不管成功与否
                    }, res => {
                        dialogVisible.value = false
                        // 初始化formdata
                        formData = new FormData()
                    })
                } else {
                    ElMessage({
                        message: '创建失败',
                        type: 'warning',
                    })
                }


            }, rej => {
                // 初始化formdata
                formData = new FormData()
                dialogVisible.value = false
            })
        }
    } else {
        ElMessage({
            message: '未登录',
            type: 'warning',
        })
    }

}

</script>

<style lang="less" scoped>
.create_zone {
    width: 100%;
    height: 100%;
    background-image: url("../assets/img/createzonebg.jpg");
    /* 背景图垂直、水平均居中 */
    background-position: center center;
    /* 背景图不平铺 */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;
    /* 设置背景颜色，背景图加载过程中会显示背景色 */
    background-color: #464646;
    border-top-left-radius: 10px;

    .bg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 80%;
    }

    .main {
        // height: 90%;
        // width: 90%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-color: white;
        padding: 40px;
        width: 375px;

        input {
            width: 150px;
            margin-left: 15px;
            border: none;
            padding: 5px;
            border-bottom: 1px solid #5865F2;
            font-size: 18px;

            &:hover {
                outline: none;
            }

            &:focus {
                outline: none;
            }
        }

        .line {


            .picture {
                height: 100px;
                width: 100px;
                border: 1px dashed rgb(147, 147, 147);
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                display: table-cell;
                vertical-align: middle;

                &:hover {
                    border: 1px dashed #79BBFF;
                }
            }

            .preview {
                height: 100px;
                width: 100px;
                border-radius: 5px;
                box-shadow:
                    0.1px 0px 5.3px rgba(0, 0, 0, 0.065),
                    0.4px 0px 17.9px rgba(0, 0, 0, 0.095),
                    2px 0px 80px rgba(0, 0, 0, 0.16);
            }

            .zone_name {
                line-height: 118px;


            }
        }

        .first {
            display: flex;
            justify-content: space-between;
        }

        .second {
            margin-top: 15px;

            input {
                width: 98%;
                margin-left: 0px;
            }
        }

        .third {
            margin-top: 15px;

            input {
                margin-left: 0px;
                width: 98%;
                color: #ccc;
            }
        }

        .create {
            width: 100%;
            margin-top: 20px;
            height: 40px;
            border: 0px;
            background-color: #727ad9;
            color: white;
            cursor: pointer;

            &:hover {
                background-color: #4752C4;
            }
        }

        .border {
            position: absolute;
        }

        .one {
            width: 130px;
            height: 3px;
            border-radius: 1.5px;
            border-top-right-radius: 100%;
            border-bottom-right-radius: 100%;
            background-color: #464646;
            top: 3%;
            left: 3%;
        }

        .two {
            width: 3px;
            height: 130px;
            border-radius: 1.5px;
            border-bottom-left-radius: 100%;
            border-bottom-right-radius: 100%;
            background-color: #464646;
            top: 3%;
            left: 3%;
        }

        .three {
            width: 130px;
            height: 3px;
            border-radius: 1.5px;
            border-top-left-radius: 100%;
            border-bottom-left-radius: 100%;
            background-color: #464646;
            top: 97%;
            left: calc(97% - 127px);
        }

        .four {
            width: 3px;
            height: 130px;
            border-radius: 1.5px;
            background-color: #464646;
            border-top-left-radius: 100%;
            border-top-right-radius: 100%;
            top: calc(97% - 127px);
            left: 97%;
        }

        .close {
            height: 20px;
            width: 20px;
            background-color: rgb(253, 60, 60);
            border-radius: 50%;
            position: absolute;
            top: 3%;
            left: calc(97% - 26px);
            cursor: pointer;
            text-align: center;
            vertical-align: middle;

            &:hover {
                background-color: red;
            }
        }
    }
}
</style>