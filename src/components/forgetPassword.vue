<style lang="scss" scoped></style>

<template>
    <div class="flex-1 flex-shrink-0 p-16">
        <div style="font-size: 24px; color: #569ded">忘记密码</div>
        <el-form
            ref="forgetFormRef"
            :rules="state.rules"
            label-position="top"
            label-width="100px"
            :model="state.form"
            style="max-width: 460px"
            class="mt-12"
            size="large"
        >
            <div v-if="state.current === 0">
                <el-form-item label="手机号/用户名/邮箱" prop="mobile">
                    <el-input v-model="state.form.mobile" placeholder="手机号/用户名/邮箱" />
                </el-form-item>
                <div>
                    <el-button
                        type="primary"
                        class="w-full mt-6"
                        size="large"
                        @click="handleNext(forgetFormRef)"
                        >下一步
                    </el-button>
                </div>
                <el-button type="primary" class="w-full mt-6" link @click="back()"
                    >返回登录
                </el-button>
            </div>
            <div v-else-if="state.current === 1">
                <div>
                    <el-button type="primary" class="w-full mt-6" size="large" @click="handleSMS()"
                        >短信验证方式重设密码
                    </el-button>
                </div>
                <el-button type="primary" class="w-full mt-12" size="large" @click="handleEmail()"
                    >安全邮箱方式重设密码
                </el-button>
            </div>
            <div v-else-if="state.isSMS">
                <el-form-item prop="mobile">
                    <el-input v-model="state.form.mobile" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-input v-model="state.form.captcha" placeholder="请输入验证码">
                        <template #append>
                            <CodeButton
                                @onClick="sendCode({ mobile: state.form.mobile, event: 'resetpwd' })"
                            ></CodeButton>
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-button
                        type="primary"
                        class="w-full mt-6"
                        size="large"
                        @click="handleNext(forgetFormRef, 'SMS')"
                        >下一步
                    </el-button>
                </div>
                <el-button type="primary" class="w-full mt-6" link @click="back()"
                    >返回登录
                </el-button>
            </div>
            <div v-else-if="state.isEmail">
                <el-form-item prop="mobile">
                    <el-input v-model="state.form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item prop="captcha">
                    <el-input v-model="state.form.captcha" placeholder="请输入验证码">
                        <template #append>
                            <CodeButton
                                @onClick="
                                    sendEmailCode({
                                        email: state.form.email,
                                        event: 'resetpwd',
                                    })
                                "
                            ></CodeButton>
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-button
                        type="primary"
                        class="w-full mt-6"
                        size="large"
                        @click="handleNext(forgetFormRef, 'email')"
                        >下一步
                    </el-button>
                </div>
                <el-button type="primary" class="w-full mt-6" link @click="back()"
                    >返回登录
                </el-button>
            </div>
            <div v-else>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input
                        v-model="state.form.newPassword"
                        type="password"
                        show-password
                        placeholder="请输入新密码"
                    />
                </el-form-item>
                <el-form-item label="重复密码" prop="renewPassword">
                    <el-input
                        v-model="state.form.renewPassword"
                        type="password"
                        show-password
                        placeholder="请输入重复密码"
                    />
                </el-form-item>
                <div>
                    <el-button
                        type="primary"
                        class="w-full mt-6"
                        size="large"
                        @click="handleConfirm(forgetFormRef)"
                        >确认
                    </el-button>
                </div>
                <el-button type="primary" class="w-full mt-6" link @click="back()"
                    >返回登录
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import CodeButton from '@/components/codeButton/index.vue'
import { resetpwdApi } from '@/server/user'
import { useUserStore } from '@/store/user'
import { pwdRules } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const emit = defineEmits(['back'])

const { sendCode, sendEmailCode } = useUserStore()

const state = reactive({
        current: 0,
        isSMS: false,
        isEmail: false,
        form: {
            mobile: '',
        },
        rules: {
            mobile: [{ required: true, message: '请输入手机号/用户名/邮箱', trigger: 'blur' }],
            captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            newPassword: [
                { required: true, message: '请输入新密码', trigger: 'blur' },
                { validator: pwdRules, trigger: 'blur' },
            ],
            renewPassword: [
                { required: true, message: '请再次输入密码', trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        if (value !== state.form.newPassword) callback(new Error('两次密码不一致'))
                        else callback()
                    },
                    trigger: 'blur',
                },
            ],
        },
    }),
    forgetFormRef = ref(null)

const handleNext = async (formEl, type) => {
    if (!formEl) return
    await formEl.validate()
    switch (type) {
        case 'SMS':
            state.isSMS = false
            break
        case 'email':
            state.isEmail = false
            break
        default:
            state.current += 1
            break
    }
}

const handleConfirm = async (formEl) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate()
    const { code, msg } = await resetpwdApi({
        mobile: state.form.type === 'mobile' ? state.form.mobile : undefined,
        email: state.form.type === 'email' ? state.form.email : undefined,
        newpassword: state.form.newPassword,
        captcha: state.form.captcha,
        type: state.form.type,
    })
    if (code === 200) {
        ElMessage.success('重置成功，请重新登录')
        back()
    } else {
        ElMessage.error(msg)
    }
}

const handleSMS = async () => {
    state.current = 2
    state.isSMS = true
    state.form.type = 'mobile'
}

const handleEmail = async () => {
    state.current = 2
    state.isEmail = true
    state.form.type = 'email'
}

const back = () => {
    emit('back')
}
</script>
