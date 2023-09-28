import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: '/forum',
        component: () => import("../views/Forum.vue")
    },
    {
        path: "/plaza",
        name: "/plaza",
        component: () => import("../views/Plaza.vue")
    },
    {
        path: "/login",
        name: "/login",
        component: () => import("../components/Log&Reg.vue")
    },
    {
        path: "/create_zone",
        name: "/create_zone",
        component: () => import("../views/CreateZone.vue")
    },
    {
        path: "/zoneDetails",
        name: "/zoneDetails",
        component: () => import("../views/zoneDetails.vue")
    },
    {
        path: "/userinfo",
        name: "/userinfo",
        component: () => import("../views/userInfo.vue")
    },
    {
        path: "/otherUser",
        name: "/otherUser",
        component: () => import("../views/OtherUserInfo.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router