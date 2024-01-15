import { routes } from '@/router/routes'
import { useUserStore } from '@/store/user'
import NProgress from '@/utils/nprogress'
import { createRouter, createWebHashHistory } from 'vue-router'
import { config } from '/config.js'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    document.title = to.meta.title ? `${config.title}-${to.meta.title}` : `${config.title}`
    if (userStore.token || whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        console.log('全部重定向到登录页')
        next('/login') // 全部重定向到登录页
    }
})

router.afterEach((to, _from) => {
    NProgress.done()
})

export default router
