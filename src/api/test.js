import request from "./request"

export const sendApi = ()=>{
    return request({
        url:"/tel",
        method:"GET"
    })
}