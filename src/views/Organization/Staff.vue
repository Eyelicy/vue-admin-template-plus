<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead>
            <div class="table-header">
                <div class="table-header-lab">员工部门</div>
                <el-cascader
                    style="width: 100%"
                    v-model="query.department_guid"
                    :show-all-levels="false"
                    :options="treeData"
                    :props="{
                        expandTrigger:'hover',
                        label: 'name',
                        value: 'guid',
                        children: 'childlist',
                        emitPath: false,
                        checkStrictly: true,
                    }"
                    teleported
                    clearable
                    @change="getTableData"
                />
            </div>
        </TableHead>
        <div class="flex-auto flex flex-col">
            <el-button
                class="mb-8"
                type="primary"
                style="width: 100px"
                @click=";(dialogVisible = true), clearObject(form)"
                >新增员工
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="loading"
                :data="tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="staff_name" label="员工姓名" />
                <el-table-column prop="gender" label="性别">
                    <template #default="scope">
                        {{ sexText[scope.row.userinfo?.gender] }}
                    </template>
                </el-table-column>
                <el-table-column prop="license_code" label="年龄">
                    <template #default="scope">
                        {{ getAge(scope.row.userinfo?.birthday) }}
                    </template>
                </el-table-column>
                <el-table-column prop="career.name" label="角色权限" />
                <el-table-column prop="corporation.name" label="所属机构" />
                <el-table-column prop="department.name" label="所属部门" />
                <el-table-column prop="create_time_text" label="添加时间" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.row)">编辑</el-button>
                        <el-popconfirm
                            title="请确认是否删除该员工"
                            @confirm="handleDelete(scope.row)"
                        >
                            <template #reference>
                                <el-button type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="新增员工" width="30%">
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="120px"
            style="max-width: 460px"
        >
            <el-form-item label="员工姓名" prop="staff_name">
                <el-input v-model="form.staff_name" />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model.number="form.mobile" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addStaff"> 确定 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import {
addStaffApi,
delStaffApi,
getCorporationAuthGroupApi,
getDepartmentApi,
getStaffListApi,
} from '@/server/organization'
import { useUserStore } from '@/store/user'
import { sexText } from '@/utils/enum'
import { clearObject, getAge, isvalidPhone } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const { userInfo } = useUserStore(),
    router = useRouter(),
    loading = ref(null),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    tableData = ref([]),
    dialogVisible = ref(false),
    form = reactive({
        staff_name: '',
        mobile: '',
    }),
    formRef = ref(null),
    rules = reactive({
        staff_name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('请输入电话号码'))
                    } else if (!isvalidPhone(value)) {
                        //判断用户输入的值是否符合规则
                        callback(new Error('请输入正确的11位手机号码'))
                    } else {
                        callback()
                    }
                },
            },
        ],
    }),
    treeData = ref(null)
let query = reactive({
    corporation_guid: userInfo.extinfo?.Organization?.GUID,
    search: '',
    department_guid: '',
})

const getTableData = async (init) => {
    loading.value = true
    if (init) {
        page.index = 1
    }

    let params = {
        page: page.index,
        limit: page.size,
        ...query,
    }

    if (!query?.department_guid) {
        params.department_guid = ''
    }

    try {
        const {
            data: { data, total },
        } = await getStaffListApi(params)
        tableData.value = data
        page.total = Number(total)
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const addStaff = async () => {
    if (!formRef.value) return
    try {
        const res = await formRef.value.validate()
        const { data, code, msg } = await addStaffApi({
            ...form,
            corporation_guid: userInfo.extinfo?.Organization?.GUID,
        })
        if (code === 200) {
            ElMessage.success('新增成功')
            clearObject(form)
            getTableData(true)
            dialogVisible.value = false
        } else {
            ElMessage.error(msg)
        }
    } catch (error) {
        console.log('login', error)
    }
}

const getCorporationAuthGroup = async () => {
    const { data } = await getCorporationAuthGroupApi({
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })
}

const handleDelete = async (item) => {
    const { data, code, msg } = await delStaffApi(item.guid)
    if (code === 200) {
        ElMessage.success('删除成功')
        getTableData(true)
    } else {
        ElMessage.error(msg)
    }
}

const getTreeDepartment = async () => {
    const { data } = await getDepartmentApi({
        is_tree: true,
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })

    treeData.value = data
}

const handleEdit = async (item) => {
    console.log(item.guid)
    router.push({ path: `Staff/EditStaff/${item.guid}` })
}

onMounted(async () => {
    await getTableData(true)
    await getCorporationAuthGroup()
    await getTreeDepartment()
})
</script>

<style lang="scss" scoped></style>
