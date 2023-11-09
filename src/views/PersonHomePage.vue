<template>
    <div class="personhp scrollbar">
        <div class="main">
            <div class="head">
                <div class="top"></div>
                <div class="bottom">
                    <div class="avatar_nick" v-if="person">
                        <img :src="apiStore.getBaseUrl() + apiStore.getPort() + person['u_avatar']" alt="">
                        <div class="nick_email">
                            <span class="nick" :style="{ color: person['color'] }">
                                {{ person['u_nick'] }}<span class="lv" :title="'用户等级:' + person['u_lv']">{{ person['u_lv']
                                }}</span>
                            </span>
                            <span class="email">{{ person['u_email'] }}</span>
                        </div>
                    </div>
                    <div class="otherInfo">
                        <div class="local">
                            <img src="../assets/img/local.png" alt="">
                            <div>未知</div>
                        </div>
                    </div>
                    <div class="options">
                        <div class="item" ref="item"
                            :style="{ color: activeItem == 1 || route.name == 'personpost' ? '#489aff' : '#676A79' }"
                            @click="selectItem(1, 'personpost')" @mouseenter="mouseEnter(1)" @mouseleave="mouseLeave">
                            帖子<span>(Post)</span></div>
                        <div class="item" :style="{ color: activeItem == 2 ? '#489aff' : '#676A79' }"
                            @click="selectItem(2, 'personreply')" @mouseenter="mouseEnter(2)" @mouseleave="mouseLeave">
                            回复<span>(Reply)</span></div>
                        <div class="item" :style="{ color: activeItem == 3 ? '#489aff' : '#676A79' }"
                            @click="selectItem(3, 'personzones')" @mouseenter="mouseEnter(3)" @mouseleave="mouseLeave">
                            分区<span>(Zone)</span></div>
                    </div>
                    <div class="pointer" ref="pointer"></div>
                </div>
            </div>
            <div class="list">
                <router-view></router-view>
            </div>
        </div>
        <div class="about">
            <div class="title">个人简介</div>
            <div class="self_introduct">
                个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介
            </div>
            <div class="born item">
                <img src="../assets/img/born.png" alt="">
                <div class="text">
                    生日:
                </div>
                <div class="value">
                    保密
                </div>
            </div>
            <div class="post item">
                <img src="../assets/img/personposts.png" alt="">
                <div class="text">帖子:</div>
                <div class="value">

                </div>
            </div>
            <div class="lv item">
                <img src="../assets/img/lv.png" alt="">
                <div class="text">
                    等级:
                </div>
                <div class="value" v-if="person">
                    {{ person['u_lv'] }}
                </div>
            </div>
            <div class="exp item">
                <img src="../assets/img/exp.png" alt="">
                <div class="text">
                    经验:
                </div>
                <div class="value" v-if="person">
                    <div class="exp" :title="person['u_exp'] + '/' + person['u_lv'] * 100">
                        <div class="num">
                            {{ ((person['u_exp'] / (person['u_lv'] * 100)) * 100).toFixed(1) + "%" }}
                        </div>
                        <div class="exp_value"
                            :style="{ width: ((person['u_exp'] / (person['u_lv'] * 100)) * 100).toFixed(1) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from "vue"
import { storeOfApi } from "../store/api"
import { getUserByUId } from "../api/userAPI"
import { useRoute, useRouter } from "vue-router"
const apiStore = storeOfApi()
const route = useRoute()
const router = useRouter()
// 用户对象
let person = ref()
onMounted(() => {
    if (!route.query.uid) {
        router.go(-1)
    } else {
        getUserByUId(route.query.uid).then(res => {
            console.log("用户获取成功:", res.data);
            if (res.status == 200) {
                person.value = res.data
            } else {
                person.value = null
            }
        })
    }

    // 获取选项单个元素的宽度
    itemWidth.value = item.value.offsetWidth
    // 根据路由设置选中的选项
    switch (route.name) {
        case 'personpost':
            activeItem.value = 1
            break;
        case 'personreply':
            activeItem.value = 2
            break;
        case 'personzones':
            activeItem.value = 3
            break;
        default:
            router.go(-1)
            break;
    }
    // 调用一次鼠标移出事件
    mouseLeave()
})

// 高亮显示当前选中的哪个选项
let activeItem = ref(1)
// 鼠标点击选择
function selectItem(value, path) {
    // 设置当前高亮的选项
    activeItem.value = value;
    // 移动指示器的位置到当前高亮选项
    let pointerDom = pointer.value
    pointerDom.style.left = (activeItem.value - 1) * itemWidth.value + "px"
    // 选择路由
    router.push({
        name: path,
        query: {
            uid: route.query.uid
        }
    })

}
// 鼠标移入事件，移入时计算位置
function mouseEnter(value) {
    setPointerLeft(value)
}
// 鼠标移出事件，将指示器位置重新回归到选中的选项位置
function mouseLeave() {
    let pointerDom = pointer.value
    pointerDom.style.left = (activeItem.value - 1) * itemWidth.value + "px"
}
// 计算head组件底部的指示器的位置
let pointer = ref()

