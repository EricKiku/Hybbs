import { storeOfUser } from "../store/user"
import { storeOfZone } from "../store/zone"
import { getZone } from "../api/zoneAPI"
import { addExpApi, getUserByUId } from "../api/userAPI"
import { storeOfStatus } from "../store/status"
import { ElMessage } from 'element-plus'
import router from "../router/router"
const userStore = storeOfUser()
const zoneStore = storeOfZone()
const statusStore = storeOfStatus()

export const isLogin = () => {
    // 判断是否登录
    if (userStore.currentUser.u_id) {
        return true
    } else {
        return false
    }
}


// 跳转到分区详情页
export const TtoZoneDetails = (z_id) => {
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}
// 跳转到分区2.0
export const ToZoneDetails2 = (zone) => {
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setCurrentPreviewZone(zone)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}
// 点击帖子标题跳转到帖子
export const ToPostDetails = (z_id, obj) => {

    let zone = JSON.stringify(JSON.parse(JSON.stringify(obj)))
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "post",
            query: {
                post: JSON.stringify(obj)
            }
        })
    }
}
// 根据关注分区字符串更新关注列表
// now 为立即更新，不需要手动去刷新
export const UpdateAttentions = (now) => {
    let attentionStr = userStore.currentUser.u_att_zone
    let attentionArray = attentionStr ? attentionStr.split(",") : [];
    getZone().then(res => {
        if (res.status == 200) {
            // 外层遍历所有分组
            let tempArr = []
            for (let j = 0; j < attentionArray.length; j++) {
                for (let i = 0; i < res.data.length; i++) {
                    // 内层遍历所有关注字符串
                    if (attentionArray[j] == res.data[i]["z_id"]) {
                        // 获得关注的分区信息，追加到result中
                        tempArr.push(res.data[i])
                    }
                }
            }
            // 把tempArr给result，如果store中有则不赋予，把store中的赋予，让用户手动刷新
            if (!userStore.attentionZones.length || now) {
                userStore.setAttentionZones(tempArr)
            }
            // 把statusStore中的状态设为true
            statusStore.setLoadingSuccess(true)
        }
    })
}


// 处理嵌套回复
export const replyHandle = (replys) => {
    // 先把所有r_reply == 0 的对象找出来，添加到一个临时数组
    let directReply = []
    let replyToReply = []
    // 分离出直接回复和回复给回复
    for (let i = 0; i < replys.length; i++) {
        if (!replys[i]['r_reply']) {
            directReply.push(replys[i])
        } else {
            replyToReply.push(replys[i])
        }
    }
    console.log("replytoreply:", replyToReply);
    // 给所有直接回复添加属性
    for (let r = 0; r < directReply.length; r++) {
        directReply[r].lowerReply = []
    }

    // 遍历间接回复数组
    for (let i = 0; i < replyToReply.length; i++) {
        // 获取到索引后，给该对象添加一个数组属性
        let index = findReply(directReply, replyToReply[i].r_reply)
        directReply[index].lowerReply.push(replyToReply[i])
    }
    return directReply
}

// 找到r_reply对应的对象是多少索引
function findReply(replys, r_id) {
    for (let j = 0; j < replys.length; j++) {
        if (replys[j].r_id == r_id) {
            return j
        }
    }
}



// 跳转到其他用户信息页面
export const goToOtherUser = (uId) => {
    console.log("传递之前的uId:", uId);
    router.push({
        name: "/otherUser",
        query: {
            uId: uId
        }
    })
}


// 加经验
export const addExpTool = (u_id, value, callback) => {
    addExpApi(u_id, value).then(res => {
        if (res.status == 200) {
            callback(1, "经验 + " + value)
            // 获取一下用户信息
            getUserByUId(u_id).then(res => {
                if (res.status == 200) {
                    userStore.setCurrentUser(res.data)
                }
            })
        }
    })
}

// 消息提示方法
export const message = (type, content) => {
    ElMessage({
        message: content,
        type: type == 1 ? 'success' : 'warning',
    })
}


// 处理置顶帖子
export const handleTopPost = (posts) => {
    // 置顶标志：p_top = 1
    let topArr = []
    let normalArr = []
    for (const post of posts) {
        if (post['p_top'] == 1) {
            topArr.push(post)
        } else {
            normalArr.push(post)
        }
    }
    return [...topArr, ...normalArr]
}