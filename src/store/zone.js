import { defineStore } from "pinia";

export const storeOfZone = defineStore("zone", {
    state: () => {
        return {
            allZone: [],
            currentPreviewPost: {
                current_online: 0,
                z_follows: 0,
                z_icon: "",
                z_id: 0,
                z_introduce: "",
                z_name: "",
                z_posts: 0,
                z_zonelord: 0
            }

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
                    this.currentPreviewPost = this.allZone[i]
                    return true
                }
            }
        }
    }
})