import { defineStore } from "pinia";

export const storeOfPost = defineStore("post", {
    state: () => {
        return {
            hot_posts: []
        }
    },
    actions: {
        // 设置hot_posts
        setPosts(array) {
            this.hot_posts = array
        },
        // 获取所有post
        getAllPosts() {
            return this.hot_posts
        }
    }
})