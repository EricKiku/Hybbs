<template>
    <div class="newest_post">
        <div class="title">
            最新帖子
        </div>
        <div class="post_list scrollbar">
            <div class="list_item" v-for="(item, index) in newest_post_zone" :key="item['p_id']">
                <!-- <div class="item"> -->
                <div @click="toZoneDetail(item['z_id'])" class="zoneName"
                    :title="item['z_name'] + ':' + item['z_introduce']">
                    [<div>{{ item['z_name'] }}</div>]
                </div>
                <div @click="toPostDetails(item['z_id'], item)" class="postTitle"
                    :title="'[' + item['p_title'] + ']' + (item['p_content'] + '').slice(0, 10) + '...'">
                    <div>{{ item['p_title'] }}</div>
                </div>
                <!-- </div> -->

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { storeOfPost } from "../../store/post"
import { storeOfUser } from "../../store/user"
import { useRouter, useRoute } from "vue-router"
import { storeOfZone } from "../../store/zone"
const postStore = storeOfPost()
const userStore = storeOfUser()
const router = useRouter()
const route = useRoute()
const zoneStore = storeOfZone()

// 关注分区的新帖子
let newest_post_zone = ref([])
// 侦听 userStore中的attentionZones，有变化就刷新
watchEffect(() => {
    // 获取关注分区的帖子
    // 先获取所有帖子，再和用户关注字符串对比
    let posts = postStore.getAllPosts()
    let attentions = userStore.attentionZones
    // 定义结果集
    let resultArr = []
    for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < attentions.length; j++) {
            if (posts[i]['z_id'] == attentions[j]['z_id']) {
                resultArr.push(posts[i])
            }
        }
    }
    console.log(resultArr);
    newest_post_zone.value = resultArr
})

// 点击分区名字跳转到分区
function toZoneDetail(z_id) {

    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}
// 点击帖子标题跳转到帖子
function toPostDetails(z_id, obj) {

    let zone = JSON.stringify(JSON.parse(JSON.stringify(obj)))
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "post",
            query: {
                post:JSON.stringify(obj)
            }
        })
    }
}
</script>

<style lang="less" scoped>
.newest_post {
    flex: 1;
    // height: 330px;
    padding: 10px;
    background-color: rgba(255, 255, 255, .8);

    .title {
        color: #7c7c7c;
        margin-bottom: 10px;
    }

    .post_list {
        overflow: auto;
        // height: 300px;
        width: 100%;

        .list_item {
            display: flex;
            cursor: default;
            margin-bottom: 5px;

            .zoneName {
                display: flex;
                cursor: pointer;

                &:hover {
                    color: #5865F2;
                }

                >div {
                    max-width: 50px;
                    /* 强制不换行 */
                    white-space: nowrap;
                    /* 文字用省略号代替超出的部分 */
                    text-overflow: ellipsis;
                    /* 匀速溢出内容，隐藏 */
                    overflow: hidden;
                }
            }

            .postTitle {
                cursor: pointer;

                &:hover {
                    color: #5865F2;
                }

                >div {
                    max-width: 120px;
                    /* 强制不换行 */
                    white-space: nowrap;
                    /* 文字用省略号代替超出的部分 */
                    text-overflow: ellipsis;
                    /* 匀速溢出内容，隐藏 */
                    overflow: hidden;
                }
            }
        }
    }
}
</style>