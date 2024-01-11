import { useUserStore } from '@/store/user'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 环境的切换
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// 请求超时时间
axios.defaults.timeout = 10000
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        const token = userStore.token
        const app_guid = userStore.app_guid
        const corporation_guid = userStore.userInfo?.extinfo?.Organization?.GUID
        config.headers.Authorization = `app_guid=${app_guid};${
            corporation_guid ? 'corporation_guid=' + corporation_guid : ''
        }`
        token && (config.headers.token = token)
        return config
    },
    (error) => {
        return Promise.error(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            // if (response.data.code == 200 || response.data.code == 0) {
            //     return Promise.resolve(response)
            // }
            if (response.data.code == 200) {
                return Promise.resolve(response)
            } else {
                ElMessage({
                    type: 'error',
                    message: response.data.msg || response.data.message,
                })
            }
        } else if (response.status === 500) {
            ElMessage({
                type: 'error',
                message: '接口异常',
            })
        } else {
            ElMessage({
                type: 'error',
                message: response.data.msg,
            })
            return Promise.reject(response)
        }
    },
    (error) => {
        const userStore = useUserStore()
        switch (error.response.status) {
            case 401:
                ElMessageBox.confirm('登录信息已过期，点击确认跳转至登录页?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        userStore.logout()
                    })
                    .catch(() => {})
                break
            default:
                ElMessage.error(error.response.data.msg)
                break
        }
    }
)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then(
            (res) => {
                resolve(res.data)
            },
            (err) => {
                reject(err)
            }
        )
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export function del(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .delete(url, { data: { ...params } })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export function exportFile(url, params) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            responseType: 'blob',
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

export function uploadFile(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}
