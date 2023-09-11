import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入elements图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import pinia from "./store/store.ts"

console.log('step1')

console.log('pinia', pinia)
// const pinia = createPinia()
pinia.use(piniaPluginPersist);

const app = createApp(App)
app.use(pinia)

// 引入elements图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)

//绑定页面跳转权限，如果没有登录，直接跳转至登录页面
import "./permission.ts";

app.mount('#app')
