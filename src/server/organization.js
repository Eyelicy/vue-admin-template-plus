import { del, get, post, put } from '@/server/api/request'

// 显示企业套餐权限信息 /api/paas/corporation_pack_info
export const getCorporationPackInfoApi = (params) => {
    return get(`/paas/corporation_pack_info`, params)
}

// 显示企业职能角色列表 /api/paas/corporation_auth_group_list
export const getCorporationAuthGroupApi = (params) => {
    return get(`/paas/corporation_auth_group_list`, params)
}

// 新增企业职能角色 /api/paas/corporation_auth_group
export const addCorporationAuthGroupApi = (params) => {
    return post(`/paas/corporation_auth_group`, params)
}

// 更新企业职能角色 /api/paas/corporation_auth_group
export const editCorporationAuthGroupApi = (params) => {
    return put(`/paas/corporation_auth_group`, params)
}

// 删除企业职能角色 /api/paas/corporation_auth_group
export const delCorporationAuthGroupApi = (id) => {
    return del(`/paas/corporation_auth_group?auth_group_id=${id}`)
}

// 显示企业列表 /api/paas/corporation
export const getCorporationApi = (params) => {
    return get(`/paas/corporation`, params)
}

// 根据企业名称模糊查询企业信息 /api/paas/corporation_search
export const getCorporationSearchApi = (params) => {
    return get(`/paas/corporation_search`, params)
}

// 新增企业 /api/paas/corporation
export const addCorporationApi = (params) => {
    return post(`/paas/corporation`, params)
}

// 更新企业 /api/paas/corporation/{id}
export const editCorporationApi = (id, params) => {
    return put(`/paas/corporation/${id}`, params)
}

/**
 *
 * 显示部门列表 /hr/department
 * @param {*} params.limit 每页数量，默认10	(非必填)
 * @param {*} params.page 	页码，默认1(非必填)
 * @param {*} params.corporation_guid 企业guid(必填)
 * @param {*} params.is_tree 是否显示树状结构，默认false，若为true则不分页(非必填)
 * @returns
 */
export const getDepartmentApi = (params) => {
    return get(`/hr/department`, params)
}

// 新增部门 /api/hr/department
export const addDepartmentApi = (params) => {
    return post(`/hr/department`, params)
}

// 更新部门 /api/hr/department/{id}
export const editDepartmentApi = (id, params) => {
    return put(`/hr/department/${id}`, params)
}

// 删除指定部门 /api/hr/department/{id}
export const delDepartmentApi = (id, params) => {
    return del(`/hr/department/${id}`, params)
}

// 显示员工列表 /api/hr/staff
export const getStaffListApi = (params) => {
    return get(`/hr/staff`, params)
}

// 显示企业所有员工姓名 /api/hr/staffs
export const getAllStaffListApi = (params) => {
    return get(`/hr/staffs`, params)
}

// 显示指定的员工 /api/hr/staff/{id}
export const getStaffApi = (id) => {
    return get(`/hr/staff/${id}`)
}

// 新增员工 /api/hr/staff
export const addStaffApi = (params) => {
    return post(`/hr/staff`, params)
}

// 更新员工 /api/hr/staff/{id}
export const editStaffApi = (id, params) => {
    return put(`/hr/staff/${id}`, params)
}

// 删除指定员工 /api/hr/staff/{id}
export const delStaffApi = (id) => {
    return del(`/hr/staff/${id}`)
}

/**
 *
 * 删除员工指定部门的岗位 /hr/staff_del_career
 * @param {*} params.id 员工guid(必填)
 * @param {*} params.department_guid 部门guid(必填)
 * @param {*} params.career_id 岗位id，通过公共接口获取id(必填)
 * @returns
 */
export const delStaffCareerApi = (params) => {
    return del(`/hr/staff_del_career`, params)
}

/**
 *
 * 增加员工指定部门的岗位 /hr/staff_add_career
 * @param {*} params.id 员工guid(必填)
 * @param {*} params.department_guid 部门guid(必填)
 * @param {*} params.career_id 岗位id，先传1暂无其他岗位角色(必填)
 * @returns
 */
export const addStaffCareerApi = (params) => {
    return post(`/hr/staff_add_career`, params)
}

/**
 *
 * 更新员工默认部门 /hr/staff_update_default
 * @param {*} params.id 员工guid(必填)
 * @param {*} params.department_guid 员工默认部门guid(必填)
 * @returns
 */
export const updateStaffDefaultDepartmentApi = (params) => {
    return put(`/hr/staff_update_default`, params)
}

