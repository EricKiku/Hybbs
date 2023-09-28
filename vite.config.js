import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 导入elementplus按需导入组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  server: {

    proxy: {
      '/api': {
        target: 'http://localhost:1234',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 配置less全局文件的导入
  css: {
    preprocessorOptions: {
      less: {
        additionalData: "@import './src/assets/css/public.less';"
      }
    }
  }
})
