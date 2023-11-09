<template>
    <!-- 废弃 -->
    <div @click="closeBigPicture" class="pictureBigPreview" v-if="bigPicturePath">
        <img :src="bigPicturePath" alt="">
    </div>
    <div class="createPost">
        <div class="whiteTitle">
            <img src="../../assets/img/publicPost.png">
            <span style="line-height: 20px;">书写一个标题</span>
            <input v-model="title" placeholder="在此处书写标题">
        </div>
        <div class="whiteContent">
            <textarea v-model="content" :style="{ height: havePicture ? '260px' : '470px' }"
                placeholder="在此处书写内容"></textarea>
            <div style="margin-top: 10px;" v-show="havePicture">
                图片<el-switch v-model="pov" class="ml-2"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />视频
                <span v-show="!pov"
                    style="margin-left: 10px;background-color: #13ce66;color: white;padding: 2px;border-radius: 3px;">请在下面选择图片:</span>
                <span v-show="pov"
                    style="margin-left: 10px;background-color: #ff4949;color: white;padding: 2px;border-radius: 3px;">请在下面选择视频:</span>
            </div>
            <div class="pictures scrollbar" v-show="havePicture">
                <input @change="selectedPicture" ref="pictureInput" type="file" style="display: none;">
                <div class="addPicture">
                    <img @click="openSelectFile" src="/src/assets/img/addPostPicture.png" alt="" title="点击添加图片">
                </div>
                <div class="preview" v-for="(picture) in picturePreviewPath" :key="picture.id">
                    <div class="delete">
                        <img @click.stop="deletePicture(picture.id)" src="/src/assets/img/close.png" alt="">
                    </div>
                    <img @click="bigupSelect(picture)" :class="{ big: bigup == picture['id'] }" class="previewItem"
                        :src="picture.path" alt="">
                </div>

            </div>
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
import { ref, onMounted } from "vue"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { publishPostApi, publishPostWithPic } from "../../api/postAPI"
import { getCurrentDate } from "../../tools/date"
import { isLogin, addExpTool } from "../../tools/tools"
import { ElMessage } from 'element-plus'
const zoneStore = storeOfZone()
const userStore = storeOfUser()
// 发表帖子数据
let title = ref("")
let content = ref("")

// 注册事件
const emit = defineEmits(['submit'])
// 注册props
const props = defineProps(['zoneName', 'picture'])


// 是否是图文
let havePicture = ref(false)

// 判断是不是图文
onMounted(() => {
    if (props.picture) {
        havePicture.value = true
    }
})

// 是图片还是视频
let pov = ref<any>(false)
// 添加图片方法
// input DOM元素
const pictureInput = ref()
// 图片预览路径数组
let picturePreviewPath = ref<any>([])
// 文件数组
let files = ref<any>([])
// 打开文件选择
function openSelectFile() {
    pictureInput.value.click()
}
// 选择文件后
function selectedPicture(e) {
    let file = e.target.files[0]

    let url = URL.createObjectURL(file)
    picturePreviewPath.value.push({ id: picturePreviewPath.value.length, path: url })
    files.value.push({ id: files.value.length, file: file })

}
// 删除选择的图片在数组中
function deletePicture(id) {
    let tempArr = <any>[]
    let tempFiles = <any>[]
    for (const picture of picturePreviewPath.value) {
        if (picture.id != id) {
            tempArr.push(picture)
        }
    }
    for (const file of files.value) {
        if (file.id != id) {
            tempFiles.push(file)
        }
    }
    picturePreviewPath.value = tempArr
    files.value = tempFiles
}

// 放大预览
// 放大的哪个图片
let bigup = ref(-1)
// 放大图片的路径
let bigPicturePath = ref("")
// 选择放大的图片
function bigupSelect(picture) {
    if (bigup.value == picture['id']) {
        bigup.value = -1;
        return;
    }
    bigup.value = picture['id']
    bigPicturePath.value = picture['path']
}
// 关闭放大图片
function closeBigPicture() {
    bigPicturePath.value = ""
    bigup.value = -1
}

