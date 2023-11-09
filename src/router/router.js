import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: 'home',
        component: () => import("../views/Forum.vue"),
        redirect: "/home/posts",
        children: [
            {
                path: "/home/posts",
                name: "posts",
                meta: {
                    keepAlive: true
                },
                component: () => import("../components/forum/Hot_post.vue")
            },
            {
                path: "/home/postDetails",
                name: "postDet",
                meta: {
                    keepAlive: true
                },
                component: () => import("../views/PostDetails.vue")
            },
            {
                path: "/home/replyDetail",
                name: "replyDet",
                meta: {
                    keepAlive: true
                },
                component: () => import("../views/ReplyDetail.vue")
            }
        ]
    },
    {
        path: "/plaza",
        name: "/plaza",
        component: () => import("../views/ChatRoom.vue"),
        children: [
            {
                path: "/plaza/default",
                name: "/default",
                component: () => import("../components/chatRoom/Default.vue")
            },
            {
                path: "/plaza/roommanage",
                name: "roommanage",
                component: () => import("../views/chatRoom/RoomManage.vue")
            },
            {
                path: "/plaza/chatwindow",
                name: "chatwindow",
                component: () => import("../components/chatRoom/ChatWindow.vue")
            }
        ]
    },
    {
        path: "/zone",
        name: "zone",
        component: () => import("../views/ZoneDetail.vue")
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
        component: () => import("../views/zoneDetails.vue"),
        redirect: "/zoneDetails/postlist",
        children: [
            {
                path: "/zoneDetails/postlist",
                name: "postlist",
                component: () => import("../views/PostList.vue")
            },
            {
                path: "/zoneDetails/post",
                name: "post",
                component: () => import("../components/zone/PostDetail.vue")
            }
        ]
    },
    {
        path: "/personhomepage",
        name: "personhp",
        component: () => import("../views/PersonHomePage.vue"),
        redirect: "/personhomepage/posts",
        children: [
            {
                path: "/personhomepage/posts",
                name: "personpost",
                component: () => import("../views/personhomePage/personPosts.vue")
            },
            {
                path: "/personhomepage/replys",
                name: "personreply",
                component: () => import("../views/personhomePage/personReply.vue")
            },
            {
                path: "/personhomepage/zones",
                name: "personzones",
                component: () => import("../views/personhomePage/personZone.vue")
            }
        ]
    },
    {
        path: "/otherUser",
        name: "/otherUser",
        component: () => import("../views/OtherUserInfo.vue")
    },
    {
        path: "/404",
        name: "404",
        component: () => import("../views/404.vue")
    },
    {
        path: '/:pathMatch(.*)',
        redirect: "/404"
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router