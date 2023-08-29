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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router