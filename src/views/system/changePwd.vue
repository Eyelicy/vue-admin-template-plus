<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <el-form
            ref="ruleFormRef"
            label-position="left"
            label-width="100px"
            :model="pwdModel"
            :rules="rules"
            class="mt-8"
            style="width: 460px"
            size="large"
        >
            <el-form-item label="原密码" prop="oldPassword" v-if="pwd === 1">
                <el-input v-model="pwdModel.oldPassword" placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input
                    v-model="pwdModel.newPassword"
                    type="password"
                    show-password
                    placeholder="请输入新密码"
                />
            </el-form-item>
            <el-form-item label="重复密码" prop="renewPassword">
                <el-input
                    v-model="pwdModel.renewPassword"
                    type="password"
                    show-password
                    placeholder="请输入重复密码"
                />
            </el-form-item>
            <el-button type="primary" class="w-full mt-6" size="large" @click="changepwd"
                >修改密码
            </el-button>
        </el-form>
    </div>
</template>

<script setup>
import { changepwdApi, userpwdApi } from '@/server/user'
import { useUserStore } from '@/store/user'
import { pwdRules } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const ruleFormRef = ref(null),
    pwdModel = reactive({
        oldPassword: '',
        newPassword: '',
        renewPassword: '',
    }),
    rules = reactive({
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
            { validator: pwdRules, trigger: 'blur' },
            { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        renewPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (value !== pwdModel.newPassword) callback('两次密码不一致')
                    else callback()
                },
                trigger: 'blur',
            },
        ],
    }),
    pwd = ref(0)

const { userInfo, token, app_guid, updatapProfile } = useUserStore()

const userpwd = async () => {
    const {
        data: { userpwd },
    } = await userpwdApi({
        account: userInfo.username,
    })
    pwd.value = userpwd
}

const changepwd = async () => {
    const { data, code, msg } = await changepwdApi({
        oldpassword: pwdModel.oldPassword,
        newpassword: pwdModel.newPassword,
        renewpassword: pwdModel.renewPassword,
    })
    if (code === 200) {
        ElMessage.success('修改成功')
    } else {
        ElMessage.error(msg)
    }
}

userpwd()
</script>

<style lang="scss" scoped></style>
