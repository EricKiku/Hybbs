<template>
    <!-- 废弃 -->
    <div class="options">
        <button @click="goBack">{{ '<' }}返回</button>
    </div>
    <div class="reply" :style="{ height: replyComponentVisual ? '200px' : '0px' }">
        <div v-show="replyComponentVisualDelay">
            <div class="reply_title">
                <span v-if="replyLocal == 'post'">回复到帖子(追加到最后一楼)</span>
                <span v-if="replyLocal == 'floor'">回复给:{{ replyName }}</span>
            </div>
            <textarea @keyup.enter="openReplyDia()" placeholder="在此书写回复内容,点击回复按或按下键盘回车键发送消息"
                v-model="replyContent"></textarea>
            <div class="bottomOp">
                <div class="fileSelect" v-show="replyWithFile">
                    <input @change="selectedFileOnChange" ref="fileInput" style="display: none;" type="file">
                    <div class="ico" v-show="!filePath">
                        <img @click="selectFile('p')" src="/src/assets/img/picture.png" alt="" title="点击选择图片">
                        <img @click="selectFile('v')" src="/src/assets/img/video.png" alt="" title="点击选择视频">
                    </div>
                    <div class="files" v-show="filePath">
                        <img @click="openPreview(filePath)" :src="filePath" alt="">
                    </div>
                </div>
                <button @click="openReplyDia()">回复</button>
            </div>
        </div>
    </div>

    <div class="floor scrollbar" v-loading="loadingStatus" @click="bgClick()">
        <div class="title">{{ post['p_title'] }}</div>
        <!-- 第一楼是楼主内容 -->
        <div class="floorItem">
            <div class="user">
                <img class="user_avatar" @click="goToOtherUser(post['p_lz'])"
                    :src="apiStore.getBaseUrl() + apiStore.getPort() + post['u_avatar']">
                <div class="nick" :title="post['u_name']">{{ post['u_nick'] }}</div>
            </div>
            <div class="content">
                <div class="content_main">
                    {{ post['p_content'] }}
                    <div v-if="post['p_pov'] == 'p'" class="pictures">
                        <div class="img" v-for="(picturePath, index) in postPictures" :key="index">
                            <img @click="showPostPreview(apiStore.getBaseUrl() + apiStore.getPort() + picturePath)"
                                :src="apiStore.getBaseUrl() + apiStore.getPort() + picturePath" alt="">
                            <!-- <a :href="apiStore.getBaseUrl() + apiStore.getPort() + picturePath">文件</a> -->
                        </div>
                    </div>
                    <div v-if="post['p_pov'] == 'v'" class="pictures" v-for="(picturePath, index) in postPictures"
                        :key="index">
                        <embed :src="apiStore.getBaseUrl() + apiStore.getPort() + picturePath" width="600" height="400">
                    </div>

                </div>
                <div class="foot">
                    <div class="floorNum">
                        [{{ 1 }}楼]
                    </div>
                    <div class="date">
                        {{ post['p_date'] }}
                    </div>
                    <div class="reply_floor" @click.stop="openReply('text', 'post', '', 0)">
                        回复
                    </div>
                </div>
            </div>

        </div>



        <div class="floorItem replyItem" v-for="(item, index) in replys" :key="index">
            <div class="user">
                <img class="user_avatar" @click="goToOtherUser(item['u_id'])"
                    :src="apiStore.getBaseUrl() + apiStore.getPort() + item['u_avatar']" alt="">
                <div class="nick" :title="item.u_nick">{{ item.u_nick }}</div>
            </div>
            <div class="content">
                <div class="content_main">
                    {{ item.r_content }}
                    <div v-show="item['r_file'] && item['r_pov'] == 'p'">
                        <img class="reply_img"
                            @click="showPostPreview(apiStore.getBaseUrl() + apiStore.getPort() + item['r_file'])"
                            :src="apiStore.getBaseUrl() + apiStore.getPort() + item['r_file']" alt="">
                    </div>
                    <div v-show="item['r_file'] && item['r_pov'] == 'v'">
                        <embed :src="apiStore.getBaseUrl() + apiStore.getPort() + item['r_file']" width="600" height="400">
                    </div>
                </div>
                <div class="foot">
                    <div v-if="item['lowerReply'].length > 0" class="replyToReply scrollbar">
                        <div class="replyToReply_item" v-for="(reply) in item['lowerReply']" :key="reply['r_id']">
                            [<span style="cursor: pointer;" @click="goToOtherUser(reply['u_id'])">{{ reply['u_nick']
                            }}</span>]:<span>{{
    reply['r_content'] }}</span>
                        </div>
                    </div>
                    <div class="floorNum">
                        [{{ index + 2 }}楼]
                    </div>
                    <div class="date">
                        {{ item.r_date }}
                    </div>
                    <div class="reply_floor" @click.stop="openReply('text', 'floor', item.u_nick, item.r_id)">
                        回复
                    </div>
                </div>
            </div>
        </div>

        <div style="height: 30px;">

        </div>







        <!-- 回复组件 -->
        <!-- 底部发表帖子组件 -->
        <div class="createPost" :class="{ openExtend: extendOpen }">
            <img @click.stop="shiftExtend()" src="../../assets/img/reply.png" title="回复到楼底">
            <div class="extend" v-if="extendOpen">
                <div class="extend_item" @click.stop="openReply('text', 'post', '', 0)">
                    <img src="../../assets/img/selectText.png" alt=""><br>
                    <span>文字</span>
                </div>
                <div class="extend_item" @click.stop="openReply('picture', 'post', '', 0)">
                    <img src="../../assets/img/selectpicture.png" alt=""><br>
                    <span>图文</span>
                </div>
            </div>
        </div>

        <!-- 对话框 -->
        <el-dialog v-model="publishReplyDia" title="Tips" width="30%">
            <span>确认以此回复吗?</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="publishReplyDia = false">取消</el-button>
                    <el-button type="primary" @click="publishReply()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { publishReplyApi, publishReplyWithFileApi } from "../../api/replyAPI"
