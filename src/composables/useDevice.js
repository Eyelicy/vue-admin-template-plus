import { bindPatientDeviceApi } from '@/server/device'
import { jnqMode } from '@/utils/enum'
import { ElMessage } from 'element-plus'

export const useDevice = () => {
    const getDeviceMode = (val) => {
        return jnqMode[val]
    }

    const upDatePatientDeviceStatus = async (iotId, patientId, isBinding) => {
        const { data } = await bindPatientDeviceApi({
            iot_id: iotId,
            patient_id: patientId,
            is_binding: isBinding,
        })
        if (isBinding === 1) {
            ElMessage.success('绑定成功')
        } else {
            ElMessage.success('解绑成功')
        }
    }

    return { upDatePatientDeviceStatus,getDeviceMode }
}
