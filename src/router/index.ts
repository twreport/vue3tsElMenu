import {
    createRouter,
    Router,
    createWebHistory,
    RouteRecordRaw,
} from "vue-router/dist/vue-router";
import Layout from "@/components/layout.vue";

const custom_routes: RouteRecordRaw[] = [
    {
        path: "/user/list",
        component: () => import("@/views/user/index.vue"),
    },
    {
        path: "/role/list",
        component: () => import("@/views/role/index.vue"),
    },
    {
        path: "/privilege/list",
        component: () => import("@/views/privilege/index.vue"),
    },
    {
        path: "/project/list",
        component: () => import("@/views/project/index.vue"),
    },
    {
        path: "/knowledge",
        component: () => import("@/views/knowledge/index.vue"),
    },
    {
        path: "/logistics",
        component: () => import("@/views/logistics/index.vue"),
    },
];

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Layout,
        children: [
            {
                path: "/home",
                component: () => import("@/views/home/index.vue"),
                redirect: "/home/children",
                children: [
                    {
                        path: "/home/children",
                        component: () => import("@/views/home/children/index.vue"),
                    },
                ],
            },
            {
                path: "/setup",
                component: () => import("@/views/setup/index.vue"),
            },
            ...custom_routes,
        ],
    },
    {
        path: "/login",
        component: () => import("@/views/login/index.vue"),
    },
    {
        path: "/register",
        component: () => import("@/views/register/index.vue"),
    },
    {
        // path: '/:pathMatch(.*)*',
        path: "/error",
        name: "NotFound",
        component: () => import("@/views/error/404.vue"),
    },
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
