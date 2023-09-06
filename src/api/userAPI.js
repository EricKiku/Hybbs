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

// 设置关注分区列表
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