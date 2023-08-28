import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入elements图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
// 引入elements图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)

//绑定页面跳转权限，如果没有登录，直接跳转至登录页面
import "./permission.ts";

app.mount('#app')
