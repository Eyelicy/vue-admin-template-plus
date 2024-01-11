<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onReset=";(time = []), getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">机构名称</div>
                <el-input v-model="query.search" @change="getTableData" />
            </div>
            <div class="table-header">
                <div class="table-header-lab">申请状态</div>
                <el-select
                    v-model="query.search_status"
                    placeholder="请选择申请状态"
                    @change="getTableData"
                    clearable
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
            <div class="table-header">
                <div class="table-header-lab">时间范围</div>
                <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="到"
                    start-placeholder="起始时间"
                    end-placeholder="结束事件"
                    @change="getTableData"
                    value-format="YYYY-MM-DD"
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">法人代表</div>
                <el-input v-model="query.legal_person" @change="getTableData" />
            </div>
            <div class="table-header">
                <div class="table-header-lab">统一社会信用代码</div>
                <el-input v-model="query.license_code" @change="getTableData" />
            </div>
        </TableHead>
        <div class="flex-auto flex flex-col">
            <el-button
                class="mb-8"
                type="primary"
                style="width: 100px"
                @click="dialogVisible = true"
                >新增机构
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="loading"
                :data="tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="name" label="机构名称" />
                <el-table-column prop="legal_person_name" label="法人代表" />
                <el-table-column prop="license_code" label="统一社会信用代码" />
                <el-table-column prop="address" label="地址" />
                <el-table-column prop="create_time_text" label="添加时间" />
                <el-table-column prop="update_time_text" label="更新时间" />
                <!-- <el-table-column label="操作">
                    <template #default>
                        <el-button type="danger">禁用</el-button>
                        <el-button type="primary">启用</el-button>
                    </template>
                </el-table-column> -->
            </Table>
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="新增机构" width="30%">
        <el-form
            :model="form"
            ref="formRef"
            :rules="rules"
            label-width="140px"
            style="max-width: 460px"
        >
            <el-form-item label="单位名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legal_person_name">
                <el-input v-model="form.legal_person_name" />
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="license">
                <el-input v-model="form.license" />
            </el-form-item>
            <el-form-item label="所在地" prop="area_id">
                <AddressCascader
                    v-model:id="form.area_id"
                    v-model:code="form.area_code"
                ></AddressCascader>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addCorporation"> 确定 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import AddressCascader from '@/components/addressCascader/index.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import {
addCorporationApi,
getCorporationApi,
getCorporationSearchApi,
} from '@/server/organization'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const validateName = async (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请填写单位名称'))
    }
    const { data } = await getCorporationSearchApi({ name: value, only_name: false })
    if (data.length != 0) {
        callback(new Error('该单位已注册！'))
    } else {
        callback()
    }
}

const loading = ref(null),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    tableData = ref([]),
    dialogVisible = ref(false),
    form = reactive({
        name: '',
        area_id: '',
        area_code: '',
        legal_person_name: '',
        organization_attribute: 99,
        contact: [],
    }),
    formRef = ref(null),
    rules = reactive({
        name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' },
        ],
        area_id: [{ required: true, message: '请选择所在地', trigger: 'change' }],
        legal_person_name: [{ required: true, message: '请填写法人', trigger: 'blur' }],
        address: [{ required: true, message: '请填写地址', trigger: 'change' }],
    }),
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
    time = ref()

let query = ref({})

const getTableData = async (init) => {
    loading.value = true
    if (init) {
        page.index = 1
    }
    if (time.value) {
        query.value.start_time = time.value[0]
        query.value.end_time = time.value[1]
    }

    let params = {
        page: page.index,
        limit: page.size,
        ...query.value,
    }

    try {
        const {
            data: { data, total },
        } = await getCorporationApi(params)
        tableData.value = data
        page.total = Number(total)
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const addCorporation = async () => {
    if (!formRef.value) return
    try {
        const res = await formRef.value.validate()
        const { data, code, msg } = await addCorporationApi(form)
        if (code === 200) {
            ElMessage.success('新增成功')
            getTableData(true)
            dialogVisible.value = false
        } else {
            ElMessage.error(msg)
        }
    } catch (error) {
        console.log('login', error)
    }
}

getTableData(true)
</script>

<style lang="scss" scoped></style>
