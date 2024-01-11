import { del, get, post } from '@/server/api/request'

// 显示交接班规则列表 /api/zmsaas-medicaldevice/shift_changes_list
export const getShiftChangesListApi = (params) => {
    return get(`/zmsaas-medicaldevice/shift_changes_list`, params)
}

// 显示交接班规则列表 /api/zmsaas-medicaldevice/shift_changes_list
export const addShiftChangesApi = (params) => {
    return post(`/zmsaas-medicaldevice/shift_changes`, params)
}

// 删除指定交接班规则 /api/zmsaas-medicaldevice/shift_changes_delete
export const deleteShiftChangesApi = (params) => {
    return del(`/zmsaas-medicaldevice/shift_changes_delete`, params)
}
