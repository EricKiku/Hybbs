<template>
    <div class="pushPost">
        <div class="useinfo">
            <img class="useravatar" :src="apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar')" alt="">
            <div class="info">
                <div class="usernick">
                    {{ userStore.get('u_nick') }}
                </div>
                <div class="currdate">
                    {{ getCurrentDate() }}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="postcontent">
                <textarea v-model="content" @keydown.enter="publish" @input="textareaHeightAuto" ref="postcontent" rows="2"
                    placeholder="在此输入回复内容"></textarea>
            </div>
        </div>
        <div class="nav">
            <input ref="fileDom" @change="selectFile" style="display: none;" type="file">
            <div v-show="files.length == 0" @click="openSelect('p')" class="picture fileico">
                <img src="/src/assets/img/pushPostPicture.png" alt="">Picture
            </div>
            <div v-show="files.length == 0" @click="openSelect('v')" class="video fileico">
                <img src="/src/assets/img/pushPostVideo.png" alt="">Video
            </div>
            <div v-show="files.length == 0" @click="openSelect('f')" class="video fileico">
                <img src="/src/assets/img/pushFile.png" alt="">File
            </div>
            <div style="flex: 1;">
                <div class="send" @click="publish">
                    <img src="/src/assets/img/send.png" alt="">
                    <div>
                        Send
                    </div>
                </div>
            </div>



        </div>
        <div class="files">
            <div class="file" v-for="(file) in files" :key="file['id']">
                <div class="delete" @click="deleteFile(file['id'])">
                    <img src="../assets/img/delete.png" alt="">
                </div>
                <div v-show="file['fileType'] == 'p'">
                    <img @click="previewPicture(file['tempUrl'])" :src="file['tempUrl']" alt="">
                </div>
                <div v-show="file['fileType'] == 'v'">
                    <div class="delete" @click="deleteFile(file['id'])">
                        <img src="../assets/img/delete.png" alt="">
                    </div>
                    <video width="520" controls>
                        <source :src="file['tempUrl']">
                    </video>
                </div>
                <div v-show="file['fileType'] == 'f'">
                    <File :file="file"></File>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../store/user"
import { storeOfApi } from "../store/api"
import { storeOfZone } from "../store/zone"
import { getZone } from "../api/zoneAPI"
import { getCurrentDate } from "../tools/date"
import { filterSize } from "../tools/tools"
import { message } from "../tools/tools"
import { publishPostWithPic } from "../api/postAPI"
import { publishReplyWithFileApi } from "../api/replyAPI"
import File from "./UI/File.vue"
import { useRoute } from "vue-router"
const userStore = storeOfUser()
const apiStore = storeOfApi()
const zoneStore = storeOfZone()
const route = useRoute()
let emits = defineEmits(["refresh"])

// 处理帖子内容高度自适应
let postcontent = ref()
// 控制textarea高度
function textareaHeightAuto() {
    const textarea = postcontent.value
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
}


// input=type:file DOM元素
let fileDom = ref()
// 发布的文件类型:p|v|f
let fileType = ref("")
// 文件列表
let files = ref<any>([])
// 按钮点击方法
function openSelect(type) {
    if (fileType.value != "" && fileType.value != type) {
        return;
    }
    // 首先确认文件类型
    fileType.value = type
    // 接着触发input的点击方法
    fileDom.value.click()
}
// 选择文件
function selectFile(e) {
    let file = e.target.files[0]
    // 处理一下，追加到files后
    // 在文件数组追加
    files.value.push({
        id: files.value.length,
        file,
        name: file.name,
        size: filterSize(file.size),
        suffix: file.name.slice(file.name.lastIndexOf(".")),
        fileType: fileType.value,
        tempUrl: URL.createObjectURL(file)
    })

}


// 打开分区选择小组件
let zoneSelectVisual = ref(false)
let zones = ref([])
let loading = ref(false)
// 选中的分区
let selectedZone = ref()
function showZoneSelect() {
    loading.value = true
    zoneSelectVisual.value = true
    // 打开获取全部分区
    getZone().then(res => {
        if (res.status == 200) {
            zones.value = sortByPosts(res.data)

        } else {
            zones.value = []
        }
    }).finally(() => {
        loading.value = false
    })
    document.addEventListener("click", closeZoneSelect)

}
// 排序方法，按照帖子数量排序
function sortByPosts(array) {
    return array.sort((v1, v2) => {
        if (v1['z_posts'] <= v2['z_posts']) {
            return 1
        } else {
            return -1
        }
    })
}
// 选择一个分区
function selectZone(zone) {
    selectedZone.value = zone
    closeZoneSelect()
}
// 关闭选择分区小组件
function closeZoneSelect() {
    zoneSelectVisual.value = false
    document.removeEventListener("click", closeZoneSelect)
}



// 打开预览图片
function previewPicture(url) {
    zoneStore.setPicturePreviewPath(url)
}

// 删除文件列表中的文件
function deleteFile(id) {
    let res = <any>[]
    // 遍历files
    for (const file of files.value) {
        if (file['id'] != id) {
            res.push(file)
        }
    }
    // 清空input的value
    fileDom.value.value = ""
    files.value = res
    // 如果files.value 长度为0，则清空文件类型
    if (files.value.length == 0) {
        fileType.value = ''
    }
}



