import { useMsgCode } from '@/composables/useMsgCode'
import router from '@/router'
import {
    getAllStaffApi,
    getUserInfoApi,
    loginApi,
    mobileLoginApi,
    sendCodeApi,
    sendEmsCodeApi,
    updatapProfileApi,
    updateStaffDefaultCorporationApi,
    updateStaffDefaultDepartmentApi,
} from '@/server/user'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { config } from '/config'

export const useUserStore = defineStore(
    'user',
    () => {
        const loginModel = reactive({
                account: '',
                password: '',
                rememberAccountName: false,
            }),
            mobileLoginModel = reactive({
                mobile: '',
                captcha: '',
            }),
            mobile = ref(''),
            captcha = ref(''),
            token = ref(null),
            userInfo = ref(null),
            staffs = ref(null),
            app_guid = ref('d5a63f733f24b54f')

        const login = async (ruleFormRef) => {
            if (!ruleFormRef) return
            try {
                const res = await ruleFormRef.validate()
                const { data, code, msg } = await loginApi({
                    account: loginModel.account,
                    password: loginModel.password,
                })
                if (code === 200) {
                    ElMessage.success('成功登录')
                    token.value = data.userinfo.token
                    userInfo.value = data.userinfo
                    loginModel.password = null
                    if (userInfo.value.extinfo?.Organization?.GUID) {
                        await getAllStaff()
                    }
                    router.push(config.homeName)
                } else {
                    ElMessage.error(msg)
                }
            } catch (error) {
                console.log('login', error)
            }
        }

        const logout = async () => {
            ElMessage.success('退出登录')
            localStorage.clear()
            router.push('/login')
        }

        /**
         *
         * 发送验证码
         * @param {*} params {
         *      params.mobile 手机号;
         *      params.event register注册、mobilelogin手机登录（自动注册）、changemobile修改手机、resetpwd修改密码
         * }
         * @returns
         */
        const sendCode = async (params) => {
            const { countdown } = useMsgCode()
            if (!params.mobile) {
                ElMessage.error('请先输入手机号')
                return false
            } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(params.mobile)) {
                ElMessage.error('请输入正确的手机号')
                return false
            }
            const { code, msg } = await sendCodeApi(params)
            if (code === 200) {
                countdown()
                ElMessage.success('发送成功')
            } else {
                ElMessage.error(msg)
            }
        }


        /**
         * 发送邮箱验证码
         * @param {*} email 邮箱
         * @param {*} event 事件名称：register注册/changeemail更改邮箱/resetpwd用邮箱重置密码/changepwd
         * @returns
         */
        const sendEmailCode = async (email, event) => {
            const { countdown } = useMsgCode()
            if (!email) {
                ElMessage.error('请先输入邮箱')
                return false
            } else if (
                !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
            ) {
                ElMessage.error('请输入正确的邮箱')
                return false
            }
            const { code, msg } = await sendEmsCodeApi({
                email,
                event,
            })
            if (code === 200) {
                countdown()
                ElMessage.success('发送成功')
            } else {
                ElMessage.error(msg)
            }
        }

        const mobileLogin = async (ruleFormRef) => {
            if (!ruleFormRef) return
            try {
                const res = await ruleFormRef.validate()
                const { data, code, msg } = await mobileLoginApi({
                    mobile: mobileLoginModel.mobile,
                    captcha: mobileLoginModel.captcha,
                })
                if (code === 200) {
                    ElMessage.success('成功登录')
                    token.value = data.userinfo.token
                    userInfo.value = data.userinfo
                    router.push(config.homeName)
                } else {
                    captcha.value = null
                    ElMessage.error(msg)
                }
            } catch (error) {
                console.log('mobileLogin', error)
            }
        }

        /**
         *
         * 修改会员个人信息
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
        const updatapProfile = async (params) => {
            const { data: userinfo, code, msg } = await updatapProfileApi(params)
            if (code === 200) {
                userInfo.value = userinfo
                ElMessage.success('更新成功')
            } else {
                ElMessage.error(msg)
            }
        }

        const refreshGuid = async (guid) => {
            userInfo.value.extinfo.Organization = {
                GUID: userInfo.value.extinfo.corporations[guid].guid,
                Id: userInfo.value.extinfo.corporations[guid].id,
                Name: userInfo.value.extinfo.corporations[guid].name,
            }
            ElMessage.success('切换成功')
        }

        /**
         *
         * 修改用户登录企业
         * @param {*} corporationGuid 企业guid
         * @param {*} isDefault 修改默认企业 默认false
         * @returns
         */
        const handleUserCorporation = async (corporationGuid, isDefault = false) => {
            if (isDefault) {
                const { data } = await updateStaffDefaultCorporationApi({
                    corporation_guid: corporationGuid,
                })
            }
            userInfo.value.extinfo.Organization = {
                GUID: userInfo.value.extinfo.corporations[corporationGuid].guid,
                Id: userInfo.value.extinfo.corporations[corporationGuid].id,
                Name: userInfo.value.extinfo.corporations[corporationGuid].name,
            }
            await getUserInfo()
            if (userInfo.value.extinfo?.Organization?.GUID) {
                await getAllStaff()
            }
            ElMessage.success('切换成功')
            router.go(0)
        }

        /**
         *
         * 修改用户部门
         * @param {*} departmentGuid 企业guid
         * @param {*} isDefault 修改默认企业 默认false
         * @returns
         */
        const handleUserDepartment = async (departmentGuid, isDefault = false) => {
            if (isDefault) {
                const { data } = await updateStaffDefaultDepartmentApi({
                    id: userInfo.value.user_staff.guid,
                    department_guid: departmentGuid,
                })
            }
            const index = userInfo.value.extinfo.Departments.findIndex((item)=>{
                return item.GUID === departmentGuid;
            })
            userInfo.value.extinfo.DefaultDept = userInfo.value.extinfo.Departments[index]

            // await getAllStaff()
            ElMessage.success('切换成功')
            router.go(0)
        }

        const getAllStaff = async () => {
            const { data: staffsAll } = await getAllStaffApi({
                corporation_guid: userInfo.value.extinfo?.Organization?.GUID,
            })
            staffs.value = Object.values(staffsAll)
        }

        const getUserInfo = async () => {
            const { data } = await getUserInfoApi({})
            userInfo.value = data
        }

        return {
            login,
            logout,
            sendCode,
            mobileLogin,
            updatapProfile,
            refreshGuid,
            sendEmailCode,
            handleUserCorporation,
            handleUserDepartment,
            mobile,
            captcha,
            loginModel,
            mobileLoginModel,
            token,
            userInfo,
            app_guid,
            staffs,
        }
    },
    {
        persist: {
            enabled: true,
            strategies: [
                {
                    storage: localStorage,
                },
            ],
        },
    }
)
