export const getImageUrl = (name) => {
    return new URL(`../assets/img/${name}`, import.meta.url).href
}

export const reg = {
    pass: /^(?=.*[a-z])(?=.*\d)[a-z\d~!@#$%^&*?_-]{8,30}$/i,
    strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?_-])[a-zA-Z\d~!@#$%^&*?_-]{10,}$/,
    medium: /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?_-])|(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*?_-])|(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?_-])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))[a-zA-Z\d~!@#$%^&*?_-]{8,9}$/,
    medium10:
        /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*?_-])|(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?_-]))[a-zA-Z\d~!@#$%^&*?_-]{10,}$/,
    weak: /^(?=.*[a-z])(?=.*\d)[a-z\d~!@#$%^&*?_-]{8,}$/i,
    noabc: /^((?![a-z]).)*$/i,
    nodigital: /^((?!\d).)*$/,
    illegal: /^[a-z\d~!@#$%^&*?_-]+$/i,
}

export const pwdRules = async (rule, value, callback) => {
    if (value == '') callback(new Error('密码不能为空'))
    else if (value.length < 8) callback(new Error('密码必须满8位'))
    else if (value.length > 30) callback(new Error('密码不能超过30位'))
    else if (!reg.illegal.test(value)) callback(new Error('不能包含~!@#$%^&*?_-以外的符号'))
    else if (reg.noabc.test(value)) callback(new Error('必须包含英文字母'))
    else if (reg.nodigital.test(value)) callback(new Error('必须包含数字'))
    callback()
}

export const isvalidPhone = (phone) => {
    const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
    return reg.test(phone)
}

export const clearObject = (obj) => {
    Object.keys(obj).forEach((keys) => {
        obj[keys] = ''
    })
}

export const forEach = (arr, fn) => {
    if (!arr.length || !fn) return
    let i = -1
    let len = arr.length
    while (++i < len) {
        let item = arr[i]
        fn(item, i, arr)
    }
}

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.need) {
        if (hasAllOf(item.meta.access, access)) return true
        else return false
    } else if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) return true
        else return false
    } else return true
}

export const hasChild = (item) => {
    return item.children && item.children.length !== 0
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    let res = []
    forEach(list, (item) => {
        if (!item.meta || (item.meta && !item.meta.hideMenu)) {
            let obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta,
                path: item.path,
            }
            if (
                (hasChild(item) || (item.meta && item.meta.showAlways)) &&
                showThisMenuEle(item, access)
            ) {
                obj.children = getMenuByRouter(item.children, access)
            }
            if (item.meta && item.meta.href) obj.href = item.meta.href
            if (showThisMenuEle(item, access)) res.push(obj)
        }
    })
    return res
}

export const getAge = (birthday) => {
    let today = new Date()
    let birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    let m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

export const formatTime = (date) => {
    // 获取年月日时分秒
    var year = date.getFullYear()
    var month = date.getMonth() + 1 // 月份从 0 开始
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    // 补零
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }

    // 拼接字符串
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export const isDischarge = (date1, data2) => {
    if (date1 && !data2) {
        return true
    }
    
    const d1 = new Date(date1)
    const d2 = new Date()

    if (d1 < d2) {
        return false
    } else if (d1 > d2) {
        return true
    }
}
