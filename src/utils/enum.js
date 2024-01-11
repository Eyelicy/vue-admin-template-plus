export const sexText = {
    0: '保密',
    1: '男',
    2: '女',
}

export const staffStatusText = {
    0: '待审核',
    1: '在职',
    2: '离职',
    3: '停薪留职',
    4: '退休',
    5: '返聘',
}

// 设备工作模式
export const jnqMode = {
    1: '分时计尿模式',
    2: '膀胱训练',
    3: '尿潴留',
    4: '膀胱冲洗',
}

// 预警类型
export const jnqFunc = {
    1: '多尿预警（每小时）',
    2: '多尿预警（N小时）',
    3: '少尿预警（每小时）',
    4: '少尿预警（N小时）',
}

export const shortcuts = [
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '一周前',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        },
    },
]
