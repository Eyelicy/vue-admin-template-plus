<style lang="scss" scoped>
.tag-level-1 {
    background-color: #f34628;
    border-color: #f34628;
    color: #fff;
}

.tag-level-2 {
    background-color: #303133;
    border-color: #303133;
    color: #fff;
}

.tag-level-3 {
    background-color: #feea33;
    border-color: #feea33;
    color: #000;
}
</style>

<template>
    <div class="w-full h-full flex flex-col">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">预警等级</div>
                <el-select v-model="query.alertLevel" placeholder="请选择预警等级" clearable>
                    <el-option label="红标客户（一级预警）" :value="1" />
                    <el-option label="黑标客户（二级预警）" :value="2" />
                    <el-option label="黄标客户（三级预警）" :value="3" />
                </el-select>
            </div>

            <div class="table-header">
                <div class="table-header-lab">派送员</div>
                <el-input v-model="query.deliveryPersonName" clearable> </el-input>
            </div>
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
        </TableHead>
        <Table
            class="flex-auto"
            ref="table"
            v-model:page="page"
            v-loading="state.loading"
            :data="state.tableData"
            @getTableData="getTableData"
        >
            <el-table-column prop="customerName" label="客户名称"> </el-table-column>
            <el-table-column prop="customerAlertLevel.name" label="预警等级">
                <template #default="{ row }">
                    <el-tag
                        class="p-4 rounded-md mr-12"
                        :class="`tag-level-${row?.customerAlertLevel.id}`"
                    >
                        {{ row.customerAlertLevel.name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="labelList" label="自定义分类">
                <template #default="{ row }">
                    <div class="flex flex-wrap">
                        <el-tag
                            v-for="(item, index) in row.labelList"
                            :key="item.id"
                            :type="item.type"
                            class="mb-2"
                            :class="index === row.labelList.length - 1 ? '' : 'mr-2'"
                        >
                            {{ item.labelName }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="customerDeliveryInfo.deliveryRoute.routeName" label="所属路线" />
            <el-table-column
                prop="customerDeliveryInfo.deliveryRoute.stationCode"
                label="所属服务站点"
            />
            <el-table-column prop="deliveryPersonnelNames" label="关联派送员" />
            <el-table-column label="操作" width="380px">
                <template #default="{ row }">
                    <el-button @click="handleEdit(row)">编辑</el-button>
                    <el-button @click="handleLogDialogVisible(row)">日志</el-button>
                    <el-button
                        @click="
                            router.push({
                                path: `abnormal-receipt-order/${row.customerName}`,
                            })
                        "
                        >订单</el-button
                    >
                    <el-popconfirm title="请确认是否删除该条数据？" @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button>删除 </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </Table>
    </div>
    <Dialog width="600px" v-model="state.logDialogVisible" title="风险预警等级变化日志" center>
        <Table :data="warningLog.tableData" border style="width: 100%" :showPage="false">
            <el-table-column prop="detail" label="等级变化" />
            <el-table-column prop="createTime" label="时间" />
            <el-table-column prop="createBy_username" label="处理者" />
        </Table>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter(),
    state = reactive({
        logDialogVisible: false,
        loading: false,
        customerCode: '',
        tableData: [
            {
                abnormal_code: '123',
                status: 1,
                register_name: '张三',
                order_code: '123',
            },
        ],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
    }),
    warningLog = reactive({
        tableData: [],
    }),
    query = reactive({}),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    await getTableData(true)
})

const handleEdit = (row) => {
    router.push({
        path: `abnormal-receipt-customer/edit/${row.customerCode}`,
    })
}

const handleLogDialogVisible = async (row) => {
    state.logDialogVisible = true
    state.customerCode = row.customerCode
    await getLogData()
}

// 删除异常客户
const handleDelete = async (row) => {
    const { code } = await tobaccoApi('delete', `/api/v1/tobacco/customer/${row.customerCode}`)
    if (code === 200) {
        getTableData(true)
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
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
    if (query.alertLevel) {
        params.alertLevel = query.alertLevel
    } else {
        params.alertLevel = -1
    }
    try {
        const {
            data: { rows, total },
        } = await tobaccoApi('get', `/api/v1/tobacco/customer/list?${qs.stringify(params)}`)
        // rows.forEach((item) => {
        //     item.details = JSON.parse(item.details)
        // })
        state.tableData = rows
        console.log(state.tableData)
        page.total = Number(total)
    } catch (error) {
        state.tableData = []
        page.index = 1
        page.total = 0
    } finally {
        state.loading = false
    }
}

// 获取日志数据
const getLogData = async () => {
    let params = {
        customerCode: state.customerCode,
    }
    const {
        data: { rows },
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/customerAlertLevelChangeLog/list?${qs.stringify(params)}`
    )
    warningLog.tableData = rows
}
</script>
