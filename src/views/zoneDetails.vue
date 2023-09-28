<template>
    <div class="zonedetails" v-if="zoneStore.currentPreviewZone">
        <div class="mask" v-show="dialogVisual"></div>
        <!-- 发帖对话框 -->
        <div class="dialog" v-show="dialogVisual">
            <div @click="closeDialog()" class="close"></div>
            <div class="title"><b>发帖<span style="color: #868686;">(分区:{{ zoneStore.currentPreviewZone['z_name']
            }})</span></b></div>
            <CreatePost @submit="closeDialog()" :zone-name="zoneStore.currentPreviewZone['z_name']" />
        </div>

        <!-- 其他用户简略信息弹出框 -->
        <div v-if="otherUserDia">
            <OtherUserInfoVue @close="claceOtherUserDai" @refreshPost="refreshZone" :coord="coord" :uid="open_u_id">
            </OtherUserInfoVue>
        </div>

        <div class="cover">
            <div class="zoneInfoTop">
                <b class="z_name" :title="zoneStore.currentPreviewZone['z_name']">{{ zoneStore.currentPreviewZone['z_name']
                }}</b>
                <!-- 在用户关注列表中找，没有显示关注，有就显示取消关注 -->
                <el-button v-show="!userStore.findValueWithUAttZone(zoneStore.currentPreviewZone.z_id)" class="attention"
                    @click="attentionZone()" :loading="attBtnLoading" :disabled="attBtnLoading">关注</el-button>
                <button v-show="userStore.findValueWithUAttZone(zoneStore.currentPreviewZone.z_id)"
                    class="attention cancel_attention" @click="cancelAttentionZone()" :loading="attBtnLoading">取消关注</button>
                <div class="msg">
                    <span>关注:<span>{{ zoneStore.currentPreviewZone['z_follows'] }}</span></span>
                    <span>帖子:<span>{{ zoneStore.currentPreviewZone['z_posts'] }}</span></span>
                </div>
            </div>
        </div>
        <div class="main">
            <img class="zoneIcon" :src="'src/zoneIcon/' + zoneStore.currentPreviewZone['z_id'] + '.jpg'" alt="">
            <div class="zoneInfoBottom">
                <div class="introduce"> {{ zoneStore.currentPreviewZone["z_introduce"] }}</div>
                <div class="zoneCreateDate">
                    <span>分区创建时间:{{ zoneStore.currentPreviewZone["z_createDate"] }}</span>
                </div>
                <div class="zoneLord">
                    区主:<span @click="goToOtherUser(zoneStore.currentPreviewZone['u_id'])"
                        :title="'查看用户:' + zoneStore.currentPreviewZone['u_nick']">{{
                            zoneStore.currentPreviewZone["u_nick"] }}</span>
                </div>
            </div>
            <div @click="bgClick" class="postList scrollbar">
                <div class="postTitle">
                    <div class="t1" :class="{ active: optionPost == 1 }" @click="shiftOptionPost(1)">
                        帖子
                    </div>
                    <div class="t1" :class="{ active: optionPost == 2 }" @click="shiftOptionPost(2)">
                        只看区主
                    </div>
                    <div @click="refreshZone(false)" class="t1" title="刷新本页">
                        刷新
                    </div>
                    <div class="t2">
                        <input>
                    </div>
                    <div>
                        <img src="../assets/img/search.png" alt="">
                    </div>
                </div>
                <div class="list scrollbar" v-show="!showPost" v-loading="loadingStatus"
                    element-loading-background="rgba(0, 0, 0, 0.2)">
                    <div class="postItem" v-for="(item, index) in posts" :key="item['p_id']">
                        <div class="title"><span @click="showPostDetail(item)">{{ item['p_title'] }}</span></div>
                        <div class="content" :title="item['p_content']">
                            <div>{{ item['p_content'] }}</div>
                        </div>
                        <div class="user">
                            <div class="user_item" style="display: flex;">
                                <img src="../assets/img/user_post.png">
                                <span @click="goToOtherUser(item['p_lz'])" title="楼主">{{ item['u_name'] }}</span>
                            </div>
                            <div class="user_item" style="display: flex;">
                                <img src="../assets/img/lastreply.png">
                                <span @click="goToOtherUser(item['last_u_id'])" title="最后回复">{{ item['last_u_name']
                                }}</span>
                            </div>
                            <div class="user_item replyCount" style="display: flex;" title="回复数">
                                <img src="../assets/img/replyCount.png">
                                <span>{{ item['p_reply'] }}</span>
                            </div>
                            <div style="flex: 1;display: flex;justify-content: right;">
                                <div class="user_item date" style="display: flex;">
                                    <img src="../assets/img/createdate.png">
                                    <span style="border-bottom: none;" title="创建时间">{{ item['p_date'] }}</span>
                                </div>
                                <div class="user_item date" style="display: flex;">
                                    <img src="../assets/img/replydate.png">
                                    <span style="border-bottom: none;" title="最后回复时间">{{ item['last_reply_date'] }}</span>
                                </div>
                            </div>

                        </div>

                        <div class="floor">

                        </div>
                    </div>
                </div>
                <div class="postDetail" v-if="showPost">
                    <PostDetail :post="currentPost" @back="closePostDetail()" />
                </div>








                <!-- 底部发表帖子组件 -->
                <div class="createPost" :class="{ openExtend: extendOpen }" v-if="!showPost">
                    <img @click.stop="shiftExtend()" src="../assets/img/createpost.png" title="写一个帖子">
                    <div class="extend" v-if="extendOpen">
                        <div class="extend_item" @click="openDialog('text')">
                            <img src="../assets/img/selectText.png" alt=""><br>
                            <span>文字</span>
                        </div>
                        <div class="extend_item" @click="openDialog('picture')">
                            <img src="../assets/img/selectpicture.png" alt=""><br>
                            <span>图文</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRaw } from "vue"
