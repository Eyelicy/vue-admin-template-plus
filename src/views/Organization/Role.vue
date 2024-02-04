<template>
    <div class="w-full h-full flex flex-col">
        <div class="flex-auto flex flex-col">
            <el-button class="mb-8" type="primary" style="width: 100px" @click="handleAdd"
                >新增角色
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="loading"
                :data="tableData"
                :showPage="false"
                @getTableData="getTableData"
            >
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="create_time_text" label="添加时间" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.row)">编辑</el-button>
                        <el-popconfirm
                            title="请确认是否删除该角色"
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
        add-title="新增角色"
        edit-title="编辑角色"
        @handleCancel="dialogVisible = false"
        @handleAdd="addCorporationAuthGroup"
        @handleEdit="editCorporationAuthGroup"
    >
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="120px"
            style="max-width: 460px"
        >
            <el-form-item label="职能名称" prop="auth_name">
                <el-input v-model="form.auth_name" />
            </el-form-item>
            <el-form-item label="职能名称">
                <el-tree
                    ref="treeRef"
                    :data="rolePermissions"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="defaultCheckedKeys"
                    :props="{ children: 'childlist', label: 'title' }"
                />
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import {
addCorporationAuthGroupApi,
delCorporationAuthGroupApi,
editCorporationAuthGroupApi,
getCorporationAuthGroupApi,
getCorporationPackInfoApi,
} from '@/server/organization'
import { useUserStore } from '@/store/user'
import { clearObject } from '@/utils/index'
import { ElMessage } from 'element-plus'
import { nextTick, reactive, ref } from 'vue'

const { userInfo } = useUserStore(),
    loading = ref(null),
    treeRef = ref(null),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    tableData = ref([]),
    dialogVisible = ref(false),
    form = reactive({
        auth_name: '',
    }),
    formRef = ref(null),
    rolePermissions = ref(),
    rules = reactive({
        auth_name: [{ required: true, message: '请输入职能名称', trigger: 'blur' }],
    }),
    type = ref(true),
    defaultCheckedKeys = ref([])
let childIds = []

const getTableData = async () => {
    loading.value = true

    let params = {
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    }

    try {
        const { data } = await getCorporationAuthGroupApi(params)
        tableData.value = data
        page.total = Number(tableData.value.length)
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const getCorporationPackInfo = async () => {
    const {
        data: { node_list },
    } = await getCorporationPackInfoApi({
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
    })

    rolePermissions.value = node_list
}

const handleDelete = async (item) => {
    const { data, code, msg } = await delCorporationAuthGroupApi(item.id)
    if (code === 200) {
        ElMessage.success('删除成功')
        getTableData()
    } else {
        ElMessage.error(msg)
    }
}

const handleAdd = async () => {
    type.value = true
    clearObject(form)
    // defaultCheckedKeys.value = []
    dialogVisible.value = true
    await nextTick()
    treeRef.value.setCheckedKeys([], false)
}

const handleEdit = async (item) => {
    childIds = []
    form.auth_group_id = item.id
    form.auth_name = item.name
    // defaultCheckedKeys.value = item.node_ids.split(',')
    // let childIds = item.node_ids.split(',')
    item.node_ids.split(',').forEach((element) => {
        getChildIds([{ childlist: rolePermissions.value }], element)
    })
    type.value = false
    dialogVisible.value = true
    await nextTick()
    treeRef.value.setCheckedKeys(Array.from(new Set(childIds)), true)
}

const getChildIds = (arr, id) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].childlist.length === 0) {
            if (id == arr[i].id) {
                childIds.push(id)
            }
        }
        getChildIds(arr[i].childlist, id)
    }
}

const addCorporationAuthGroup = async () => {
    if (!formRef.value) return
    const res = await formRef.value.validate()
    const { data, code, msg } = await addCorporationAuthGroupApi({
        ...form,
        type: 1,
        corporation_guid: userInfo.extinfo?.Organization?.GUID,
        node_ids: '13',
    })
    if (code === 200) {
        ElMessage.success('新增成功')
        clearObject(form)
        getTableData(true)
        dialogVisible.value = false
    } else {
        ElMessage.error(msg)
    }
}

const editCorporationAuthGroup = async () => {
    if (!formRef.value) return
    const res = await formRef.value.validate()
    const { data, code, msg } = await editCorporationAuthGroupApi({
        ...form,
        type: 1,
        node_ids: treeRef.value
            .getCheckedKeys(false)
            .concat(treeRef.value.getHalfCheckedKeys())
            .join(','),
    })
    if (code === 200) {
        ElMessage.success('编辑成功')
        clearObject(form)
        getTableData(true)
        dialogVisible.value = false
    } else {
        ElMessage.error(msg)
    }
}

getTableData()
getCorporationPackInfo()
</script>

<style lang="scss" scoped></style>