// 打开对话框方法
let dialogVisible = ref(false)
function openDia() {
    dialogVisible.value = true
}


// 发表方法
let formData = new FormData();
function publish() {
    // 判断是否是图文
    if (havePicture.value) {
        // 关闭对话框
        dialogVisible.value = false
        // 判断登录
        if (isLogin()) {
            // 判断是否在分区内
            if (zoneStore.currentPreviewZone) {
                // 判断标题和内容
                if (title.value && content.value) {
                    // 如果图片数组中有内容，则一起发送
                    // 先存储内容
                    formData.append('z_id', zoneStore.currentPreviewZone['z_id'] + '');
                    formData.append('u_id', userStore.currentUser['u_id'] + '')
                    formData.append('u_name', userStore.currentUser['u_nick'])
                    formData.append('title', title.value)
                    formData.append('content', content.value)
                    formData.append('date', getCurrentDate())
                    formData.append('len', files.value.length)
                    formData.append('fileType', pov.value ? 'v' : 'p')
                    // 存储文件
                    console.log("files:", files.value);

                    for (const file of files.value) {
                        formData.append(file['id'], file['file'])
                    }
                    publishPostWithPic(formData).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            message(1, "发布成功")
                            addExpTool(userStore.currentUser['u_id'], 1, message)
                            emit("submit")
                        } else {
                            message(2, res['msg'])
                        }
                    })
                    formData = new FormData()
                }
            } else {
                console.log('错误');
            }
        } else {
            console.log('未登录');
        }

    } else {
        // 关闭对话框
        dialogVisible.value = false
        // 判断登录
        if (isLogin()) {
            // 判断是否在分区内
            if (zoneStore.currentPreviewZone) {
                // 判断标题和内容
                if (title.value && content.value) {
                    let z_id = zoneStore.currentPreviewZone['z_id']
                    let u_id = userStore.currentUser['u_id']
                    let u_name = userStore.currentUser['u_nick']
                    publishPostApi(z_id, u_id, u_name, title.value, content.value, getCurrentDate()).then(res => {
                        if (res.status == 200) {
                            message(1, "发布成功")
                            addExpTool(u_id, 1, message)
                            emit("submit")
                        } else {
                            message(1, "发布失败")
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
.pictureBigPreview {
    position: absolute;
    height: 100%;
    width: 100%;
    // left: 50%;
    // top: 50%;
    // transform: translateX(-50%) translateY(-50%);
    z-index: 4;
    // width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    // border-radius: 10px;
    overflow: hidden;
    text-align: center;

    >img {
        height: 70%;
        // width: 70%;
        max-width: 100%;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 10px;
    }
}

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

        .pictures {
            height: 170px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            width: 700px;
            display: flex;
            flex-wrap: wrap;
            overflow: auto;

            .addPicture {
                height: 70px;
                width: 70px;
                margin: 10px;

                >img {
                    height: 70px;
                    width: 70px;
                    cursor: pointer;
                }
            }

            .preview {
                height: 70px;
                // width: 70px;
                margin: 10px;
                box-sizing: border-box;
                // border: 1px solid #097649;
                border-radius: 5px;
                cursor: pointer;
                overflow: hidden;
                position: relative;
                transition: all 0.2s;
                padding: 1px;
                background-color: white;
                border: 1px solid #ccc;

                .delete {
                    background-color: rgba(0, 0, 0, 0.1);
                    position: absolute;
                    right: 0px;
                    border-bottom-left-radius: 5px;
                    transition: all 0.2s;

                    &:hover {
                        background-color: rgba(0, 0, 0, 0.6);
                    }
                }

                .previewItem {
                    height: 100%;
                    transition: all 0.2s;
                    border-radius: 5px;
                    transition: all 0.2s;
                }

            }
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