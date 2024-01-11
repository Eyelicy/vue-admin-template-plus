import { get, post, put } from '@/server/api/request'

// 查询设备列表 /api/zmsaas.medical_device/device_list
export const getDeviceListApi = (params) => {
    return get(`/zmsaas.medical_device/device_list`, params)
}

// 获取设备详情数据 /api/zmsaas.medical_device/device_details
export const getDeviceDetailApi = (params) => {
    return get(`/zmsaas.medical_device/device_details`, params)
}

// 获取设备历史数据 /api/zmsaas.medical_device/device_log
export const getDeviceLogApi = (params) => {
    return get(`/zmsaas.medical_device/device_log`, params)
}

// 查询预警日志列表 /api/zmsaas.medical_device/warning_logs
export const getDeviceWarningLogListApi = (params) => {
    return get(`/zmsaas.medical_device/warning_logs`, params)
}

// 查询操作日志列表 /api/zmsaas.medical_device/action_logs
export const getDeviceActionLogListApi = (params) => {
    return get(`/zmsaas.medical_device/action_logs`, params)
}

// 设置设备预警阈值参数 /api/zmsaas.medical_device/devices_warning_threshold
export const updataDevicesWarningThresholdApi = (params) => {
    return put(`/zmsaas.medical_device/devices_warning_threshold`, params)
}

// 新增或更新患者设备绑定关系 /api/zmsaas.medical_device/update_patient_device
// is_binding 是否绑定，默认1-绑定，0-解绑
export const bindPatientDeviceApi = (params) => {
    return put(`/zmsaas.medical_device/update_patient_device`, params)
}

// 修改指定设备的信息 /api/zmsaas.medical_device/update_device
export const updataDeviceInfoApi = (params) => {
    return put(`/zmsaas.medical_device/update_device`, params)
}

// 处理复位预警日志信息 /api/zmsaas.medical_device/handle_warning_log
export const handleWarningLogApi = (params) => {
    return post(`/zmsaas.medical_device/handle_warning_log`, params)
}
