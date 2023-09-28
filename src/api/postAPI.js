import request from "./request"

// 发表帖子
export const publishPostApi = (z_id, u_id, u_name, title, content, date) => {
    return request({
        url: "/post/publishPost",
        method: "POST",
        data: {
            z_id,
            u_id,
            u_name,
            title,
            content,
            date
        }
    })
}

// 获取所有帖子
export const getPost = () => {
    return request({
        url: "/post/getPost",
        method: "GET",
    })
}

// 更新 最后回复
export const updateLastReplyMsgApi = (p_id, u_id, u_name, date) => {
    return request({
        url: "/post/updateLast",
        method: "PUT",
        data: {
            p_id,
            u_id,
            u_name,
            date
        }
    })
}

// 获取帖子
export const getPostByPlzApi = (p_lz) => {
    return request({
        url: "/post/getPostByPlz",
        method: "GET",
        params: {
            p_lz
        }
    })
}