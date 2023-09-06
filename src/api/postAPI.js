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
export const getPost=()=>{
    return request({
        url:"/post/getPost",
        method:"GET",
    })
}