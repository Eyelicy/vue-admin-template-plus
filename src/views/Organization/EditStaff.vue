<style lang="scss" scoped>
.form-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: 6px;
    grid-column-gap: 0px;
}
</style>

<template>
    <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="120px"
        class="mt-12 max-w-[460px]"
    >
        <el-form-item label="员工工号" prop="industry_id">
            <el-input v-model="form.industry_id" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="staff_name">
            <el-input v-model="form.staff_name" />
        </el-form-item>
        <el-form-item label="员工岗位">
            <div class="form-container">
                <el-tag
                    v-for="(item, index) in form.departments"
                    :key="index"
                    class="mr-2"
                    closable
                    size="large"
                    type="info"
                    :disable-transitions="false"
                    @close="delStaffCareer(item)"
                >
                    {{ item.department_name }} - {{ item.career_title }}
                </el-tag>
                <el-button class="w-[100px]" type="primary" @click="showAddStaffCareer = true">添加</el-button>
            </div>
        </el-form-item>
        <el-form-item label="默认部门" prop="departmentGuid">
            <el-select class="w-full" v-model="form.departmentGuid" placeholder="请选择默认部门">
                <el-option
                    v-for="(item, key) in form.departments"
                    :key="key"
                    :label="item.department_name"
                    :value="item.department_guid"
                    :disabled="item.disabled"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="员工生日" prop="birthday">
            <el-date-picker
                class="w-full"
                v-model="form.birthday"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择生日"
            />
        </el-form-item>
        <el-form-item label="员工性别" prop="gender">
            <el-radio-group class="w-full" v-model="form.gender">
                <el-radio v-for="(item, key) in sexText" :key="Number(key)" :label="Number(key)">{{
                    item
                }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="员工职务" prop="group_ids">
            <el-select class="w-full" v-model="form.group_ids" multiple>
                <el-option
                    v-for="item in authGroup"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
            <el-select class="w-full" v-model="form.status" placeholder="请选择默认部门">
                <el-option
                    v-for="(item, key) in staffStatusText"
                    :key="Number(key)"
                    :label="item"
                    :value="key"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="办公电话" prop="tel">
            <el-input v-model="form.tel" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
            <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
            <el-input v-model="form.desc" :rows="2" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="editStaff">确定</el-button>
            <el-button @click="router.back()">取消</el-button>
        </el-form-item>
    </el-form>

    <Dialog
        width="30%"
        v-model="showAddStaffCareer"
        title="新增员工岗位"
        @handleAdd="addStaffCareer"
        @handleCancel="showAddStaffCareer = false"
    >
        <el-form v-model="addStaffCarerForm">
            <el-form-item label="员工部门" prop="departmentGuid">
                <el-select
                    class="w-full"
                    v-model="addStaffCarerForm.departmentGuid"
                    placeholder="请选择员工部门"
                >
                    <el-option
                        v-for="(item, key) in allDepartment"
                        :key="key"
                        :label="item.name"
                        :value="item.guid"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import {
addStaffCareerApi,
delStaffCareerApi,
editStaffApi,
getCorporationAuthGroupApi,
getDepartmentApi,
getStaffApi,
updateStaffDefaultDepartmentApi,
} from '@/server/organization'
import { useUserStore } from '@/store/user'
import { sexText, staffStatusText } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { userInfo } = useUserStore(),
    route = useRoute(),
    router = useRouter(),
    form = ref({
        industry_id: '',
    }),
    formRef = ref(null),
    showAddStaffCareer = ref(false),
    rules = reactive({
        staff_name: [
            {
                required: true,
                message: '请填写员工姓名',
                trigger: 'blur',
            },
        ],
        gender: [
            {
                required: true,
                message: '请选择员工性别',
                type: 'number',
                trigger: 'change',
            },
        ],
        status: [
            {
                required: true,
                message: '请选择员工状态',
                trigger: 'change',
            },
        ],
    }),
    addStaffCarerForm = reactive({
        departmentGuid: '',
    }),
    authGroup = ref([]),
    allDepartment = ref([])

const getStaff = async () => {
    const { data } = await getStaffApi(route.params.id)
    form.value = data
    form.value.departmentGuid = data.department.guid
    form.value.birthday = data?.userinfo?.birthday
    form.value.gender = Number(data?.userinfo?.gender)

    form.value.group_ids = data.group_ids.split(',').map((element) => {
        return Number(element)
    })
    console.log(form.value)
}

const getCorporationAuthGroup = async () => {
    const { data } = await getCorporationAuthGroupApi({
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })
    authGroup.value = data
}

const getAllDepartment = async () => {
    const {
        data: { data },
    } = await getDepartmentApi({
        limit: 9999,
        page: 1,
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })
    allDepartment.value = data
}

const editStaff = async () => {
    if (!formRef.value) return
    await formRef.value.validate()
    const params = {
        staff_no: form.value.staff_no,
        guid: form.value.guid,
        user_id: form.value.user_id,
        staff_name: form.value.staff_name, // 姓名
        career_id: form.value.career_id, // 员工职务id
        mobile: form.value.mobile, // 手机号码
        status: form.value.status, // 员工状态
        tel: form.value.tel, // 办公电话
        id: form.value.id,
        address: form.value.address, // 家庭住址
        desc: form.value.desc, //
        gender: form.value.gender,
        birthday: form.value.birthday,
        group_ids: form.value.group_ids.join(','),
    }

    const { code: dptCode, msg: dptMsg } = await updateStaffDefaultDepartmentApi({
        id: route.params.id,
        department_guid: form.value.departmentGuid,
    })
    if (dptCode !== 200) {
        ElMessage.error('设置默认部门失败')
    }
    const { data, code, msg } = await editStaffApi(route.params.id, params)
    if (code === 200) {
        ElMessage.success('编辑成功')
        router.back()
    } else {
        ElMessage.error(msg)
    }
}

const addStaffCareer = async () => {
    if (!addStaffCarerForm.departmentGuid) {
        ElMessage.warning('请先选择员工部门')
    }
    const { code, msg } = await addStaffCareerApi({
        id: route.params.id,
        department_guid: addStaffCarerForm.departmentGuid,
        career_id: 1,
    })
    if (code === 200) {
        ElMessage.success('新增成功')
        await getStaff()
        await getCorporationAuthGroup()
        showAddStaffCareer.value = false
    } else {
        ElMessage.error(msg)
    }
}

const delStaffCareer = async (item) => {
    const { code, msg } = await delStaffCareerApi({
        id: route.params.id,
        department_guid: item.department_guid,
        career_id: item.career_id,
    })
    if (code === 200) {
        ElMessage.success('删除成功')
        await getStaff()
        await getCorporationAuthGroup()
    } else {
        ElMessage.error(msg)
    }
}

onMounted(async () => {
    await getStaff()
    await getCorporationAuthGroup()
    await getAllDepartment()
})
</script>
