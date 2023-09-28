import { defineStore } from "pinia";


export const storeOfChat = defineStore("chat", {
    state: () => {
        return {
            // 是否打开chat窗口
            showChatWindow: false,
            // 聊天对象
            chatUser: {},
        }
    },
    actions: {
        open(user) {
            if (this.showChatWindow == true) {
                this.showChatWindow = false
                setTimeout(() => {
                    this.showChatWindow = true
                    this.chatUser = user
                    console.log("chatuser:", user);
                }, 100);
            } else {
                this.showChatWindow = true
                this.chatUser = user
            }


        },
        close() {
            this.showChatWindow = false
            this.chatUser = {}
        },
        getChatStatus() {
            return this.showChatWindow
        },
        getChatUserByStats(stats) {
            return this.chatUser[stats]
        }
    }
})