import { updateLastReplyMsgApi } from "../../api/postAPI";
import { addExpApi, getUserByUId } from "../../api/userAPI"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { getCurrentDate } from "../../tools/date"
import { addExpTool } from "../../tools/tools"
import { replyHandle, goToOtherUser } from "../../tools/tools"
import { getReplyByPIdApi } from "../../api/replyAPI"
import { ElMessage } from 'element-plus'
import { storeOfApi } from "../../store/api"
import { useRouter, useRoute } from "vue-router"
const zoneStore = storeOfZone()
const userStore = storeOfUser()
const apiStore = storeOfApi()
const router = useRouter()
const route = useRoute()
// 接收方法
// const emit = defineEmits(['back'])
// 接收参数
// const props = defineProps(['post'])
// console.log("传输的props:", props.post);

// 路由跳转传过来的post对象
let post = ref<any>()
post.value = JSON.parse(route.query.post + '')
console.log("router====>post", post.value);

// goBack
function goBack() {
    router.go(-1)
}
// 刷新帖子方法
// 加载状态
let loadingStatus = ref(false)

// 底部回复组件
// 背景点击方法
function bgClick() {
    // 关闭扩展
    extendOpen.value = false
    // 关闭回复组件
    replyComponentVisual.value = false
    // 关闭延时回复控件
    replyComponentVisualDelay.value = false
}
// 扩展是否打开
let extendOpen = ref(false)
// 切换扩展打开状态
function shiftExtend() {
    extendOpen.value = !extendOpen.value
}

