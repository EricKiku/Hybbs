

export const getCurrentDate = () => {
    var date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()


    let res = year + "/" + month + "/" + day + " " + hours + ":" + minutes + ":" + seconds
    return res
}