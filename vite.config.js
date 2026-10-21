import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],

	base: '/cprg-312/',

	server: {
		proxy: {
			'/api': {
				target: 'https://localhost:3000',
				changeOrigin: true,
				secure: false
			}
		}
	}
})