// 回复组件显示
let replyComponentVisual = ref(false)
// 延时显示
let replyComponentVisualDelay = ref(false)
// 回复携带图片或者视频; 空串：没有图片或视频，p：图片，v：视频
let replyPictureOrVideo = ref("")
// 回复是否可以选择文件
let replyWithFile = ref(false)
// 回复位置
let replyLocal = ref('')
// 回复对象的名字
let replyName = ref("")
// 打开回复面板*
function openReply(type, local, name, id) {
    if (type == 'text') {
        replyWithFile.value = false
    } else if (type == 'picture') {
        replyWithFile.value = true
    }
    // 如果是 post则 追加到帖子最后回复
    if (local == 'post') {
        replyLocal.value = 'post'
    } else if (local == 'floor') {
        replyLocal.value = 'floor'
        // 设置回复对象的名字
        replyName.value = name
    }
    // 如果有id，则设置，没有则设为false
    r_id.value = id

    replyComponentVisual.value = true
    // 延时之后再显示控件
    setTimeout(() => {
        replyComponentVisualDelay.value = true
    }, 300);

}

// 图片选择
let fileInput = ref()
// pov
let pov = ref("")
// 选择图片;value的值:p||v
function selectFile(value) {
    pov.value = value

    // 触发input的单击方法
    fileInput.value.click()
}
let file = ref()
let filePath = ref("")
// 文件选择之后存储文件
function selectedFileOnChange(e) {
    file.value = e.target.files[0];
    filePath.value = URL.createObjectURL(file.value)
}
// 预览图片
// 打开预览
function openPreview(path) {
    zoneStore.setPicturePreviewPath(path)
}


// 帖子内容图片预览
function showPostPreview(path) {
    // 修改zoneStore中图片预览的地址，即可预览
    zoneStore.setPicturePreviewPath(path)
}










// 回复内容
let replyContent = ref("")
// 确认回复对话框是否显示
let publishReplyDia = ref(false)
// 是否有回复对象，对象为r_id，值可能是：0 或 某个r_id
let r_id = ref()
// 打开回复对话框方法
function openReplyDia() {
    publishReplyDia.value = true
}
// 回复方法
let formData = new FormData()
function publishReply() {
    // 用户ID
    let u_id = userStore.get('u_id')
    // 帖子ID
    let p_id = post.value['p_id']
    // 内容
    let content = replyContent.value
    // 时间
    let date = getCurrentDate()

    if (pov.value == 'p' || pov.value == 'v') {
        formData.append("u_id", u_id)
        formData.append("p_id", p_id)
        formData.append("content", content)
        formData.append("date", date)
        formData.append("r_id", r_id.value)
        formData.append("pov", pov.value)
        formData.append("u_nick", userStore.get('u_nick'))
        formData.append("file", file.value)
        publishReplyWithFileApi(formData).then(res => {
            console.log(res);
            if (res.status == 200) {
                publishReplyDia.value = false
                message(1, "回复成功")
                // 刷新回复
                getReply()

            } else if (res.status == 201) {
                ElMessage({
                    message: '回复失败',
                    type: 'warning',
                })
                getReply()
            } else {
                ElMessage.error('服务器错误。请稍后重试')
            }
        }).finally(() => { formData = new FormData(); pov.value = ""; file.value = null; filePath.value = "" })
    } else {
        console.log("发送的是不带文件的回复");
        // 是否回复给其他的回复
        publishReplyApi(u_id, p_id, content, date, r_id.value).then(res => {
            if (res.status == 200) {
                publishReplyDia.value = false
                message(1, "回复成功")
                // 调用API，更新帖子的最后回复人u_name和lastreplydate两个字段
                updateLastReplyMsgApi(p_id, u_id, userStore.get('u_nick'), getCurrentDate()).then(res => {
                    console.log(res)
                })
                // 刷新回复
                getReply()

            } else if (res.status == 201) {
                ElMessage({
                    message: '回复失败',
                    type: 'warning',
                })
                getReply()
            } else {
                ElMessage.error('服务器错误。请稍后重试')
            }
        }).finally(() => { pov.value = '' })
    }




}

