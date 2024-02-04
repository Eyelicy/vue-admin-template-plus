<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">送货路线</div>
                <line-select v-model="query.routeCode" placeholder="请选择送货路线" clearable />
            </div>
            <div class="table-header">
                <div class="table-header-lab">包含客户</div>
                <client-select
                    v-model="query.customerName"
                    placeholder="请选择包含客户"
                    clearable
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">包含集中签收点</div>
                <centralized-signing-point-select
                    v-model="query.unifiedSigningPointName"
                    placeholder="请选择包含集中签收点"
                    clearable
                />
            </div>
        </TableHead>
        <el-button
                class="mb-8"
                type="primary"
                style="width: 100px"
                :icon="Plus"
                @click="state.addConfigurationDialogVisible = true"
                >新增配置
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="state.loading"
                :data="state.tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="routeCode" label="送货路线编号"> </el-table-column>
                <el-table-column prop="deliveryRoute.routeName" label="送货路线名称">
                </el-table-column>
                <el-table-column prop="threshold" label="同脸异地告警数值（大于等于）">
                    <template #default="{ row, $index }">
                        <div class="flex items-center">
                            <el-input
                                v-if="state.editIndex === $index && state.name === 'threshold'"
                                v-model="row.threshold"
                                @keyup.enter="(e) => handleEdit(row)"
                            />
                            <span v-else>{{ row.threshold }}</span>
                            <el-icon
                                class="cursor-pointer ml-auto"
                                @click="setEdit('threshold', $index)"
                                ><EditPen
                            /></el-icon>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="period" label="订单统计周期（小于等于/天）">
                    <template #default="{ row, $index }">
                        <div class="flex items-center">
                            <el-input
                                v-if="state.editIndex === $index && state.name === 'period'"
                                v-model="row.period"
                                @keyup.enter="(e) => handleEdit(row)"
                            />
                            <span v-else>{{ row.period }}</span>
                            <el-icon
                                class="cursor-pointer ml-auto"
                                @click="setEdit('period', $index)"
                                ><EditPen
                            /></el-icon>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间"
                    :formatter="
                        (row) => {
                            return row.updateTime ?? row.createTime
                        }
                    "
                />
                <el-table-column prop="updateBy_username" label="更新者" />
                <el-table-column prop="status" label="启用状态">
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.status"
                            active-value="A"
                            inactive-value="D"
                            :loading="state.statusLoading"
                            @change="handleStatus(row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280px">
                    <template #default="{ row }">
                        <el-button
                            @click="
                                router.push({
                                    path: `/anomaly-detection-configuration/same-face-different-places/edit/${row.id}`,
                                })
                            "
                            >编辑</el-button
                        >
                        <el-button @click="handleShowLog(row)">日志</el-button>
                        <el-popconfirm
                            title="请确认是否删除该条数据？"
                            @confirm="handleDelete(row)"
                        >
                            <template #reference>
                                <el-button>删除 </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </Table>
    </div>
    <!-- 处理日志 -->
    <Dialog width="80%" v-model="state.logDialogVisible" title="处理日志" center>
        <div>
            <Table :data="state.exceptionHandlingList" :show-page="false">
                <el-table-column
                    prop="threshold"
                    label="同脸异地告警数值（大于等于）"
                ></el-table-column>
                <el-table-column
                    prop="period"
                    label="订单统计周期（小于等于/天）"
                ></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column prop="createBy_username" label="处理者"></el-table-column>
            </Table>
        </div>
    </Dialog>
    <Dialog
        width="600px"
        v-model="state.addConfigurationDialogVisible"
        title="新增同脸异地配置"
        center
    >
        <el-form
            style="width: 500px"
            :model="addConfiguration"
            label-width="260px"
            ref="addConfigurationRef"
            :rules="rules"
        >
            <el-form-item label="送货路线" prop="routeCode">
                <line-select
                    v-model="addConfiguration.routeCode"
                    placeholder="请选择送货路线"
                    class="w-full"
                />
            </el-form-item>
            <el-form-item label="同脸异地告警数值（大于等于）" prop="threshold">
                <el-input-number
                    v-model="addConfiguration.threshold"
                    placeholder="请输入同脸异地告警数值"
                    class="w-full"
                    :min="0"
                    :max="999999999"
                />
            </el-form-item>
            <el-form-item label="订单统计周期（小于等于/天）" prop="period">
                <el-input-number
                    v-model="addConfiguration.period"
                    placeholder="请输入订单统计周期"
                    class="w-full"
                    :min="0"
                    :max="999999999"
                />
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="addConfiguration.status" active-value="A" inactive-value="D" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="w-[100px]" @click="state.addConfigurationDialogVisible = false"
                >取消</el-button
            >
            <el-button
                type="primary"
                class="w-[100px]"
                @click="handleAddConfiguration(addConfigurationRef)"
                >确定
            </el-button>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import centralizedSigningPointSelect from '@/components/select/centralized-signing-point-select.vue'
