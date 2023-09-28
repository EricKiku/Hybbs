import { defineStore } from "pinia"

export const storeOfStatus = defineStore("status", {
    state: () => {
        return {
            loadingSuccess: false
        }
    },
    actions: {
        // 设置状态值
        setLoadingSuccess(bool) {
            this.loadingSuccess = bool
        },
        // 获取状态值
        getLoadingSuccess() {
            return this.loadingSuccess
        }
    }
})