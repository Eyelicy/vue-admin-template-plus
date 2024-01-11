<template>
    <div class="w-screen h-screen flex justify-center items-center relative">
        <img class="absolute top-12 left-20" width="160" src="@/assets/icon.png" />
        <div
            class="flex container mx-auto overflow-hidden"
            style="
                height: 550px;
                max-width: 1000px;
                background: #ffffff;
                border: 1px solid #dddddd;
                box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.1);
                border-radius: 20px;
            "
        >
            <div class="flex-1 flex-shrink-0 bg"></div>
            <div class="flex-1 flex-shrink-0 p-16" v-if="!register && !forgetPassword">
                <el-tabs v-model="activeName" class="demo-tabs">
                    <el-tab-pane label="账号密码登录" name="login">
                        <el-form
                            ref="ruleFormRef"
                            label-position="top"
                            label-width="100px"
                            :model="loginModel"
                            :rules="rules"
                            class="mt-8 flex flex-col"
                            style="max-width: 460px"
                            size="large"
                        >
                            <el-form-item label="手机号/用户名/邮箱" prop="account">
                                <el-input
                                    v-model="loginModel.account"
                                    placeholder="请输入手机号/用户名/邮箱"
                                />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input
                                    v-model="loginModel.password"
                                    type="password"
                                    show-password
                                    placeholder="请输入密码"
                                />
                            </el-form-item>
                            <div class="flex justify-between">
                                <el-checkbox
                                    v-model="loginModel.rememberAccountName"
                                    label="记住用户名"
                                />
                                <el-button type="primary" link @click="forgetPassword = true"
                                    >忘记密码</el-button
                                >
                            </div>
                            <div>
                                <el-button
                                    type="primary"
                                    class="w-full mt-6"
                                    size="large"
                                    @click="login(ruleFormRef)"
                                    >登录
                                </el-button>
                            </div>
                            <el-button
                                type="primary"
                                class="w-full mt-6 mx-auto"
                                link
                                @click="register = true"
                                >注册新用户
                            </el-button>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="手机验证码登录" name="mobileLogin">
                        <el-form
                            ref="ruleMobileFormRef"
                            :rules="mobileRules"
                            label-position="top"
                            label-width="100px"
                            :model="mobileLoginModel"
                            style="max-width: 460px"
                            class="mt-12"
                            size="large"
                        >
                            <el-form-item prop="mobile">
                                <el-input
                                    v-model="mobileLoginModel.mobile"
                                    placeholder="请输入手机号"
                                />
                            </el-form-item>
                            <el-form-item prop="captcha">
                                <el-input
                                    v-model="mobileLoginModel.captcha"
                                    placeholder="请输入验证码"
                                >
                                    <template #append>
                                        <CodeButton
                                            @onClick="
                                                sendCode({
                                                    mobile: mobileLoginModel.mobile,
                                                    event: 'mobilelogin',
                                                })
                                            "
                                        ></CodeButton>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-button
                                type="primary"
                                class="w-full mt-6"
                                size="large"
                                @click="mobileLogin(ruleMobileFormRef)"
                                >登录
                            </el-button>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <ForgetPassword
                v-else-if="forgetPassword"
                @back="forgetPassword = false"
            ></ForgetPassword>
            <div class="flex-1 flex-shrink-0 p-16" v-else>
                <div style="font-size: 24px; color: #569ded">注册</div>
                <el-form
                    ref="ruleMobileFormRef"
                    :rules="mobileRules"
                    label-position="top"
                    label-width="100px"
                    :model="mobileLoginModel"
                    style="max-width: 460px"
                    class="mt-12 flex flex-col"
                    size="large"
                >
                    <el-form-item prop="mobile">
                        <el-input v-model="mobileLoginModel.mobile" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input v-model="mobileLoginModel.captcha" placeholder="请输入验证码">
                            <template #append>
                                <CodeButton
                                    @onClick="
                                        sendCode({
                                            mobile: mobileLoginModel.mobile,
                                            event: 'mobilelogin',
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
                            @click="mobileLogin(ruleMobileFormRef)"
                            >注册
                        </el-button>
                    </div>
                    <el-button type="primary" class="mt-6" link @click="register = false"
                        >返回登录
                    </el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import CodeButton from '@/components/codeButton/index.vue';
import ForgetPassword from '@/components/forgetPassword.vue';
import { useUserStore } from '@/store/user';
import { reactive, ref } from 'vue';
const { login, loginModel, mobileLoginModel, sendCode, mobileLogin, mobile, captcha } =
        useUserStore(),
    activeName = ref('login'),
    ruleFormRef = ref(null),
    ruleMobileFormRef = ref(null),
    register = ref(null),
    forgetPassword = ref(false),
    loading = ref(true),
    rules = reactive({
        account: [{ required: true, message: '请输入手机号/用户名/邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    }),
    mobileRules = reactive({
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    })

if (!loginModel.rememberAccountName) {
    loginModel.account = ''
}
</script>

<style lang="scss" scoped>
.bg {
    background: url('@/assets/bg.png') no-repeat;
    background-size: cover;
    background-position: center;
}
</style>
