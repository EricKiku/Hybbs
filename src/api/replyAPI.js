import request from "./request"

export const publishReplyApi = (u_id, p_id, r_content, r_date) => {
    return request({
        url: "/reply/publish",
        method: "POST",
        data: {
            u_id,
            p_id,
            r_content,
            r_date
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