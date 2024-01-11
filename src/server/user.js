import { get, post, put } from '@/server/api/request'

// 会员登录 /api/user/login
export const loginApi = (params) => {
    return post(`/user/login`, params)
}

// 注销登录 /api/user/logout
export const logoutApi = (params) => {
    return post(`/user/logout`, params)
}

// 发送验证码 /api/sms/send
export const sendCodeApi = (params) => {
    return post(`/sms/send`, params)
}

// 发送验证码 /api/ems/send
export const sendEmsCodeApi = (params) => {
    return post(`/ems/send`, params)
}

// 手机验证码登录 /api/user/mobilelogin
export const mobileLoginApi = (params) => {
    return post(`/user/mobilelogin`, params)
}

/**
 *
 * 修改会员个人信息 /api/user/profile
 * @param {*} params.avatar 头像(非必填)
 * @param {*} params.username 用户名(非必填)
 * @param {*} params.nickname 昵称(非必填)
 * @param {*} params.bio 个人简介(非必填)
 * @param {*} params.gender 性别：0未知，1男，2女(非必填)
 * @param {*} params.birthday 生日：格式1999-09-09(非必填)
 * @param {*} params.realname 用户实名(非必填)
 * @param {*} params.license_type 身份证件类型（1居民身份证2港澳通行证3台湾通行证4护照）(非必填)
 * @param {*} params.license_no 身份证件号码(非必填)
 * @param {*} params.bank_name 开户行(非必填)
 * @param {*} params.bank_account 银行卡号(非必填)
 * @returns
 */
export const updatapProfileApi = (params) => {
    return post(`/user/profile`, params)
}

// 用户是否设置过密码 /api/user/userpwd
export const userpwdApi = (params) => {
    return post(`/user/userpwd`, params)
}

// 设置或修改密码 /api/user/changepwd
export const changepwdApi = (params) => {
    return post(`/user/changepwd`, params)
}

/**
 *
 * 查询用户信息 /user/get_user_info
 * @param {*} params.search 查询结果：默认为my，即已登录用户的所有信息，支持all(任意用户所有信息)/username/email/mobile/avatar/loginip/jointime等	(非必填)
 * @param {*} params.field 查询条件字段：默认guid，支持guid/username/mobile/email/id(非必填)
 * @param {*} params.value 查询条件判断值，与field组合进行条件判断查询(非必填)
 * @returns
 */
export const getUserInfoApi = (params) => {
    return post(`/user/get_user_info`, params)
}

// 重置密码 /api/user/resetpwd
export const resetpwdApi = (params) => {
    return post(`/user/resetpwd`, params)
}

/**
 * 修改邮箱 /user/changeemail
 * @param {*} params.email 邮箱(必填)
 * @param {*} params.captcha 验证码(必填)
 * @returns
 */
export const changeEmailApi = (params) => {
    return post(`/user/changeemail`, params)
}

/**
 * 修改手机号 /user/changemobile
 * @param {*} params.mobile 手机号(必填)
 * @param {*} params.captcha 验证码(必填)
 * @returns
 */
export const changeMobileApi = (params) => {
    return post(`/user/changeemail`, params)
}

/**
 * 显示企业所有员工姓名 /hr/staffs
 * @param {*} params.corporation_guid 企业guid(必填)
 * @param {*} params.staff_name 员工姓名，支持模糊查询(非必填)
 * @returns
 */
export const getAllStaffApi = (params) => {
    return get(`/hr/staffs`, params)
}

/**
 *
 * 更新用户默认登录的企业 /hr/staff_update_default_corporation
 * @param {*} params.corporation_guid 设置后的默认企业guid(必填)
 * @returns
 */
export const updateStaffDefaultCorporationApi = (params) => {
    return put(`/hr/staff_update_default_corporation`, params)
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