import { useRoute, useRouter } from "vue-router"
import { storeOfZone } from "../store/zone";
import { storeOfUser } from "../store/user"
import { getPostByZoneId, updateZoneFollowApi, getZoneByZIdApi } from "../api/zoneAPI"
import { setAttentionZone, getAttentionZone } from "../api/userAPI"
import CreatePost from "../components/zone/CreatePost.vue"
import PostDetail from "../components/zone/PostDetail.vue"
import { ElMessage } from 'element-plus'
import OtherUserInfoVue from "../components/zone/OtherUserInfo.vue";
import { goToOtherUser } from "../tools/tools"
const route = useRoute()
const router = useRouter()
const zoneStore = storeOfZone()
const userStore = storeOfUser()

// 消息提示
function message(type, value) {
    ElMessage({
        message: value,
        type: type == 1 ? 'success' : 'warning',
    })
}
// 该分区的所有帖子
let posts = ref([])
// 加载状态
let loadingStatus = ref(false)
// 如果 currentPreviewPost中没有值，则跳到首页
onMounted(() => {

    // 如果store中的currentZone没有数据，先去localStorage中取，如果没有则跳到主页
    if (!zoneStore.currentPreviewZone.z_id) {
        // 从local拿到zone，直接设置到currentZone
        let zone = JSON.parse(<string>localStorage.getItem("currentZone"))
        zoneStore.setCurrentPreviewZone(zone)
        // 获取该分区的所有帖子
        getPost(false)
    } else {
        // 把 zone 存到localStorage
        localStorage.setItem("currentZone", JSON.stringify(zoneStore.getCurrentPriviewZone()))
        // 进来就去获取该分区的所有帖子
        getPost(false)
    }

    // 路由参数接收
    let zone = <any>route.query.zone
    // 如果zone不为空，才做JSON转换
    // 如果zone不为空，则直接跳到帖子
    if (zone && JSON.parse(zone)) {
        showPostDetail(JSON.parse(zone))
    }


})
// 刷新按钮方法
function refreshZone(post) {
    // 先去获取zone，再获取帖子
    let z_id = zoneStore.getCurrentPriviewZone()['z_id']
    getZoneByZIdApi(z_id).then(res => {
        if (res.status == 200) {
            // 把返回的数据设置，调用zoneStore.setCurrentPreviewZone
            zoneStore.setCurrentPreviewZone(res.data)
            // 在获取帖子
            getPost(post)
        }
    })
}
// 获取分区帖子的方法
function getPost(post) {
    // 进入加载状态
    loadingStatus.value = true
    getPostByZoneId(zoneStore.currentPreviewZone['z_id']).then(res => {
        if (res.status == 200) {
            if (res.data) {
                posts.value = res.data.reverse()
                // 如果 showPost 为true，则说明是从用户信息框来的，直接显示该post即可
                if (post) {
                    showPostDetail(post)
                }
            } else {
                posts.value = []
            }

        }
    }).finally(() => { loadingStatus.value = false })
}
// 关注按钮加载状态
let attBtnLoading = ref(false)
// 点击关注方法
function attentionZone() {
    if (zoneStore.currentPreviewZone) {
        // 进入加载状态
        attBtnLoading.value = true
        let z_id = zoneStore.currentPreviewZone['z_id']
        let u_id = userStore.currentUser['u_id']
        // 先获取关注列表，再请求追加，再更新store
        let currentAttentionZone = userStore.currentUser.u_att_zone
        // 追加的关注列表字符串
        let addString = currentAttentionZone + z_id + ","
        setAttentionZone(addString, u_id).then(res => {
            if (res.status == 200) {

                getAttentionZone(u_id).then(res => {
                    if (res.status == 200) {
                        // 继续请求，给分区关注+1
                        updateZoneFollowApi(z_id, 'add').then(response => {
                            if (response.status == 200) {
                                message(1, "关注成功")
                                // 更新store
                                userStore.setPro("u_att_zone", res.data)
                            } else {
                                message(2, "关注失败")
                            }
                        })

                    } else {
                        message(2, "关注失败")
                    }
                })
            } else {
                message(2, "关注失败")
            }
            // 退出加载状态
            attBtnLoading.value = false
        }, rej => { attBtnLoading.value = false })
    }

}


