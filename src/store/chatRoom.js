import { defineStore } from "pinia"
import router from "../router/router"

export const storeOfChatRoom = defineStore('chatRoom', {
    state: () => {
        return {
            // 管理的频道信息
            manageChatRoom: {},
            // 当前进行聊天的频道
            currentRunningRoom: {},
            // 用户加入的频道
            joinedRooms: []
        }
    },
    actions: {
        // 返回管理频道信息
        getManageChatRoom() {
            return this.manageChatRoom
        },
        // 返回管理频道信息的某个属性
        getManageChatRoomStats(stats) {
            return this.manageChatRoom[stats]
        },
        // 显示频道管理页面
        showManageChatRoom(ChatRoom) {
            // 先存储信息，再跳转
            this.manageChatRoom = ChatRoom
            router.push({
                name: "roommanage"
            })
        },
        // 设置用户加入的频道
        setJoinedRooms(rooms) {
            this.joinedRooms = rooms
        },
        // 获取用户加入的频道
        getJoinedRooms() {
            return this.joinedRooms
        },
        // 设置当前聊天的频道
        setCurrentRunningRoom(room) {
            console.log("runningRoom:", room);
            this.currentRunningRoom = room
            // 跳转到聊天房间界面
            router.push({
                name: "chatwindow"
            })
        },
        // 获取 当前聊天的频道
        getCurrentRunningRoom() {
            return this.currentRunningRoom
        }
    }
})