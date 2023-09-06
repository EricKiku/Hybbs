import request from "./request"

//  创建分区
export const createZoneApi = (name, introduce, lord) => {
    return request({
        url: "/zone/create",
        method: "POST",
        data: {
            name,
            introduce,
            lord
        }
    })
}

// 上传图片和id
export const uploadpictureApi = (formData) => {
    return request({
        url: "/zone/uploadpicture",
        method: "POST",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }

    })
}

// 获取所有分区
export const getZone = () => {
    return request({
        url: "/zone/getzone",
        method: "GET",
    })
}


//  获取分区所有帖子
export const getPostByZoneId = (z_id) => {
    return request({
        url: "/zone/getPostByZone",
        method: "GET",
        params: {
            z_id
        }
    })
}