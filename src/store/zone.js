import { defineStore } from "pinia";

export const storeOfZone = defineStore("zone", {
    state: () => {
        return {
            allZone: [],
            currentPreviewZone: {
                current_online: 0,
                z_follows: 0,
                z_icon: "",
                z_id: 0,
                z_introduce: "",
                z_name: "",
                z_posts: 0,
                z_zonelord: 0
            },
            createPostDiaVisual: false,
            // 所有图片预览组件显示与否
            picturePreviewPath: ""

        }
    },
    actions: {
        // 设置所有分区
        setAllZone(value) {
            this.allZone = value
        },
        // 通过id获取分区信息
        setZoneById(z_id) {
            for (let i = 0; i < this.allZone.length; i++) {
                if (this.allZone[i].z_id == z_id) {
                    // 直接设置到currentPriviewPost
                    this.currentPreviewZone = this.allZone[i]
                    return true
                }
            }
        },
        // 获取所有分区
        getAllZones() {
            return this.allZone
        },
        // 设置currentZone
        setCurrentPreviewZone(zone) {
            this.currentPreviewZone = zone
            if (this.currentPreviewZone.z_id) {
                return true
            }
        },
        // 获取当前zone
        getCurrentPriviewZone() {
            return this.currentPreviewZone
        },
        get(stats) {
            return this.currentPreviewZone[stats]
        },
        // 设置创建帖子对话框显示与否
        setCreatePostDia(value) {
            this.createPostDiaVisual = value
        },
        // 获取创建帖子对话框显示与否
        getCreatePostDia() {
            return this.createPostDiaVisual
        },
        // 改变预览图片组件地址
        setPicturePreviewPath(value) {
            this.picturePreviewPath = value
        },
        // 获取预览图片组件的地址
        getPicturePreviewPath() {
            return this.picturePreviewPath
        }
    }
})