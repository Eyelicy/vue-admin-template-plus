import { ref } from 'vue'

export const useCustomHook = () => {
    // 创建一个ref变量来存储需要传递的函数
    const functionRef = ref(null)

    // 返回一个包含两个值的对象，第一个值为functionRef，第二个值为一个可以调用该函数的方法
    return [
        functionRef,
        (...args) => {
            if (typeof functionRef.value === 'function') {
                functionRef.value(...args)
            } else {
                console.error('Function is not defined')
            }
        },
    ]
}
