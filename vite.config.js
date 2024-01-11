import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '^/api': {
                target: 'https://ucenter.eqscloud.com',
                changeOrigin: true,
            },
        },
    },
    base:"./",
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        // 去除console
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
