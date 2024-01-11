import { useUserStore } from '@/store/user'
import axios from 'axios'
import { config } from '/config'

const {
    baseUrl: { tobacco: commerceUrl },
    appGuid,
} = config

const tobacco = axios.create({
    baseURL: commerceUrl,
    timeout: 1000 * 10,
})

// 请求拦截器
tobacco.interceptors.request.use(
    (config) => {
        const {
            token,
            userInfo: { guid },
            storeId,
        } = useUserStore()
        // guid = userStore.userInfo.guid
        config.headers.Authorization = `app_guid=${appGuid};`
        token && (config.headers.token = token)
        guid && (config.headers.UserGuid = guid)
        storeId && (config.headers.storeId = storeId)
        return config
    },
    (error) => {
        return Promise.error(error)
    }
)

export const tobaccoApi = async (method, url, info) => {
    try {
        const response = await tobacco.request({ url: url, data: info, method: method })
        if (response.status === 200 && response.data.code === 200) {
            return response.data
        } else {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('错误提示'))
                    ElMessageBox.alert(response.data.msg || response.data.msg, '错误提示', {
                        confirmButtonText: '确认',
                        callback: (action) => {
                            resolve(false)
                        },
                    })
                }, 300)
            })
        }
    } catch (err) {
        if (err.response.status == '401')
            ElMessage.error('当前请求需要用户验证，刷新当前页面或重新登录！')
        else if (err.response.status == '403') ElMessage.error('您没有权限访问！')
        else if (err.response.status == '404') ElMessage.error('请求失败，请求的资源不存在！')
        else if (err.response.status == '405')
            ElMessage.error('请求中指定的请求方法不能被用于请求相应的资源。')
        else if (err.response.status == '500') ElMessage.error('服务器错误！')
        else if (err.response.statusmsg == 'Network Error')
            ElMessage.error('网络错误，请检查网络！')
        else if (err.response.status > 400 && err.response.status < 500)
            ElMessage.error('客户端请求错误！')
        else if (err.response.status > 500) ElMessage.error('服务器错误！')
        else {
            ElMessage.error('其他错误！请联系管理员！')
        }
    }
}

export const exportFileApi = async (method, url, info) => {
    try {
        const response = await tobacco.request({
            url: url,
            data: info,
            method: method,
            responseType: 'blob',
        })
        console.log(response)
        if (response.status === 200) {
            return response.data
        } else {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('错误提示'))
                    ElMessageBox.alert(response.data.msg || response.data.msg, '错误提示', {
                        confirmButtonText: '确认',
                        callback: (action) => {
                            resolve(false)
                        },
                    })
                }, 300)
            })
        }
    } catch (err) {
        if (err.response.status == '401')
            ElMessage.error('当前请求需要用户验证，刷新当前页面或重新登录！')
        else if (err.response.status == '403') ElMessage.error('您没有权限访问！')
        else if (err.response.status == '404') ElMessage.error('请求失败，请求的资源不存在！')
        else if (err.response.status == '405')
            ElMessage.error('请求中指定的请求方法不能被用于请求相应的资源。')
        else if (err.response.status == '500') ElMessage.error('服务器错误！')
        else if (err.response.statusmsg == 'Network Error')
            ElMessage.error('网络错误，请检查网络！')
        else if (err.response.status > 400 && err.response.status < 500)
            ElMessage.error('客户端请求错误！')
        else if (err.response.status > 500) ElMessage.error('服务器错误！')
        else {
            ElMessage.error('其他错误！请联系管理员！')
        }
    }
}

