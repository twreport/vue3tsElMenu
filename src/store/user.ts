import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('main', {
    // other options...
    state: () => {
        return {
            'user_name': window.localStorage.getItem('user_name')?window.localStorage.getItem('user_name'):'',
            'user_id': window.localStorage.getItem('user_id')?Number(window.localStorage.getItem('user_id')):0,
            'password': window.localStorage.getItem('password')?window.localStorage.getItem('password'):'',
            'access_token': window.localStorage.getItem('access_token')?window.localStorage.getItem('access_token'):'',
            'expires': window.localStorage.getItem('expires')?Number(window.localStorage.getItem('expires')):0
        }
    },
    getters: {
        getUserName(): string | null{
            const user_name = window.localStorage.getItem('user_name');
            console.log("user_name in storage:", user_name);

            if (user_name !== null && user_name !== '') {
                return user_name;
            } else {
                return this.user_name;
            }
        },
        getAccessToken(): string | null{
            const access_token = window.localStorage.getItem('access_token');
            if (access_token) {
                return access_token;
            } else {
                return this.access_token;
            }
        },
        getUserId(): number | null{
            const user_id = window.localStorage.getItem('user_id');
            if (user_id) {
                return Number(user_id);
            } else {
                return this.user_id;
            }
        },
        getExpires(): number | null{
            const expires = window.localStorage.getItem('expires');
            if (expires) {
                return Number(expires);
            } else {
                return this.expires;
            }
        }
    },
    actions: {
        setUserName(user_name: string): void {
            this.user_name = user_name;
            window.localStorage.setItem('user_name', user_name);
        },
        setUserId(user_id: number): void {
            this.user_id = user_id;
            window.localStorage.setItem('user_id', user_id.toString());
        },
        setAccessToken(access_token: string): void {
            this.access_token = access_token;
            window.localStorage.setItem('access_token', access_token);
        },
        setExpires(expires: number): void {
            window.localStorage.setItem('expires', expires.toString());
        }
    }
    
})