<template>
    <div class="w-full h-full flex justify-between bg-blue text-white items-center px-12">
        <div class="flex items-center bg-white rounded-[0.8rem] overflow-hidden">
            <img width="100" class="p-2" src="@/assets/img/title.png" alt="" srcset="" />
            <p class="text-4xl text-black pl-6 pr-8 font-bold">{{ config.layoutHeaderName }}</p>
        </div>
        <div class="flex items-center text-xl h-full">
            <div
                class="flex justify-center items-center mr-12 cursor-pointer"
                @click="corporations.length > 1 ? (showChangeOrganization = true) : ''"
            >
                <p>机构：</p>
                <p>{{ userInfo?.extinfo?.Organization?.Name ?? '暂未绑定企业机构' }}</p>
                <el-icon class="ml-4" v-if="corporations.length > 1"><ArrowDownBold /></el-icon>
            </div>
            <div
                class="flex mr-12 cursor-pointer"
                @click="departments.length > 1 ? (showChangeDepartment = true) : ''"
            >
                <p>部门：</p>
                <p>{{ userInfo?.extinfo?.DefaultDept?.Name ?? '默认部门' }}</p>
                <el-icon class="ml-4" v-if="departments.length > 1"><ArrowDownBold /></el-icon>
            </div>
            <div class="flex mr-12">
                <p>护士/工作人员：</p>
                <p>{{ userInfo?.nickname }}</p>
            </div>
            <el-button class="mr-12" color="#fff" @click="userCenter">{{
                route.path === '/userCenter' ? '返回平台' : '用户中心'
            }}</el-button>
            <el-popover placement="top-start" trigger="hover" content="退出登录">
                <template #reference>
                    <el-button type="primary" circle size="large" @click="userStroe.logout">
                        <el-icon :size="24"><SwitchButton /></el-icon>
                    </el-button>
                </template>
            </el-popover>
        </div>
    </div>
    <el-dialog v-model="showChangeOrganization" title="切换机构" width="30%">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" style="width: 100%">
            <el-form-item label="机构名称" prop="corporation_guid">
                <el-select v-model="form.corporation_guid" style="width: 100%">
                    <el-option
                        v-for="item in corporations"
                        :key="item.guid"
                        :label="item.name"
                        :value="item.guid"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="">
                <el-checkbox v-model="form.isDefault" label="设置为默认企业" size="large" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showChangeOrganization = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="handleUserCorporation(form.corporation_guid, form.isDefault)"
                >
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="showChangeDepartment" title="切换部门" width="30%">
        <el-form
            :model="departmentForm"
            ref="formRef"
            :rules="rules"
            label-width="120px"
            style="max-width: 460px"
        >
            <el-form-item label="部门名称" prop="corporation_guid">
                <el-select v-model="departmentForm.department_guid">
                    <el-option
                        v-for="item in departments"
                        :key="item.GUID"
                        :label="item.Name"
                        :value="item.GUID"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="">
                <el-checkbox
                    v-model="departmentForm.isDefault"
                    label="设置为默认部门"
                    size="large"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showChangeDepartment = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="
                        handleUserDepartment(
                            departmentForm.department_guid,
                            departmentForm.isDefault
                        )
                    "
                >
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { ArrowDownBold, SwitchButton } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { config } from '/config.js'

const router = useRouter(),
    route = useRoute()
const { handleUserCorporation, handleUserDepartment } = useUserStore()
const userStroe = useUserStore(),
    { userInfo, logout, refreshGuid } = storeToRefs(userStroe),
    // corporations = userInfo?.extinfo?.corporations
    //     ? null
    //     : Object.values(userInfo?.extinfo?.corporations),
    corporations = ref([]),
    departments = ref([]),
    showChangeOrganization = ref(false),
    showChangeDepartment = ref(false),
    form = reactive({
        corporation_guid: userInfo.value.extinfo?.Organization?.GUID,
    }),
    departmentForm = reactive({
        department_guid: userInfo.value.extinfo?.DefaultDept?.GUID,
    })

onMounted(async () => {
    await nextTick()
    if (userInfo.value?.extinfo?.corporations) {
        corporations.value = Object.values(userInfo.value?.extinfo?.corporations)
    }
    if (userInfo.value?.extinfo?.Departments) {
        departments.value = userInfo.value?.extinfo?.Departments
    }

    // if (corporations.value.length === 1) {
    //     userStroe.refreshGuid(corporations.value[0].guid)
    // }
})

const userCenter = () => {
    if (route.path === '/userCenter') {
        router.go(-1)
    } else {
        router.push('/userCenter')
    }
}
</script>

<style lang="scss" scoped>
// .el-button + .el-button {
//     margin: 0;
// }
</style>
