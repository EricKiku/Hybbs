import request from "./request"

//  创建分区
export const createZoneApi = (name, introduce, lord, createDate) => {
    return request({
        url: "/zone/create",
        method: "POST",
        data: {
            name,
            introduce,
            lord,
            createDate
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

// 更新分区关注数
export const updateZoneFollowApi = (z_id, type) => {
    return request({
        url: "/zone/updateFollow",
        method: "PUT",
        data: {
            z_id,
            type
        }
    })
}

// 获取分区根据z_id
export const getZoneByZIdApi = (z_id) => {
    return request({
        url: "/zone/getByZId",
        method: "GET",
        params: {
            z_id
        }
    })
}

// 获取分区根据用户id
export const getZoneByLordApi = (u_id) => {
    return request({
        url: "/zone/getZoneByLord",
        method: "GET",
        params: {
            u_id
        }
    })
}