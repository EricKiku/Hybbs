import request from "./request"

// 创建频道
export const createChatRoom = (formData) => {
    return request({
        url: "/chatRoom/createChatRoom",
        method: "POST",
        data: formData
    })
}

// 以关键字搜索频道
export const searchRoomApi = (searchKey) => {
    return request({
        url: "/chatRoom/searchRoom",
        method: "GET",
        params: {
            searchKey
        }
    })
}

// 获取用户管理的频道
export const getManagedRoomApi = (u_id) => {
    return request({
        url: "/chatRoom/managedRoom",
        method: "GET",
        params: {
            u_id
        }
    })
}

//  申请加入频道
export const applyJoinRoomApi = (u_id, r_create_user, date) => {
    return request({
        url: "/chatRoom/applyJoin",
        method: "GET",
        params: {
            u_id,
            r_create_user,
            date
        }
    })
}
// 更新某个属性
export const updateStats = (rId, stats, value) => {
    return request({
        url: "/chatRoom/update",
        method: "PUT",
        data: {
            rId,
            stats,
            value
        }
    })
}

//  获取申请人
export const getApplyMember = (u_id) => {
    return request({
        url: "/chatRoom/applyMember",
        method: "GET",
        params: {
            u_id
        }
    })
}

// 更新接收or拒绝
export const updatePermitOrDeny = (aj_id, value, u_id, r_id) => {
    return request({
        url: "/chatRoom/updateApply",
        method: "PUT",
        data: {
            aj_id,
            value,
            u_id,
            r_id
        }
    })
}
// 获取成员
export const getRoomMembers = (r_id) => {
    return request({
        url: "/chatRoom/getMembers",
        method: "GET",
        params: {
            r_id
        }
    })
}

// 踢出频道
export const goOutRoomApi = (ujr_id) => {
    return request({
        url: "/chatRoom/goOutRoom",
        method: "DELETE",
        data: {
            ujr_id
        }
    })
}
// 获取加入的频道
export const getJoinedRoom = (u_id) => {
    return request({
        url: "/chatRoom/getJoinedRoom",
        method: "GET",
        params: {
            u_id
        }
    })
}
// 获取颜色
export const getColorApi = (u_id, r_id) => {
    return request({
        url: "/chatRoom/getColor",
        method: "GET",
        params: {
            u_id,
            r_id
        }
    })
}
//  获取频道记录
export const getRoomChats = (r_id) => {
    return request({
        url: "/chatRoom/getRoomChats",
        method: "GET",
        params: {
            r_id
        }
    })
}
// 设置昵称颜色
export const setNameColorApi = (u_id, color) => {
    return request({
        url: "/user/setNameColor",
        method: "POST",
        data: {
            u_id,
            color
        }
    })
}
// 设置聊天颜色
export const setChatColorApi = (u_id, color) => {
    return request({
        url: "/user/setChatColor",
        method: "POST",
        data: {
            u_id,
            color
        }
    })
}