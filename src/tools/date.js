

export const getCurrentDate = () => {
    var date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    let res = year + "/" + month + "/" + day + " " + hours + ":" + minutes
    return res
}