// 点击取消关注

function cancelAttentionZone() {
    // 进入加载状态
    attBtnLoading.value = true
    let z_id = zoneStore.currentPreviewZone.z_id

    // 调用store中方法
    userStore.cancelAttentionZone(z_id)
    // 重新获取用户的关注字符串，如果和store中的一样，那就是操作成功
    getAttentionZone(userStore.currentUser.u_id).then(res => {
        if (res.data == userStore.currentUser.u_att_zone) {
            message(1, "取消关注成功")
            attBtnLoading.value = false
        }
    })


}




// 背景点击方法
function bgClick() {


    // 关闭扩展
    extendOpen.value = false
}


// 扩展是否打开
let extendOpen = ref(false)
// 扩展动效宽度
let extendWidth = ref(0)
// 切换扩展打开状态
function shiftExtend() {
    extendOpen.value = !extendOpen.value
}


// 对话框显示
let dialogVisual = ref(false)
// 打开对话框方法
function openDialog(value) {
    dialogVisual.value = true
}
// 关闭对话框方法
function closeDialog() {
    dialogVisual.value = false
    // 关闭之后再刷新一次帖子列表
    getPost(false)
}


// 看帖还是只看区主
let optionPost = ref(1)
// 切换
function shiftOptionPost(params: number) {
    optionPost.value = params
}


