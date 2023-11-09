import request from "./request"

export const publishReplyApi = (u_id, p_id, r_content, r_date, r_id) => {
    return request({
        url: "/reply/publish",
        method: "POST",
        data: {
            u_id,
            p_id,
            r_content,
            r_date,
            r_id
        }
    })
}
// 回复带文件
export const publishReplyWithFileApi = (formData) => {
    return request({
        url: "/reply/publishWithFile",
        method: "POST",
        data: formData
    })
}
// 回复给回复
export const publishReplyToReplyApi = (u_id, p_id, r_content, r_date, r_id) => {
    return request({
        url: "/reply/publishToReply",
        method: "POST",
        data: {
            u_id,
            p_id,
            r_content,
            r_date,
            r_id
        }
    })
}
// 根据 p_id 获取回复
export const getReplyByPIdApi = (p_id) => {
    return request({
        url: "/reply/get",
        method: "GET",
        params: {
            p_id
        }
    })
}

// 根据 uid获取回复
export const getReplyByUIdApi = (u_id) => {
    return request({
        url: "/reply/getByUId",
        method: "GET",
        params: {
            u_id
        }
    })
}

// 根据rid和rreply获取回复
export const getReplyByRId = (rid) => {
    return request({
        url: "/reply/byRId",
        method: "GET",
        params: {
            rid
        }
    })
}