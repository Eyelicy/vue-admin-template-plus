<template>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <el-upload
            class="avatar-uploader"
            :action="action"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="edit"
        >
            <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <el-form
            label-position="left"
            label-width="100px"
            class="mt-8"
            style="width: 400px"
            size="large"
        >
            <el-form-item label="用户名昵称">
                <el-input :disabled="edit" v-model="state.nickName" placeholder="请输入用户名昵称">
                    <template v-if="!edit" #append>
                        <el-button class="mt-8" type="primary" @click="submitNickName"
                            >提交
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="密保手机">
                <el-input :disabled="edit" v-model="state.mobile" placeholder="">
                    <template v-if="!edit" #append>
                        <CodeButton
                            @onClick="
                                sendCode({
                                    mobile: state.mobile,
                                    event: 'changemobile',
                                })
                            "
                        ></CodeButton>
                    </template>
                </el-input>
                <template v-if="!edit">
                    <el-input class="mt-8" v-model="state.mobileCode" placeholder="请输入验证码">
                        <template #append>
                            <el-button class="mt-8" type="primary" @click="submitMobile"
                                >提交
                            </el-button>
                        </template>
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item label="密保邮箱">
                <el-input :disabled="edit" v-model="state.email" placeholder="">
                    <template v-if="!edit" #append>
                        <CodeButton
                            @onClick="sendEmailCode(state.email, 'changeemail')"
                        ></CodeButton>
                    </template>
                </el-input>
                <template v-if="!edit">
                    <el-input class="mt-8" v-model="state.emailCode" placeholder="请输入验证码">
                        <template #append>
                            <el-button type="primary" @click="submitEmail">提交</el-button>
                        </template>
                    </el-input>
                </template>
            </el-form-item>
            <el-form-item label="">
                <el-button
                    v-if="edit"
                    type="primary"
                    class="w-full mt-6"
                    size="large"
                    @click="edit = !edit"
                    >编辑
                </el-button>
                <el-button v-else type="primary" class="w-full mt-6" size="large" @click="cancel"
                    >取消
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import CodeButton from '@/components/codeButton/index.vue'
import { changeEmailApi, changeMobileApi } from '@/server/user'
import { useUserStore } from '@/store/user'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const { userInfo, token, app_guid, updatapProfile, sendCode, sendEmailCode } = useUserStore(),
    action = `${import.meta.env.VITE_BASE_URL}/common/upload_aliyun`,
    headers = {
        Authorization: `app_guid=${app_guid}`,
        token: token,
    },
    edit = ref(true),
    state = reactive({
        nickName: userInfo.nickname,
        mobile: userInfo.mobile,
        email: userInfo.email,
        mobileCode: '',
        emailCode: '',
    })

const handleAvatarSuccess = async (response, uploadFile) => {
    const {
        data: { url },
    } = await response
    userInfo.avatar = url
    await updatapProfile({ avatar: url })
}

const beforeAvatarUpload = (rawFile) => {
    if (!/\.(gif|jpg|jpeg|png)$/i.test(rawFile.name)) {
        ElMessage.error('Avatar picture must be IMG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const submitNickName = async () => {
    if (!state.nickName) {
        ElMessage.error('请先输入昵称')
        return false
    }
    await updatapProfile({ nickname: state.nickName })
}

const submitMobile = async () => {
    if (!state.mobileCode) {
        ElMessage.error('请先输入邮箱验证码')
        return false
    }
    const { data, code, msg } = await changeMobileApi({
        mobile: state.mobile,
        captcha: state.emailCode,
    })
    if (code === 200) {
        userInfo.mobile = state.mobile
        ElMessage.success('修改成功')
    } else {
        ElMessage.error(msg)
    }
}

const submitEmail = async () => {
    if (!state.emailCode) {
        ElMessage.error('请先输入邮箱验证码')
        return false
    }
    const { data, code, msg } = await changeEmailApi({
        email: state.email,
        captcha: state.emailCode,
    })
    if (code === 200) {
        userInfo.email = state.email
        ElMessage.success('修改成功')
    } else {
        ElMessage.error(msg)
    }
}

const cancel = () => {
    state.email = userInfo.email
    state.nickName = userInfo.nickname
    state.mobile = userInfo.mobile
    edit.value = !edit.value
}
</script>

<style lang="scss" scoped>
:deep(.avatar-uploader) {
    .avatar {
        width: 144px;
        height: 144px;
        display: block;
        border-radius: 50%;
    }

    .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        border-radius: 50%;
    }

    .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 144px;
        height: 144px;
        text-align: center;
    }
}
</style>
