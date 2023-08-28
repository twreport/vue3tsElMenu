/**
 * 登录权限校验
 */

import router from "./router/index.ts";
import loginApi from "./api/login";

const refreshLimit: number = 30 * 60;

router.beforeEach((to, from, next) => {
    console.log(from);

    const access_token: string | null = window.localStorage.getItem('access_token');
    const expires: number | null = Number(window.localStorage.getItem('expires'));
    const now: number = Date.parse(new Date().toString()) / 1000;

    //核心逻辑是判断是否超时
    //如果没有token则重新登录；
    //如果有token但登录时间已经超过token时限则重新登录
    //如果有token但登录时间已经超过token时限但还未超过refresh时限，则refresh

    if (access_token === '' || access_token === undefined || access_token === null) {
        //如果token不存在,则直接进入登录页面
        if (to.path !== "/login" && to.path !== "/register") {
            next({
                path: "/login"
            });
        } else {
            next();
        }
    } else if (expires === null || expires < now) {
        //如果已经超时，则直接进入登录页面
        if (to.path !== "/login") {
            next({
                path: "/login"
            });
        } else {
            next();
        }
    } else if (expires < (now + refreshLimit)) {
        //虽然没有超时，但已经接近超时（进入倒计时refreshLimit），则刷新token
        loginApi
            .refresh_token(access_token as string)
            .then(response => {
                window.localStorage.setItem('access_token', response.data.access_token)
                window.localStorage.setItem('expires', response.data.expires)
            }).catch(function (error) {
                console.log(error)
                //如果refresh_token失败,则直接进入登录页面
                if (to.path !== "/login") {
                    next({
                        path: "/login"
                    });
                } else {
                    next();
                }
            });
    } else {
        //如果一切正常则正常进入页面
        next();
    }
}) 