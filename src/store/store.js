import { defineStore } from "pinia";

export const useStore = defineStore("store", {
    state: () => {
        return {
            // posts滚动位置
            postScrollTop:0
        }
    },
    actions: {
        // 设置滚动位置
        setPostScrollTop(value){
            this.postScrollTop = value
        },
        // 获取滚动位置
        getPostScrollTop(value){
            return this.postScrollTop
        }
    }
})