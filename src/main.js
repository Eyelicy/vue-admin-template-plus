import '@/assets/icons/iconfont.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './style.scss'

createApp(App).use(ElementPlus).use(router).use(pinia).mount('#app')
