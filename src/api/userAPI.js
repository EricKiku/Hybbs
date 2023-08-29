import request from "./request"

export const setNickApi = (email, nick) => {
    return request({
        url: "/user/setnick",
        method: "POST",
        data: {
            email,
            nick
        }
    })
}