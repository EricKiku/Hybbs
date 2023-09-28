import request from "./request"

export const getChatBySendAndReceId = (sendId, receId) => {
    return request({
        url: "/chat/getChatBySendAndReceId",
        method: "GET",
        params: {
            sendId,
            receId
        }
    })
}