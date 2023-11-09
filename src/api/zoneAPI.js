import request from "./request"

//  创建分区
export const createZoneApi = (formData) => {
    return request({
        url: "/zone/create",
        method: "POST",
        data: formData
    })
}

// 修改分区图标
export const updateZoneIconApi = (formData) => {
    return request({
        url: "/zone/updateZoneIcon",
        method: "POST",
        data: formData,
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

// 获取zone根据uid
export const zonesByUIdApi = (uid) => {
    return request({
        url: "/zone/zonesByUId",
        method: "GET",
        params: {
            uid
        }
    })
}