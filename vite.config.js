import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置less全局文件的导入
  css: {
    preprocessorOptions: {
      less: {
        additionalData: "@import './src/assets/css/public.less';"
      }
    }
  }
})
