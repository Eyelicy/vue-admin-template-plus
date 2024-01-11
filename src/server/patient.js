import { del, get, post, put } from '@/server/api/request'

// 显示患者列表 /api/zmsaas-medicaldevice/patient_list
export const getPatientListApi = (params) => {
    return get(`/zmsaas-medicaldevice/patient_list`, params)
}

// 显示指定的患者信息 /api/zmsaas-medicaldevice/patient_get
export const getPatientInfoApi = (params) => {
    return get(`/zmsaas-medicaldevice/patient_get`, params)
}

// 新增患者 /api/zmsaas-medicaldevice/patient
export const addPatientApi = (params) => {
    return post(`/zmsaas-medicaldevice/patient`, params)
}

// 更新患者信息 /api/zmsaas-medicaldevice/patient_put
export const editPatientApi = (params) => {
    return put(`/zmsaas-medicaldevice/patient_put`, params)
}

// 删除指定患者 /api/zmsaas-medicaldevice/patient_delete

export const deletePatientApi = (params) => {
    return del(`/zmsaas-medicaldevice/patient_delete`, params)
}
