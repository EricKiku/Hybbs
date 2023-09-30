<template>
    <div class="options">
        <button @click="emitBack">{{ '<' }}返回</button>
    </div>
    <div class="reply" :style="{ height: replyComponentVisual ? '200px' : '0px' }">
        <div v-show="replyComponentVisualDelay">
            <div class="reply_title">
                <span v-if="replyLocal == 'post'">回复到帖子(追加到最后一楼)</span>
                <span v-if="replyLocal == 'floor'">回复给:{{ replyName }}</span>
            </div>
            <textarea @keyup.enter="openReplyDia()" placeholder="在此书写回复内容,点击回复按或按下键盘回车键发送消息"
                v-model="replyContent"></textarea>
            <div>
                <button @click="openReplyDia()">回复</button>
            </div>
        </div>
    </div>

    <div class="floor scrollbar" @click="bgClick()">
        <div class="title">{{ post['p_title'] }}</div>
        <!-- 第一楼是楼主内容 -->
        <div class="floorItem">
            <div class="user">
                <img @click="goToOtherUser(post['p_lz'])" src="../../assets/img/avatar.png" alt="">
                <div class="nick" :title="post['u_name']">{{ post['u_name'] }}</div>
            </div>
            <div class="content">
                <div class="content_main">{{ post['p_content'] }}</div>
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
        <div class="floorItem" v-for="(item, index) in replys" :key="index">
            <div class="user">
                <img @click="goToOtherUser(item['u_id'])" src="../../assets/img/avatar.png" alt="">
                <div class="nick" :title="item.u_nick">{{ item.u_nick }}</div>
            </div>
            <div class="content">
                <div class="content_main">{{ item.r_content }}</div>
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
import { publishReplyApi, publishReplyToReplyApi } from "../../api/replyAPI"
import { updateLastReplyMsgApi } from "../../api/postAPI";
import { addExpApi, getUserByUId } from "../../api/userAPI"
import { storeOfZone } from "../../store/zone"
import { storeOfUser } from "../../store/user"
import { getCurrentDate } from "../../tools/date"
import { addExpTool } from "../../tools/tools"
import { replyHandle, goToOtherUser } from "../../tools/tools"
import { getReplyByPIdApi } from "../../api/replyAPI"
import { ElMessage } from 'element-plus'
const zoneStore = storeOfZone()
const userStore = storeOfUser()
// 接收方法
const emit = defineEmits(['back'])
// 接收参数
const props = defineProps(['post'])

// 测试
function addExp() {
    let u_id = userStore.get("u_id")
    let value = 1
    addExpTool(u_id, value, message)
}

// 返回
function emitBack() {
    emit('back')
}

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
// 回复位置
let replyLocal = ref('')
// 回复对象的名字
let replyName = ref("")
// 打开回复面板
function openReply(type, local, name, id) {
    if (type == 'text') {
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
    } else if (type == 'picture') {

    }
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
function publishReply() {
    // 用户ID
    let u_id = userStore.get('u_id')
    // 帖子ID
    let p_id = props.post.p_id
    // 内容
    let content = replyContent.value
    // 时间
    let date = getCurrentDate()

    // 是否回复给其他的回复
    publishReplyApi(u_id, p_id, content, date, r_id.value).then(res => {
        if (res.status == 200) {
            publishReplyDia.value = false
            message(1, "回复成功")
            addExp()
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
    })


}

//  所有回复
let replys = ref()
// 获取回复方法
function getReply() {
    getReplyByPIdApi(props.post.p_id).then(res => {

        if (res.status == 200) {
            // replys.value = res.data
            replys.value = replyHandle(res.data)
        }
        // 使用工具函数处理一下回复

    })
}
onMounted(() => {
    // 如果props有东西就直接请求，没有就等1s
    if (props) {
        getReply()
    } else {
        setTimeout(() => {
            getReply()
        }, 500);
    }
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
    left: 95% !important;
}

.options {
    width: 100%;
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
    height: calc(100% - 30px);

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
                padding: 10px;
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
    width: 100%;
    // height: 200px;
    transition: height 0.3s;
    background-color: rgba(255, 255, 255, .8);
    position: absolute;
    top: 100%;
    transform: translateY(-100%);
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
            height: 100px;
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

        >div {
            text-align: right;

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
    left: 90%;
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