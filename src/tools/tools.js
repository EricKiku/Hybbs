import { storeOfUser } from "../store/user"
import { storeOfZone } from "../store/zone"
import { useRouter } from "vue-router"
const userStore = storeOfUser()
const zoneStore = storeOfZone()
const router = useRouter()


export const isLogin = () => {
    // 判断是否登录
    if (userStore.currentUser.u_id) {
        return true
    } else {
        return false
    }
}


// 跳转到分区详情页
export const TtoZoneDetails = (z_id) => {
    // 先把store中的当前帖子设置好再跳转
    let res = zoneStore.setZoneById(z_id)
    if (res) {
        router.push({
            name: "/zoneDetails"
        })
    }
}