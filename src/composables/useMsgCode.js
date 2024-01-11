import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

export const useMsgCode = () => {
    const timeClock = ref(null)
    const countTime = ref(60),
        disabled = ref(false)

    const countdown = () => {
        disabled.value = true
        timeClock.value = setInterval(() => {
            countTime.value--
            if (countTime.value == 0) {
                clearInterval(timeClock.value)
                countTime.value = 60
                // msg.value = '获取验证码'
                disabled.value = false
            } else {
                // msg.value = `请${countTime.value}s后重试`
            }
        }, 1000)
    }

    const msg = computed(() => {
        return countTime.value === 60 ? '获取验证码' : `请${countTime.value}s后重试`
    })

    onBeforeUnmount(async () => {
        if (!timeClock.value) {
            await nextTick()
            await clearInterval(timeClock.value)
        }
    })

    return { countTime, disabled, countdown, msg }
}
