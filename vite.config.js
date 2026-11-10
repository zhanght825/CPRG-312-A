import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/cprg-312/',
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:3002', changeOrigin: true },
    },
  },
})
