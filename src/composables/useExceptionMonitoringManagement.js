import { ElMessage } from 'element-plus'

// 异常监控管理
export const useExceptionMonitoringManagement = () => {
    /**
     * 编辑备注
     * @param {object} details // 备注详情
     * @returns {boolean} // 是否备注成功
     */
    const remark = async (details) => {
        if (!details?.remark) {
            ElMessage.error('备注不能为空')
            return false
        }
        try {
            // details.details = JSON.stringify(details.details)
            // console.log(details);
            const { code } = await tobaccoApi('put', '/api/v1/tobacco/exceptionInfo', details)
            if (code === 200) {
                ElMessage.success('备注成功')
                return false
            } else {
                ElMessage.error('备注失败')
                return true
            }
        } catch (error) {
            ElMessage.error('备注失败')
            return true
        }
    }

    return { remark }
}