// 是否查看帖子
let showPost = ref(false)
// 当前帖子
let currentPost = ref()
// 打开帖子详情
function showPostDetail(post) {

    currentPost.value = post
    showPost.value = true
}
// 关闭帖子详情
function closePostDetail() {
    currentPost.value = null
    showPost.value = false
}

// 其他用户信息弹出框
let otherUserDia = ref(false)

// 坐标对象
let coord = ref({ x: 0, y: 0 })
// 点击的用户id
let open_u_id;
// 打开其他用户弹出框
function openOtherUser(e, u_id) {
    if (otherUserDia.value) {
        otherUserDia.value = false
    }
    // 设置点击的用户
    open_u_id = u_id
    // 先把坐标设置好
    coord.value.x = e.x
    coord.value.y = e.y

    // 再显示弹出框
    otherUserDia.value = true
}
// 关闭弹出框
function claceOtherUserDai() {
    console.log("关闭弹出框");

    otherUserDia.value = false
}
</script>

<style lang="less" scoped>
// 动效代码
.openExtend {
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

// 看帖或只看区主选中时样式
.active {
    background-color: #ccc;
}

.zonedetails {
    width: 100%;
    height: 100%;
    border-top-left-radius: 10px;
    overflow: hidden;

    .mask {
        width: calc(100% - 60px);
        height: calc(100% - 30px);
        position: absolute;
        background-color: black;
        opacity: .5;
        z-index: 1;
    }

    .dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 2;

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

        .title {
            position: absolute;
            left: 30px;
            top: 20px;
        }

        .public {}
    }

    .cover {
        height: 100px;
        width: 100%;
        background-color: white;
        border-top-left-radius: 10px;
        background: rgb(226, 255, 253);
        background: linear-gradient(163deg, rgba(226, 255, 253, 1) 0%, rgba(221, 255, 198, 1) 15%, rgba(169, 255, 208, 1) 46%, rgba(201, 255, 183, 1) 76%, rgba(255, 255, 255, 1) 100%);
        border-bottom: 1px solid #ccc;

        .zoneInfoTop {
            height: 40px;
            width: calc(100% - 200px);
            line-height: 40px;
            position: relative;
            top: calc(100% - 40px);
            left: 200px;
            font-size: 24px;
            display: flex;

            .z_name {
                width: 200px;
                /* 强制不换行 */
                white-space: nowrap;
                /* 文字用省略号代替超出的部分 */
                text-overflow: ellipsis;
                /* 匀速溢出内容，隐藏 */
                overflow: hidden;
            }

            .attention {
                border: 1px solid #5865F2;
                height: 30px;
                width: 80px;
                cursor: pointer;
                border-radius: 5px;
                color: #5865F2;
                transition: all 0.2s;
                font-size: 16px;
                margin-top: 5px;
                background-color: rgba(255, 255, 255, 0.4);

                &:hover {
                    background-color: #5865F2;
                    color: white;
                }
            }

            .cancel_attention {
                border: 1px solid #aeaeae;
                color: #aeaeae;
            }

            .msg {
                flex: 1;
                text-align: center;
                font-size: 16px;

                >span {
                    margin-right: 20px;
                    color: #aaa;

                    >span {
                        color: #ff7f3e;
                    }
                }
            }
        }
    }

    .main {
        width: 100%;
        height: calc(100% - 101px);
        // background-color: #ececec;
        background: rgb(220, 239, 254);
        background: linear-gradient(79deg, rgba(220, 239, 254, 1) 0%, rgba(221, 255, 198, 1) 100%);


        .zoneIcon {
            height: 120px;
            width: 120px;
            border-radius: 8px;
            position: absolute;
            padding: 3px;
            border: 1px solid #F4C7C8;
            margin-left: 60px;
            margin-top: -60px;
        }

        .zoneInfoBottom {
            width: calc(100% - 200px);
            height: 40px;
            line-height: 40px;
            position: relative;
            top: 0px;
            left: 200px;
            color: #5c5c5c;
            display: flex;
            justify-content: space-between;

            .introduce {
                width: 340px;
            }

            .zoneCreateDate,
            .zoneLord {
                flex: 1;
            }

            .zoneCreateDate {
                >span {
                    color: #ccc;
                    cursor: default;

                    &:hover {
                        color: black;
                    }
                }

            }

            .zoneLord {
                >span {
                    cursor: pointer;
                }
            }
        }

        .postList {
            width: calc(100% - 60px);
            height: calc(100% - 71px);
            padding-left: 60px;
            padding-top: 30px;


            >.postTitle {
                height: 40px;
                line-height: 40px;
                width: 80%;
                background-color: #ececec;
                border: 1px solid #ccc;
                display: flex;

                >div {
                    height: 100%;
                }

                .t1 {
                    width: 100px;
                    text-align: center;
                    cursor: pointer;

                    &:hover {
                        background-color: #ccc;
                    }

                }

                .t2 {
                    flex: 1;
                    text-align: right;

                    >input {
                        height: 20px;
                        border: 1px solid #ccc;
                        padding: 3px;
                        border-radius: 5px;

                        // transition: all 0.3s;
                        &:hover {
                            outline: none;
                            border: 1px solid #ccc;
                        }

                        &:focus {
                            outline: 1px solid #5865F2;
                            border: none;
                        }
                    }


                }

                img {
                    cursor: pointer;
                    vertical-align: middle;
                    margin-right: 30px;
                }
            }

            .list {
                overflow: auto;
                width: 80%;
                height: calc(100% - 42px);
                background-color: white;

                .postItem {
                    height: 40px;
                    border-bottom: 1px dotted #e4e6eb;
                    padding: 20px;

                    &:hover {
                        background-color: #f3f4f7;
                    }

                    .title {
                        font-size: 18px;
                        color: #5865F2;
                        height: 20px;
                        line-height: 20px;

                        >span {
                            cursor: pointer;

                            &:hover {
                                border-bottom: 1px solid #5865F2;
                            }
                        }
                    }

                    .content {
                        font-size: 14px;
                        height: 20px;
                        line-height: 20px;

                        >div {
                            width: 600px;
                            /* 强制不换行 */
                            white-space: nowrap;
                            /* 文字用省略号代替超出的部分 */
                            text-overflow: ellipsis;
                            /* 匀速溢出内容，隐藏 */
                            overflow: hidden;
                        }
                    }

                    .user {
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                        color: #b3b3b3;
                        display: flex;

                        .user_item {
                            padding-right: 10px;
                        }

                        img {
                            height: 12px;
                            width: 12px;
                            margin-top: 4px;
                        }

                        span {
                            cursor: pointer;

                            &:hover {
                                border-bottom: 0.5px solid #ccc;
                            }
                        }

                        .date {
                            width: 140px;
                            color: #b3b3b3;
                        }

                        .replyCount {
                            cursor: default;
                            color: rgb(189, 48, 48);

                            >span {
                                cursor: default;
                            }
                        }
                    }
                }
            }

            .postDetail {
                width: calc(80% + 2px);
                height: calc(100% - 42px);
                background-color: white;
                position: relative;
                top: 0px;
                border-left: 0.5px dotted #ccc;
                border-right: 0.5px dotted #ccc;
                /*右*/
                // box-shadow: -10px 0 5px -5px #ccc, 10px 0 5px -5px #ccc;
            }

            .createPost {
                width: 50px;
                height: 50px;
                background-color: #967879;
                position: absolute;
                top: 90%;
                left: 80%;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                cursor: pointer;
                transition: all .3s;
                box-shadow:
                    0px 0px 5.3px rgba(0, 0, 0, 0.101),
                    0px 0px 17.9px rgba(0, 0, 0, 0.149),
                    0px 0px 80px rgba(0, 0, 0, 0.25);

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
        }
    }
}
</style>