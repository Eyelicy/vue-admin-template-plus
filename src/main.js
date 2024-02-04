import '@/assets/icons/iconfont.css'
import exceptionHandlingOperationComponent from '@/components/exception-handling-operation/index'
import popover from '@/components/popover/index'
import select from '@/components/select/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import Vue3Marquee from 'vue3-marquee'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './style.scss'


createApp(App)
    .use(exceptionHandlingOperationComponent)
    .use(popover)
    .use(select)
    .use(Vue3Marquee)
    .use(ElementPlus)
    .use(router)
    .use(pinia)
    .mount('#app')