//  所有回复
let replys = ref()
// 获取回复方法
function getReply() {
    getReplyByPIdApi(post.value['p_id']).then(res => {

        if (res.status == 200) {
            // replys.value = res.data
            console.log("获取到的回复:", res.data);

            replys.value = replyHandle(res.data)
        }
        // 使用工具函数处理一下回复

    })
}
// 帖子的图片
let postPictures = ref<any>([])
onMounted(() => {
    console.log("onmounted");

    // 如果props有东西就直接请求，没有就等1s

    if (post.value['p_picture']) {
        for (const picturePath of post.value['p_picture'].split('?')) {
            if (picturePath) {
                postPictures.value.push(picturePath)
            }
        }

    }
    getReply()
})


// 消息提示方法
function message(type, content) {
    ElMessage({
        message: content,
        type: type == 1 ? 'success' : 'warning',
    })
}
</script>

<style lang="less" scoped>
.openExtend {
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
    // left: 95% !important;
}

.previewPicture {
    position: absolute;
    left: 40%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;

    >img {
        border-radius: 5px;
        width: 300px;
    }
}

.options {
    width: 80%;
    height: 30px;
    background-color: #ececec;
    display: flex;
    align-items: center;

    >button {
        height: 25px;
        width: 80px;
        color: #5865F2;
        cursor: pointer;
        border: none;

        &:hover {
            background-color: #9ca3f2;
            color: white;
            border-radius: 5px;
        }
    }
}



.floor {
    overflow: auto;
    width: 80%;
    height: calc(100% - 50px);
    // height: 90%;
    background-color: white;

    .title {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px dotted #e4e6eb;
        margin-left: 10px;
    }


    .floorItem {
        // min-height: 120px;
        width: 100%;
        border-bottom: 1px dotted #c8c8c8;
        display: flex;



        .user {
            width: 100px;
            border-right: 1px dotted #e4e6eb;

            .user_avatar {
                height: 60px;
                height: 60px;
            }

            .nick {
                width: 90%;
                margin: 0 auto;
                font-size: 14px;

                cursor: default;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
            }

            img {
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
                display: block;
                margin: 0 auto;
                margin-top: 10px;
            }

            >div {
                text-align: center;
                height: 20px;
                line-height: 20px;
            }
        }

        .content {
            min-height: 100px;
            width: 100%;
            padding: 15px;
            letter-spacing: 3px;
            line-height: 20px;

            .content_main {
                min-height: 90px;

                .reply_img {
                    width: 300px;
                    // margin: 0px 5px;
                    margin: 5px 0px;
                    border-radius: 5px;
                    cursor: pointer;
                    box-sizing: border-box;
                    transition: all 0.3s;

                    &:hover {
                        transform: scale(1.05);
                    }
                }

                >.pictures {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 15px;

                    >.img {
                        margin: 5px;

                        img {
                            width: 300px;
                            // margin: 0px 5px;
                            margin: 5px 0px;
                            border-radius: 5px;
                            cursor: pointer;
                            box-sizing: border-box;
                            transition: all 0.3s;

                            &:hover {
                                transform: scale(1.05);
                            }
                        }
                    }
                }
            }
        }

        .foot {
            // height: 20px;
            display: flex;
            justify-content: right;
            font-size: 12px;
            letter-spacing: 1px;

            .replyToReply {
                flex: 1;
                min-height: 0px;
                max-height: 150px;
                padding: 10px;
                padding-left: 30px;
                background-color: #eaeaea;
                margin-right: 20px;
                border-radius: 5px;
                overflow: auto;
                margin-bottom: 10px;
            }

            .floorNum {
                color: #999;
            }

            .date {
                margin-right: 10px;
                color: #999;
            }

            >.reply_floor {
                color: #9ca3f2;
                cursor: pointer;

                &:hover {
                    color: #5865F2;
                }
            }
        }
    }
}

