<template>
    <div class="w-full h-full flex flex-col">
        <div class="flex-auto flex flex-col">
            <el-button
                class="mb-8"
                type="primary"
                style="width: 100px"
                @click=";(dialogVisible = true), (type = true), clearObject(form)"
                >新增部门
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                :showPage="false"
                v-model:page="page"
                v-loading="loading"
                :data="treeData"
                row-key="id"
                :tree-props="{ children: 'childlist' }"
                @getTableData="getTableData"
                default-expand-all
            >
                <el-table-column prop="name" label="部门名称" />
                <el-table-column prop="pid" label="上级部门ID" />
                <el-table-column prop="license_code" label="上级部门名称" />
                <el-table-column prop="corporation" label="所属机构" />
                <el-table-column prop="create_time_text" label="操作用户" />
                <el-table-column prop="create_time_text" label="添加时间" />
                <el-table-column prop="update_time_text" label="更新时间" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-popconfirm
                            title="请确认是否删除该部门"
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
    <Dialog
        v-model="dialogVisible"
        :type="type"
        title="新增机构"
        edit-title="编辑部门"
        @handleCancel="dialogVisible = false"
        @handleAdd="addDepartment"
        @handleEdit="editDepartment"
        center
    >
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="120px"
            style="max-width: 460px"
        >
            <el-form-item label="上级部门">
                <el-cascader
                    style="width: 100%"
                    v-model="form.pid"
                    :options="treeData"
                    :props="{
                        label: 'name',
                        value: 'guid',
                        children: 'childlist',
                        emitPath: false,
                        checkStrictly: true,
                    }"
                    clearable
                />
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addDepartment"> 确定 </el-button>
            </span>
        </template>
    </Dialog>
    <Dialog
        v-model="editDialogVisible"
        title="编辑部门"
        center
    >
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="120px"
            style="max-width: 460px"
        >
            <el-form-item label="上级部门">
                <el-cascader
                    style="width: 100%"
                    v-model="form.pid"
                    :options="treeData"
                    :props="{
                        label: 'name',
                        value: 'guid',
                        children: 'childlist',
                        emitPath: false,
                        checkStrictly: true,
                    }"
                    clearable
                />
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editDepartment"> 确定 </el-button>
            </span>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import {
addDepartmentApi,
delDepartmentApi,
editDepartmentApi,
getDepartmentApi,
} from '@/server/organization'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

import { clearObject } from '@/utils/index'

const { userInfo } = useUserStore()
const loading = ref(null),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    tableData = ref([]),
    dialogVisible = ref(false),
    editDialogVisible = ref(false),
    form = reactive({}),
    formRef = ref(null),
    rules = reactive({
        name: [{ required: true, message: '请填写部门名称', trigger: 'change' }],
    }),
    type = ref(true),
    options = [
        {
            value: 0,
            label: '审核通过和待审核',
        },
        {
            value: 1,
            label: '审核通过',
        },
        {
            value: 2,
            label: '待审核',
        },
        {
            value: 3,
            label: '审核拒绝',
        },
        {
            value: 4,
            label: '全部',
        },
    ],
    time = ref(),
    treeData = ref(null)

let pid

let query = reactive({
    corporation_guid: userInfo.extinfo?.Organization?.GUID,
})

const getTableData = async (init) => {
    loading.value = true
    if (init) {
        page.index = 1
    }
    if (time.value) {
        query.start_time = time.value[0]
        query.end_time = time.value[1]
    }

    let params = {
        page: page.index,
        limit: page.size,
        ...query,
    }

    try {
        const {
            data: { data, total },
        } = await getDepartmentApi(params)
        tableData.value = data
        page.total = Number(total)
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const getTreeDepartment = async () => {
    const { data } = await getDepartmentApi({
        is_tree: true,
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })

    treeData.value = data
    console.log(treeData.value)
}

const addDepartment = async () => {
    if (!formRef.value) return
    const res = await formRef.value.validate()
    const { data, code, msg } = await addDepartmentApi({
        ...form,
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })
    if (code === 200) {
        ElMessage.success('新增成功')
        getTableData(true)
        getTreeDepartment()
        dialogVisible.value = false
    } else {
        ElMessage.error(msg)
    }
}

const handleEdit = async (index, item) => {
    type.value = false
    console.log(item)
    form.pid = getParentGuid(treeData.value, item.pid)
    form.id = item.guid
    form.name = item.name
    editDialogVisible.value = true
}

// const getParentGuid = async (pid) => {

// }

// tableData.value
const getParentGuid = (arr, id) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            pid = arr[i].guid
            break
        } else if (arr[i].childlist && arr[i].childlist.length > 0) {
            getParentGuid(arr[i].childlist, id) //递归
        }
    }
    return pid
}

const editDepartment = async () => {
    if (!formRef.value) return
    const res = await formRef.value.validate()
    const { data, code, msg } = await editDepartmentApi(form.id, form)
    if (code === 200) {
        ElMessage.success('编辑成功')
        getTableData(true)
        getTreeDepartment()
        editDialogVisible.value = false
    } else {
        ElMessage.error(msg)
    }
}

const handleDelete = async (item) => {
    const { data, code, msg } = await delDepartmentApi(item.guid)
    if (code === 200) {
        ElMessage.success('删除成功')
        getTreeDepartment()
    } else {
        ElMessage.error(msg)
    }
}

getTreeDepartment()
</script>

<style lang="scss" scoped></style>