// 提交
let title = ref("")
let content = ref("")
let formData = new FormData()
function publish() {
    // 错误，遇到一个就不执行方法
    let error = false
    if (!content.value) {
        message(2, "请输入内容")
    }
    if (error) {
        return;
    }
    // uId, err := strconv.Atoi(ctx.PostForm("u_id"))
    // pId, err := strconv.Atoi(ctx.PostForm("p_id"))
    // content := ctx.PostForm("content")
    // date := ctx.PostForm("date")
    // rId, err := strconv.Atoi(ctx.PostForm("r_id"))
    // pov := ctx.PostForm("pov")
    // uNick := ctx.PostForm("u_nick")
    // // 接收文件
    // file, err := ctx.FormFile("file")
    if (!route.query.pId) {
        return;
    }
    formData.append("u_id", userStore.get('u_id'))
    formData.append("p_id", route.query.pId + "")
    formData.append("content", content.value)
    formData.append("date", getCurrentDate())
    // 如果路由中有rid，则就是回复给某个回复的，如果没有，就是0
    formData.append("r_id", (route.query.rid || 0) + '')
    formData.append("fileType", fileType.value || "")
    formData.append("u_nick", userStore.get('u_nick'))
    formData.append("len", files.value.length)
    // 循环文件列表，依次添加文件。在此处只有一个文件
    for (const [index, file] of files.value.entries()) {
        formData.append('file', file.file)
    }
    publishReplyWithFileApi(formData).then(res => {
        if (res.status == 200) {
            message(1, "回复成功")
            emits('refresh')
            // 清空回复组件
            content.value = ""
            fileType.value = ""
            files.value = []
        } else {
            message(3, "回复失败，请稍后重试")
        }

    }).finally(() => {
        formData = new FormData()
    })

}
</script>

<style lang="less" scoped>
.pushPost {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;
    margin-top: 20px;

    .head {}

    >.useinfo {
        height: 40px;
        display: flex;

        .useravatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .info {
            height: 40px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 0px 15px;

            >div {
                height: 15px;
                line-height: 15px;
            }

            .usernick {
                font-weight: bold;
            }

            .currdate {
                font-size: 14px;
                color: #676a79;
            }
        }
    }

    >.content {
        display: flex;
        flex-direction: column;
        min-height: 60px;
        padding: 5px 0px;

        .posttitle {
            // height: 30px;
            padding: 5px 0px;
            display: flex;

            span {
                line-height: 30px;
                color: #86b2ef;
            }

            input {
                flex: 1;
                border: 0px;
                outline: 0px;
                padding: 5px 10px;
                border: 1px solid #e1e4e6;
                color: #29292e;
                line-height: 1.5;
                font-weight: bold;
                border-radius: 5px;
                transition: all 0.2s;

                &:focus {
                    border: 1px solid #0f6fec;
                }
            }
        }

        .postcontent {
            min-height: 30px;

            textarea {
                width: 100%;
                height: 100%;
                border: 1px solid #e1e4e6;
                outline: none;
                resize: none;
                font-size: 16px;
                font-family: "黑体";
                box-sizing: border-box;
                padding: 5px;
                border-radius: 5px;
                margin-top: 10px;

                &:focus {
                    border: 1px solid #0f6fec;
                }

                &::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
            }
        }
    }

    >.nav {
        height: 30px;
        display: flex;

        .fileico {
            padding: 5px;
            background-color: #ebeaea;
            // line-height: 15px;
            border-radius: 5px;
            color: #676a79;
            font-size: 14px;
            cursor: pointer;
            margin-right: 15px;

            &:hover {
                color: #47484b;
            }

            img {
                height: 15px;
                width: 15px;
                margin-right: 5px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }

        }

        .send {
            padding: 5px 15px;
            display: flex;
            height: 20px;
            line-height: 20px;
            width: 65px;
            float: right;
            background-color: #ebeaea;
            color: #676a79;
            border-radius: 5px;
            cursor: pointer;

            img {
                height: 15px;
                widows: 15px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }

            &:hover {
                background-color: #5865F2;
                color: white;
            }
        }

        .selectZone {
            position: relative;

            .zones {
                height: 300px;
                // width: 100px;
                position: absolute;
                left: 100%;
                transform: translateY(-50%);
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                z-index: 1;
                overflow: auto;

                .zone {
                    padding: 5px;
                    height: 30px;
                    display: flex;
                    transition: all 0.2s;

                    &:hover {
                        background-color: #86b2ef;
                        color: white;
                    }

                    img {
                        height: 30px;
                        width: 30px;
                        border-radius: 5px;
                    }

                    div {
                        line-height: 30px;
                        width: fit-content;
                        text-wrap: nowrap;
                    }
                }
            }
        }
    }

    .files {
        display: flex;
        flex-wrap: wrap;


        .file {
            position: relative;
            // height: 60px;
            margin-right: 5px;
            margin-top: -10px;
            width: calc(100% - 100px);

            .delete {
                position: absolute;
                right: 0px;
                cursor: pointer;
                background-color: rgba(255, 255, 255, .5);
                border-bottom-left-radius: 5px;
                z-index: 2;

                img {
                    height: 20px;
                    width: 20px;
                    transition: all 0.2s;

                    &:hover {
                        transform: rotate(180deg);
                    }
                }
            }

            img {
                height: 60px;
                border-radius: 5px;
            }

            video {
                border-radius: 5px;
                width: 100%;
            }
        }
    }
}
</style>