// 单个选项组件的宽度
let itemWidth = ref(0)
// 获取item的DOM元素
let item = ref()
// 设置指示器的临时（鼠标悬浮）位置方法
function setPointerLeft(value) {
    let pointerDom = pointer.value
    pointerDom.style.left = (value - 1) * itemWidth.value + "px"
}
</script>

<style lang="less" scoped>
.personhp {
    width: 100%;
    background-color: white;
    background-image: url("../assets/img/postsbg.jpg");
    /* 背景图垂直、水平均居中 */
    background-position: center center;
    /* 背景图不平铺 */
    background-repeat: no-repeat;
    /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
    background-attachment: fixed;
    /* 让背景图基于容器大小伸缩 */
    background-size: cover;
    display: flex;
    justify-content: center;
    padding-top: 50px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
        /* Chrome Safari */
    }

    .main {
        // width: 1140px;
        width: 735px;
        margin-right: 20px;
        box-sizing: border-box;

        .head {
            height: 400px;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;

            .top {
                height: 200px;
                width: 100%;
                background-image: url("../assets/img/personhpbg.jpg");
            }

            .bottom {
                height: 200px;
                background-color: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .avatar_nick {
                    position: relative;
                    height: 80px;
                    display: flex;

                    img {
                        height: 120px;
                        width: 120px;
                        margin-top: -40px;
                        margin-left: 40px;
                        border-radius: 50%;
                        box-sizing: border-box;
                        border: 4px solid white;
                    }

                    .nick_email {
                        height: 80px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 0px 10px;

                        .nick {
                            font-size: 20px;
                            font-weight: bold;
                            padding: 5px 0px;

                            .lv {
                                display: inline-block;
                                height: 20px;
                                width: 20px;
                                text-align: center;
                                line-height: 20px;
                                font-size: 18px;
                                padding: 2px;
                                background-color: #489aff;
                                color: white;
                                font-style: italic;
                                border-radius: 5px;
                                cursor: default;
                            }
                        }

                        .email {
                            color: #676A79;
                        }

                    }
                }

                .otherInfo {
                    padding: 5px 40px;
                    height: 40px;
                    box-sizing: border-box;

                    .local {
                        height: 100%;
                        display: flex;

                        img {
                            position: relative;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        div {
                            line-height: 30px;
                            font-size: 16px;
                            color: #676A79;
                            letter-spacing: 5px;
                        }
                    }
                }

                .options {
                    flex: 1;
                    border-top: 1px solid #ccc;
                    display: flex;
                    padding: 0px 40px;

                    .item {
                        height: fit-content;
                        position: relative;
                        width: 100px;
                        padding: 10px 0px;
                        text-align: center;
                        top: 50%;
                        transform: translateY(-50%);
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        color: #676A79;
                        font-weight: bold;

                        &:hover {
                            color: #489aff !important;
                        }

                        span {
                            font-size: 14px;
                            color: #676A79;
                        }
                    }
                }

                .pointer {
                    height: 5px;
                    width: 100px;
                    background-color: #489aff;
                    margin-left: 40px;
                    position: relative;
                    transition: all 0.3s;
                    border-radius: 2.5px;
                }
            }
        }

        .list {
            margin-top: 20px;
        }
    }

    .about {
        width: 385px;
        box-sizing: border-box;
        height: 300px;
        background-color: white;
        padding: 20px;
        border-radius: 10px;

        .title {
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 20px;
        }

        .self_introduct {
            line-height: 25px;
            color: #676A79;
            margin: 10px 0px;
        }

        .item {
            height: 30px;
            display: flex;

            .text {
                line-height: 30px;
                color: #676A79;
            }

            .value {
                line-height: 30px;
                font-size: 16px;
                font-weight: 700;
                // letter-spacing: 5px;
            }
        }

        .lv {
            .value {
                height: 100%;
                width: 30px;
                box-sizing: border-box;
                padding: 0px 5px;
                text-align: center;
                background-color: #489aff;
                color: white;
                border-radius: 5px;
                font-style: italic;
            }
        }

        .exp {
            position: relative;

            .num {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateY(-50%) translateX(-50%);
                color: #89beff;
            }

            .value {
                height: 15px;
                flex: 1;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                border: 1px solid #489aff;
                border-radius: 15px;
                overflow: hidden;

                .exp_value {
                    height: 15px;
                    // background-color: #489aff;
                    background: rgb(72, 154, 255);
                    background: linear-gradient(90deg, rgba(72, 154, 255, 1) 0%, rgba(255, 149, 43, 1) 58%, rgba(189, 15, 0, 1) 100%, rgba(255, 255, 255, 1) 255%);
                }
            }
        }
    }
}
</style>