import clientSelect from '@/components/select/client-select.vue'
import lineSelect from '@/components/select/line-select.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { EditPen, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter(),
    state = reactive({
        name: '',
        editIndex: '',
        loading: false,
        logDialogVisible: false,
        addConfigurationDialogVisible: false, // 新增同脸异地配置弹窗
        statusLoading: false, // 启用状态loading
        tableData: [],
    }),
    addConfigurationRef = ref(null), // 新增签收地偏离配置弹窗ref
    addConfiguration = reactive({
        routeCode: '',
        threshold: '',
        period: '',
        status: 'A',
    }),
    rules = reactive({
        routeCode: [{ required: true, message: '请选择送货路线', trigger: 'change' }],
        threshold: [{ required: true, message: '请输入同脸异地告警数值', trigger: 'blur' }],
        period: [{ required: true, message: '请输入订单统计周期', trigger: 'blur' }],
    }),
    query = reactive({
        routeCode: '',
    }),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    await getTableData(true)
})

// 编辑
const setEdit = (name, index) => {
    state.name = name
    state.editIndex = index
}

// 编辑表格数据
const handleEdit = async (row) => {
    const { code } = await tobaccoApi('put', `/api/v1/tobacco/signingMultiLocationsConfig`, row)
    if (code === 200) {
        ElMessage.success('修改成功')
        await getTableData()
    }
    state.editIndex = ''
    state.name = ''
}

// 查看日志
const handleShowLog = async (row) => {
    state.logDialogVisible = true
    await getLogData(row.id)
}

// 获取日志数据
const getLogData = async (id) => {
    let params = {
        id: id,
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingMultiLocationsConfigHis/list?${qs.stringify(params)}`
    )
    if (code === 200) {
        state.exceptionHandlingList = rows
    }
}

// 新增签收地偏离配置
const handleAddConfiguration = async (formEl) => {
    if (!formEl) return
    try {
        await formEl.validate()
        const {
            data: { data },
            code,
        } = await tobaccoApi(
            'post',
            '/api/v1/tobacco/signingMultiLocationsConfig',
            addConfiguration
        )
        if (code === 200) {
            formEl.resetFields()
            getTableData(true)
            state.addConfigurationDialogVisible = false
        }
    } catch (error) {
        console.log(error)
    }
}

// 删除
const handleDelete = async (row) => {
    const { code, data } = await tobaccoApi(
        'delete',
        `/api/v1/tobacco/signingMultiLocationsConfig/${row.id}`
    )
    if (code === 200) {
        ElMessage.success('删除成功')
        getTableData()
    }
}

// 启用状态
const handleStatus = async (row) => {
    state.statusLoading = true
    try {
        const { code } = await tobaccoApi('put', '/api/v1/tobacco/signingMultiLocationsConfig', row)
        if (code === 200) {
            await getTableData()
        }
    } catch (error) {
        console.log(error)
    } finally {
        state.statusLoading = false
    }
}

// 获取表格数据
const getTableData = async (init) => {
    state.loading = true
    if (init) {
        page.index = 1
    }

    let params = {
        pageNum: page.index,
        pageSize: page.size,
        ...query,
    }
    try {
        const {
            data: { rows, total },
        } = await tobaccoApi(
            'get',
            `/api/v1/tobacco/signingMultiLocationsConfig/list?${qs.stringify(params)}`
        )
        state.tableData = rows
        page.total = Number(total)
    } catch (error) {
        state.tableData = []
        page.index = 1
        page.total = 0
    } finally {
        state.loading = false
    }
}
</script>
