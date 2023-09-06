// 对API进行统一管理
import request from './request'
//request 就是 axios

// 发送邮箱验证码并且获取验证码
export const getYzmAPI = (email) => {
    return request({
        url: '/login/yzm',
        method: 'GET',
        params: {
            email
        }
    })
}

// 验证邮箱是否存在
export const findEmailAPI = (email) => {
    return request({
        url: "/login/emailExist",
        method: "GET",
        params: {
            email
        }
    })
}

// 注册
export const registerAPI = (email, password) => {
    return request({
        url: "/login/register",
        method: "POST",
        data: {
            email,
            password
        }
    })
}

// 登录
export const loginAPI = (email, password) => {
    return request({
        url: "/login/login",
        method: "POST",
        data: {
            email,
            password
        }
    })
}

// 根据id登录
export const loginByid = (id) => {
    return request({
        url: "/login/loginById",
        method: "POST",
        data: {
            id
        }
    })
}