import { defineStore } from "pinia";

export const storeOfPost = defineStore("post", {
    state: () => {
        return {
            hot_posts: []
        }
    },
    actions: {
        // 设置hot_posts
        setHotPosts(array) {
            this.hot_posts = array
        }
    }
})