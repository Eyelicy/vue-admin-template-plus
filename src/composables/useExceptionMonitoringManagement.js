import { useCustomHook } from '@/composables/useCustomHook'
import { tobaccoApi } from '@/server/api/tobacco'
import { ElMessage, ElMessageBox } from 'element-plus'

const [functionRef, callFunc] = useCustomHook()

// 异常监控管理
export const useExceptionMonitoringManagement = () => {
    /**
     * 编辑备注
     * @param {string} exceptionCode 异常编码
     * @param {string} remark 备注内容
     * @description 备注成功后，需要重新请求列表数据
     *
     */
    const handleRemark = async (exceptionCode, remark) => {
        if (!remark) {
            ElMessage.error('备注不能为空')
            return
        }
        try {
            const { code } = await tobaccoApi(
                'post',
                '/api/v1/tobacco/exceptionHandling/modifyRemark',
                {
                    exceptionCode,
                    remark,
                }
            )
            if (code === 200) {
                ElMessage.success('备注成功')
            } else {
                ElMessage.error('备注失败')
            }
        } catch (error) {
            ElMessage.error('备注失败')
        }
    }

    /**
     * 撤销
     * @param {string} exceptionCode 异常编码
     * @param {function} fnc 撤销成功后的回调函数
     * @description 撤销成功后，需要重新请求列表数据
     *
     **/
    const handleRevoke = async (exceptionCode, fnc) => {
        try {
            await ElMessageBox.confirm('是否撤销该异常？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            const { code } = await tobaccoApi(
                'post',
                `/api/v1/tobacco/exceptionHandling/cancel/${exceptionCode}`
            )
            if (code === 200) {
                if (fnc) {
                    functionRef.value = fnc
                    callFunc()
                }
                ElMessage.success('撤销成功')
            } else {
                ElMessage.error('撤销失败')
            }
        } catch (error) {
            if (error !== 'cancel') {
                ElMessage.error('撤销失败')
            }
        }
    }

    /**
     * 处理结果
     * @param {string} exceptionCode 异常编码
     * @param {string} result 处理结果
     * @param {function} fnc 处理结果成功后的回调函数
     * @description 处理结果成功后，需要重新请求列表数据
     *
     **/
    const handleResult = async (exceptionCode, result, fnc) => {
        if (!result) {
            ElMessage.error('处理结果不能为空')
            return
        }
        try {
            const { code } = await tobaccoApi(
                'post',
                '/api/v1/tobacco/exceptionHandling/addResult',
                {
                    exceptionCode,
                    result,
                }
            )
            if (code === 200) {
                if (fnc) {
                    functionRef.value = fnc
                    callFunc()
                }
                ElMessage.success('处理结果成功')
            } else {
                ElMessage.error('处理结果失败')
            }
        } catch (error) {
            ElMessage.error('处理结果失败')
        }
    }

    /**
     *
     * 转发
     * @param {string} exceptionCode 异常编码
     * @param {string} staffGuid 转发人员
     * @param {string} result 处理结果
     * @param {function} fnc 处理结果成功后的回调函数
     *
     **/
    const handleForward = async (exceptionCode, staffGuid, fnc) => {
        try {
            const { code } = await tobaccoApi(
                'post',
                '/api/v1/tobacco/exceptionHandling/transfer',
                {
                    exceptionCode,
                    to: staffGuid,
                }
            )
            if (code === 200) {
                if (fnc) {
                    functionRef.value = fnc
                    callFunc()
                }
                ElMessage.success('转发成功')
            } else {
                ElMessage.error('转发失败')
            }
        } catch (error) {
            ElMessage.error('转发失败')
        }
    }

    return { handleRemark, handleRevoke, handleResult, handleForward }
}
