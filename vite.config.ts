// import { defineConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // command 变量其实就可以判断当前的环境变量如： 本地运行是server 还是打包是build
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target:env.VITE_APP_SERVICE_URL,
          changeOrigin: true,
          rewrite: (path) => {
              return path.replace(new RegExp(env.VITE_APP_BASE_API, "g"), '')
          }
        }
      }
    }
  }
})
