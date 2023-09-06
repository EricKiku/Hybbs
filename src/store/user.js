import { defineStore } from "pinia";

export const storeOfUser = defineStore("user", {
    state: () => {
        return {
            currentUser: {
                u_id: "",
                u_email: "",
                u_password: "",
                u_nick: "",
                u_lv: 0,
                u_att_zone: ""
            },
            attentionZones: []
        }
    },
    actions: {
        setCurrentUser(user) {
            this.currentUser.u_id = user.u_id;
            this.currentUser.u_email = user.u_email;
            this.currentUser.u_password = user.u_password;
            this.currentUser.u_nick = user.u_nick;
            this.currentUser.u_lv = user.u_lv;
            this.currentUser.u_att_zone = user.u_att_zone
        },
        // 获取其中某个属性
        get(type) {
            if (this.currentUser) {
                return this.currentUser[type];
            }
        },
        // 设置其中某个值
        setPro(property, value) {
            this.currentUser[property] = value
        },
        // 判断u_att_zone是否存在参数值，并返回bool
        findValueWithUAttZone(value) {
            // 分解字符串
            let attentionZones = this.currentUser.u_att_zone.split(",")
            for (let i = 0; i < attentionZones.length; i++) {
                if (attentionZones[i] == value) {
                    return true
                }
            }
            return false
        },
        // 设置关注分区
        setAttentionZones(arr) {
            this.attentionZones = arr
        }
    }
})