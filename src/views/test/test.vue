<template>
    <div>
        <input @change="change" type="file" name="" value="">
        <a :href="url" :download="url">下载</a>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
let url = ref("")
function change(e) {
    console.log(URL.createObjectURL(e.target.files[0]));
    url.value = URL.createObjectURL(e.target.files[0])
}
</script>

<style lang="less" scoped></style>