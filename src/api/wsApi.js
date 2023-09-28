import request from "./request"


export const wsConnApi = (sendUId, ReceUId) => {
    return request({
        url: "/ws/conn",
        method: "GET",
        params: {
            sendUId,
            ReceUId
        }
    })
}