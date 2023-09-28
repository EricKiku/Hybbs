import request from "./request"

export const searchApi = (searchContent) => {
    return request({
        url: "/search/get",
        method: "GET",
        params: {
            searchContent
        }
    })
}