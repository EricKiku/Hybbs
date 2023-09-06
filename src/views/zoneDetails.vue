<template>
    <div class="zonedetails" v-if="zoneStore.currentPreviewPost">
        <div class="mask" v-show="dialogVisual"></div>
        <!-- 发帖对话框 -->
        <div class="dialog" v-show="dialogVisual">
            <div @click="closeDialog()" class="close"></div>
            <div class="title"><b>发帖<span style="color: #868686;">(分区:{{ zoneStore.currentPreviewPost['z_name']
            }})</span></b></div>
            <CreatePost @submit="closeDialog()" :zone-name="zoneStore.currentPreviewPost['z_name']" />
        </div>
        <div class="cover">
            <div class="zoneInfoTop">
                <b class="z_name" :title="zoneStore.currentPreviewPost['z_name']">{{ zoneStore.currentPreviewPost['z_name']
                }}</b>
                <!-- 在用户关注列表中找，没有显示关注，有就显示取消关注 -->
                <button v-show="!userStore.findValueWithUAttZone(zoneStore.currentPreviewPost.z_id)" class="attention"
                    @click="attentionZone()">关注</button>
                <button v-show="userStore.findValueWithUAttZone(zoneStore.currentPreviewPost.z_id)"
                    class="attention cancel_attention" @click="cancelAttentionZone()">取消关注</button>
                <div class="msg">
                    <span>关注:<span>{{ zoneStore.currentPreviewPost['z_follows'] }}</span></span>
                    <span>帖子:<span>{{ zoneStore.currentPreviewPost['z_posts'] }}</span></span>
                </div>
            </div>
        </div>
        <div class="main">
            <img class="zoneIcon" :src="'src/zoneIcon/' + zoneStore.currentPreviewPost['z_id'] + '.jpg'" alt="">
            <div class="zoneInfoBottom">
                {{ zoneStore.currentPreviewPost["z_introduce"] }}
            </div>
            <div @click="bgClick" class="postList scrollbar">
                <div class="postTitle">
                    <div class="t1" :class="{ active: optionPost == 1 }" @click="shiftOptionPost(1)">
                        帖子
                    </div>
                    <div class="t1" :class="{ active: optionPost == 2 }" @click="shiftOptionPost(2)">
                        只看区主
                    </div>
                    <div class="t2">
                        <input>
                    </div>
                    <div>
                        <img src="../assets/img/search.png" alt="">
                    </div>
                </div>
                <div class="list scrollbar" v-show="!showPost">
                    <div class="postItem" v-for="(item, index) in posts" :key="item['p_id']">
                        <div class="title"><span @click="showPostDetail(item)">{{ item['p_title'] }}</span></div>
                        <div class="content" :title="item['p_content']">
                            <div>{{ item['p_content'] }}</div>
                        </div>
                        <div class="user">
                            <div class="user_item" style="display: flex;">
                                <img src="../assets/img/user_post.png">
                                <span title="楼主">{{ item['u_name'] }}</span>
                            </div>
                            <div class="user_item" style="display: flex;">
                                <img src="../assets/img/lastreply.png">
                                <span title="最后回复">{{ 'erickiku' }}</span>
                            </div>
                            <div style="flex: 1;display: flex;justify-content: right;">
                                <div class="user_item date" style="display: flex;">
                                    <img src="../assets/img/createdate.png">
                                    <span style="border-bottom: none;" title="创建时间">{{ item['p_date'] }}</span>
                                </div>
                                <div class="user_item date" style="display: flex;">
                                    <img src="../assets/img/replydate.png">
                                    <span style="border-bottom: none;" title="最后回复时间">{{ item['p_date'] }}</span>
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
import { getPostByZoneId } from "../api/zoneAPI"
import { setAttentionZone, getAttentionZone } from "../api/userAPI"
import CreatePost from "../components/zone/CreatePost.vue"
import PostDetail from "../components/zone/PostDetail.vue"
import { ElMessage } from 'element-plus'
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

// 如果 currentPreviewPost中没有值，则跳到首页
onMounted(() => {
    // 如果store中没有数据，则跳到主页
    if (!zoneStore.currentPreviewPost.z_id) {
        router.go(-1)
    } else {
        // 进来就去获取该分区的所有帖子
        getPost()
    }

    // 路由参数接收
    let zone = <any>route.query.zone
    // 如果zone不为空，才做JSON转换
    // 如果zone不为空，则直接跳到帖子
    if (zone && JSON.parse(zone)) {
        showPostDetail(JSON.parse(zone))
    }


})
// 获取分区帖子的方法
function getPost() {
    getPostByZoneId(zoneStore.currentPreviewPost['z_id']).then(res => {
        if (res.status == 200) {
            posts.value = res.data.reverse()
        }
    })
}
// 点击关注方法
function attentionZone() {
    if (zoneStore.currentPreviewPost) {
        let z_id = zoneStore.currentPreviewPost['z_id']
        let u_id = userStore.currentUser['u_id']
        // 先获取关注列表，再请求追加，再更新store
        let currentAttentionZone = userStore.currentUser.u_att_zone
        // 追加的关注列表字符串
        let addString = currentAttentionZone + z_id + ","
        setAttentionZone(addString, u_id).then(res => {
            if (res.status == 200) {

                // 更新store
                getAttentionZone(u_id).then(res => {
                    if (res.status == 200) {
                        message(1, "关注成功")
                        userStore.setPro("u_att_zone", res.data)
                    } else {
                        message(2, "关注失败")
                    }
                })
            } else {
                message(2, "关注失败")
            }
        })
    }

}
// 点击取消关注
function cancelAttentionZone() {
    let z_id = zoneStore.currentPreviewPost.z_id

    // 当前关注列表
    let attentions = userStore.currentUser.u_att_zone
    // 转成数组
    let array = attentions.split(",")
    for (let i = 0; i < array.length; i++) {
        if (array[i] == z_id + '') {
            // 移除该元素，向后端发送请求，更新store
            array.splice(i, 1)
            let u_id = userStore.currentUser.u_id
            setAttentionZone(array.join(','), u_id).then(res => {
                if (res.status == 200) {
                    message(1, "取消关注成功")
                    userStore.setPro("u_att_zone", array.join(','))
                } else {
                    message(2, "取消关注失败")
                }
            })
        }
    }

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
    getPost()
}


// 看帖还是只看区主
let optionPost = ref(1)
// 切换
function shiftOptionPost(params: number) {
    if (params == 1) {
        optionPost.value = 1
    } else if (params == 2) {
        optionPost.value = 2
    }
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
                            width: 112px;
                            color: #b3b3b3;
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