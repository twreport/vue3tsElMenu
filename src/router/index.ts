import { createRouter, Router, createWebHistory, RouteRecordRaw } from "vue-router/dist/vue-router";
import Layout from "@/components/layout.vue"

const routes: RouteRecordRaw[] = [{
    path: '/',
    component: Layout,
    children: [
        {
            path: '/home',
            component: () => import("@/views/home/index.vue"),
            redirect: '/home/children',
            children: [
                {
                    path: '/home/children',
                    component: () => import("@/views/home/children/index.vue"),
                }
            ]
        },
    ]
},  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
}, {
    path: '/register',
    component: () => import('@/views/register/index.vue')
}, {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import("@/views/error/404.vue"),
}]

const router: Router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router