.reply {
    width: 50%;
    // height: 200px;
    transition: height 0.3s;
    background-color: rgba(255, 255, 255, .8);
    position: absolute;
    top: 100%;
    left: 45%;
    transform: translateX(-50%) translateY(-100%);
    z-index: 2;
    box-shadow: 0px -5px 10px -5px black;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    >div {
        text-align: center;

        .reply_title {
            height: 30px;
            line-height: 30px;
            text-align: left;
            color: white;
            font-size: 14px;
            padding-left: 20px;
            // width: 100%;
            background-color: rgb(149, 149, 149);
            margin: 0 auto;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        >textarea {
            height: 70px;
            width: calc(100% - 22px);
            padding: 10px;
            border: none;
            border-bottom: 1px solid #ccc;
            resize: none;

            font-size: 16px;

            &:focus {
                outline: none;
            }

            &:hover {
                outline: none;
            }
        }

        >.bottomOp {
            text-align: right;
            display: flex;
            justify-content: space-between;

            >.fileSelect {
                flex: 1;
                display: flex;
                flex-direction: column;
                text-align: left;
                line-height: 25px;

                >.ico {
                    height: 30px;

                    >img {
                        height: 30px;
                        width: 30px;
                        margin: 0px 5px;
                        cursor: pointer;
                    }
                }

                >.files {
                    >img {
                        height: 50px;
                        width: 50px;
                        cursor: pointer;
                        border-radius: 5px;
                    }
                }
            }

            button {
                margin-right: 3px;
                height: 25px;
                width: 80px;
                border: 1px solid #ccc;
                border-radius: 5px;
                cursor: pointer;
                background-color: white;

                &:hover {
                    border: 1px solid #5865F2;
                    background-color: #5865F2;
                    color: white;
                }
            }
        }

    }
}

.createPost {
    width: 50px;
    height: 50px;
    border: 1px solid #d9d9d9;
    position: absolute;
    top: 85%;
    left: 80%;
    transform: translateY(-50%);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all .3s;
    background-color: white;
    box-shadow:
        0px 0px 10px rgba(0, 0, 0, 0.14),
        0px 0px 80px rgba(0, 0, 0, 0.28);

    &:hover {
        box-shadow:
            0px 0px 1.6px rgba(88, 101, 242, 0.06),
            0px 0px 3.6px rgba(88, 101, 242, 0.087),
            0px 0px 6.3px rgba(88, 101, 242, 0.107),
            0px 0px 10px rgba(88, 101, 242, 0.125),
            0px 0px 15.5px rgba(88, 101, 242, 0.143),
            0px 0px 24.1px rgba(88, 101, 242, 0.163),
            0px 0px 40px rgba(88, 101, 242, 0.3),
            0px 0px 80px rgba(88, 101, 242, 0.4);
    }

    .extend {
        width: 100px;
        height: 50px;
        background-color: rgba(255, 255, 255, .3);
        display: flex;
        position: absolute;
        left: -100px;
        transition: all 0.3s;
        background-color: white;
        box-shadow:
            0px 0px 5.3px rgba(0, 0, 0, 0.101),
            0px 0px 17.9px rgba(0, 0, 0, 0.149),
            0px 0px 80px rgba(0, 0, 0, 0.25);

        >div {
            flex: 1;
        }

        -webkit-animation: scale-in-hor-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: scale-in-hor-right 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

        @-webkit-keyframes scale-in-hor-right {
            0% {
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }

            100% {
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }
        }

        @keyframes scale-in-hor-right {
            0% {
                -webkit-transform: scaleX(0);
                transform: scaleX(0);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }

            100% {
                -webkit-transform: scaleX(1);
                transform: scaleX(1);
                -webkit-transform-origin: 100% 100%;
                transform-origin: 100% 100%;
                opacity: 1;
            }
        }

        .extend_item {
            font-size: 12px;
            padding-top: 5px;
            cursor: pointer;

            &:hover {
                background-color: #ccc;
            }
        }
    }
}
</style>