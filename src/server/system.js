import { get } from '@/server/api/request'

// 查看设备日志 /api/zmsaas-medicaldevice/device_logs
export const getDeviceLogsApi = (params) => {
    return get(`/zmsaas-medicaldevice/device_logs`, params)
}
