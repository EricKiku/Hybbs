<template>
    <div class="paging">
        <div class="left item" @click="left">
            <img src="../../assets/img/pagingleft.png" alt="">
        </div>
        <div class="item page" :class="{ activated: currentpage == index }" @click="changePage(index)"
            v-for="(index) in pages" :key="index">{{ index }}
        </div>
        <div class="right item" @click="right">
            <img src="../../assets/img/pagingright.png" alt="">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue"

// total:总共多少数据   count：一页几个
let props = defineProps(['total', 'count'])
let emits = defineEmits(['changePage'])

let pages = ref(1)
watchEffect(() => {
    // 计算需要几个格子
    if (props.total <= props.count) {
        pages.value = 1
    } else {
        pages.value = Math.ceil(props.total / props.count)
    }
})
// 当前页面
let currentpage = ref(1)
// 切换页面方法
function changePage(index) {
    // 把分页组件的当前页面也修改了
    currentpage.value = index
    emits("changePage", index)
}
// left
function left() {
    if (currentpage.value == 1) {
        return
    }
    changePage(currentpage.value - 1)
}
// right
function right() {
    if (currentpage.value == pages.value) {
        return
    }
    changePage(currentpage.value + 1)
}
</script>

<style lang="less" scoped>
.activated {
    background-color: #489aff !important;
    color: white !important;
}

.paging {
    height: 60px;
    display: flex;
    user-select: none;

    .item {
        height: 40px;
        width: 40px;
        border: 1px solid #489aff;
        background-color: white;
        color: #489aff;
        margin: 0px 5px;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background-color: #489aff;
            color: white;
        }
    }

    .page {
        line-height: 40px;
    }

    .left,
    .right {
        background-color: #489aff;
        text-align: center;

        &:hover {
            background-color: #80b9ff;
        }

        img {
            height: 20px;
            width: 20px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>