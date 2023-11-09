import { defineStore } from "pinia";
import { setAttentionZone } from "../api/userAPI"
import { updateZoneFollowApi } from "../api/zoneAPI"
import { getCurrentDate } from "../tools/date"
export const storeOfUser = defineStore("user", {
    state: () => {
        return {
            currentUser: {
                u_id: "",
                u_email: "",
                u_password: "",
                u_nick: "",
                u_lv: 0,
                u_att_zone: "",
                u_fensi: 0,
                u_attention: "",
                u_signin_count: 0,
                u_signin_date: "",
                u_exp: 0,
                u_avatar: "",
                color: "",
                chat_color: '',
                posts: 0
            },
            isAlreadySignin: false,
            attentionZones: []
        }
    },
    actions: {
        setCurrentUser(user) {
            console.log("loginByID：", user);
            this.setSignIN(false)
            this.currentUser.u_id = user.u_id;
            this.currentUser.u_email = user.u_email;
            this.currentUser.u_password = user.u_password;
            this.currentUser.u_nick = user.u_nick;
            this.currentUser.u_lv = user.u_lv;
            this.currentUser.u_att_zone = user.u_att_zone;
            this.currentUser.u_fensi = user.u_fensi;
            this.currentUser.u_attention = user.u_attention;
            this.currentUser.u_signin_count = user.u_signin_count;
            this.currentUser.u_signin_date = user.u_signin_date
            if (user.u_signin_date.substring(0, 10) + "" == getCurrentDate().substring(0, 10)) {
                this.setSignIN(true)
            }
            this.currentUser.u_exp = user.u_exp
            this.currentUser.u_avatar = user.u_avatar
            this.currentUser.color = user.color
            this.currentUser.chat_color = user.chat_color
            this.currentUser.posts = user.posts
        },
        // 设置签到
        setSignIN(bool) {
            this.isAlreadySignin = bool
        },
        // 获取其中某个属性
        get(type) {
            if (this.currentUser) {
                return this.currentUser[type];
            }
        },
        // 更新某个属性值
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
        },
        // 获取关注分区
        getAttentionZones() {
            return this.attentionZones
        },
        // 获得分区名，根据分区id
        getZoneName(z_id) {
            for (let i = 0; i < this.attentionZones.length; index++) {
                if (this.attentionZones[i]['z_id'] == z_id) {
                    return this.attentionZones[i]['z_name']
                }
            }
        },
        // 取消关注分区异步事件
        async cancelAttentionZone(z_id) {
            // 当前关注列表
            let attentions = this.currentUser.u_att_zone
            // 转成数组
            let array = attentions.split(",")
            for (let i = 0; i < array.length; i++) {
                if (array[i] == z_id + '') {
                    // 移除该元素，向后端发送请求，更新store
                    array.splice(i, 1)
                    let u_id = this.currentUser.u_id
                    await setAttentionZone(array.join(','), u_id).then(res => {
                        if (res.status == 200) {
                            // 继续请求，更新分区关注-1
                            updateZoneFollowApi(z_id, 'less').then(res => { })
                            this.setPro("u_att_zone", array.join(','))

                        }
                    })
                }
            }
        }
    }
})