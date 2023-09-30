import request from "./request"

//  设置昵称
export const setNickApi = (email, nick) => {
    return request({
        url: "/user/setnick",
        method: "POST",
        data: {
            email,
            nick
        }
    })
}

// 设置关注分区列表，可关注，可取消关注
export const setAttentionZone = (u_att_zone, u_id) => {
    return request({
        url: "/user/attention",
        method: "POST",
        data: {
            u_att_zone,
            u_id
        }
    })
}


// 获取关注分区列表
export const getAttentionZone = (u_id) => {
    return request({
        url: "/user/attention",
        method: "GET",
        params: {
            u_id
        }
    })
}

// 获取用户信息
export const getUserByUId = (u_id) => {
    return request({
        url: "/user/getUser",
        method: "GET",
        params: {
            u_id
        }
    })
}

// 关注用户
export const attentionUserApi = (op_u_id, u_id) => {
    return request({
        url: "/user/attentionUser",
        method: "POST",
        data: {
            op_u_id,
            u_id
        }
    })
}

// 取消关注
export const cancelAttentionUserApi = (op_u_id, u_id, attStr) => {
    return request({
        url: "/user/cancelAttention",
        method: "POST",
        data: {
            op_u_id,
            u_id,
            attStr
        }
    })
}

// 获取分区数和帖子数
export const getUserZoneAndReplyCountApi = (u_id) => {
    return request({
        url: "/user/getZoneAndPostCount",
        method: "GET",
        params: {
            u_id
        }
    })
}

// 获取用户的好友
export const getFriendListApi = (attStr) => {
    return request({
        url: "/user/getFriend",
        method: "GET",
        params: {
            attStr
        }
    })
}


// 签到
export const signinApi = (u_id, date) => {
    return request({
        url: "/user/signin",
        method: "POST",
        data: {
            u_id,
            date
        }
    })
}


// 经验增加
export const addExpApi = (u_id, value) => {
    return request({
        url: "/user/addExp",
        method: "POST",
        data: {
            u_id, value
        }
    })
}