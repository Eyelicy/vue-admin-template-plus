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

export const abnormalOrderStatus = {
    WAITING: '待处理',
    PROCESSING: '处理中',
    COMPLETED: '已办结',
    CANCELLED: '已撤销',
}

export const abnormalOrderColor = {
    WAITING: '#F34628',
    PROCESSING: '#16D585',
    COMPLETED: '#348DED',
}


export const exceptionStatus = {
    A: '签收地偏离',
    B: '同店异脸',
    C: '同脸异地',
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
