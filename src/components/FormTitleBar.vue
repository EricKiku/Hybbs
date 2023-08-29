<template>
    <!-- 标题栏 -->
    <div class="FormTitleBar">
        <div class="icon">
            <div class="formImg">
                <img src="../assets/img/fav.png" alt="">
            </div>
            <div class="formTitle">Hybbs@1.0.0</div>
        </div>
        <div class="buttonGroup">
            <div @click="menuButtonClick('min')" class="btn formMin">
                <img src="../assets/img/minimization.png" alt="最小化" title="最小化">
            </div>
            <!-- <div v-if="!maximize" @click="maximumSwitching()" class="btn formMax">
                <img src="../assets/img/max.png" alt="最大化" title="最大化">
            </div>
            <div v-if="maximize" @click="maximumSwitching()" class="btn formMax">
                <img src="../assets/img/unmax.png" alt="还原" title="还原">
            </div> -->
            <div @click="menuButtonClick('close')" class="btn close formClose">
                <img src="../assets/img/close.png" alt="关闭" title="关闭">
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
// 引入渲染器进程脚本
import { menuButtonClick } from "../../renderer"

// 判断是否进入最大化窗口
let maximize = ref(false)

// 最大化切换方法
function maximumSwitching() {
    if (!maximize.value) {
        menuButtonClick('max')
        maximize.value = true
    } else {
        menuButtonClick('unmaximize')
        maximize.value = false
    }
    console.log(maximize.value);

}
</script>

<style lang="less" scoped>
.FormTitleBar {
    height: 30px;
    width: 100%;
    background: @OutBackgroundLinear;
    background: @OutBackgroundLinear2;
    -webkit-app-region: drag;
    color: white;
    // 开启flex
    display: flex;
    justify-content: space-between;

    .icon {
        // 开启flex
        display: flex;

        .formImg {
            img {
                margin-top: 2.5px;
                margin-left: 5px;
                margin-right: 5px;
            }
        }

        .formTitle {
            line-height: 30px;
            color: #7f7f7f;
            font-size: 14px;
        }
    }

    .buttonGroup {
        // 开启flex
        display: flex;
        height: 30px;
        // electron 的标题栏 属性
        -webkit-app-region: no-drag;

        .btn {
            height: 30px;
            width: 40px;

            img {
                margin-left: 10px;
                margin-top: 5px;
            }

            &:hover {
                background-color: @BackgroundHover;
            }


        }

        .close:hover {
            background-color: rgb(255, 62, 62);
            color: white;
        }
    }
}
</style>