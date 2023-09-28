<template>
    <div class="menu" :style="{ left: props.x + 'px', top: props.y + 'px' }">
        <div class="item">
            <span>用户页面</span>
        </div>
        <div class="item">
            <span>聊天窗口</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
let props = defineProps(["x", "y"])
console.log("menu:", props.x, props.y);

</script>

<style lang="less" scoped>
.menu {
    position: absolute;

    background-color: white;
    border-radius: 5px;
    padding: 5px;
    box-shadow:
        0px 0px 5.3px rgba(0, 0, 0, 0.129),
        0px 0px 17.9px rgba(0, 0, 0, 0.191),
        0px 0px 80px rgba(0, 0, 0, 0.32);


    .item {
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: rgb(225, 225, 225);
        }
    }

}
</style>