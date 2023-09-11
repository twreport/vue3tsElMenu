import { defineStore } from 'pinia'

interface UserMenu {
    title: string
    path: string
    children?: UserMenu[]
}

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useMenuStore = defineStore('menu', {
    // other options...
    state: () => {
        // const user_menu_storage = window.localStorage.getItem('user_menu');
        // const user_permission_storage = window.localStorage.getItem('user_permission') as string;
        // console.log('user_menu_storage',user_menu_storage);
        // console.log('user_permission_storage',user_permission_storage);


        // let user_menu:UserMenu[] = [];
        // if(user_menu_storage !== null){
        //     user_menu = JSON.parse(user_menu_storage);
        // }
        // let user_permission:string[] = [];
        // if(user_permission_storage !== null){
        //     user_permission = user_permission_storage.split(',')
        // }
        return {
            'user_menu': null,
            'user_permission': null
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
              key: 'menuStore'
            },
          ]
    },
    getters: {
        getUserMenu(): UserMenu[] {
            return this.user_menu;
        },
        getUserPermission(): string[] {
            return this.user_permission;
        }
    },
    actions: {
        setUserMenu(user_menu: UserMenu[]): void {
            this.user_menu = user_menu;
            // window.localStorage.setItem('user_menu', JSON.stringify(user_menu));
        },
        setUserPermission(user_permission: string[]): void {
            this.user_permission = user_permission;
            // window.localStorage.setItem('user_permission', user_permission.toString());
        }
    }
})