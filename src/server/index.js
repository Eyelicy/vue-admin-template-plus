import { post } from '@/server/api/request'

// 显示中国省市县列表 /api/common/area_list
export const getAreaListApi = (params) => {
    return post(`/common/area_list`, params)
}

