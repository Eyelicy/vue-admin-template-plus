<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">异常预警时间</div>
                <el-date-picker
                    :default-time="[
                        new Date(2000, 1, 1, 0, 0, 0),
                        new Date(2000, 2, 1, 23, 59, 59),
                    ]"
                    v-model="query.datetimerange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">异常类型</div>
                <el-select v-model="query.exceptionType" placeholder="请选择状态" clearable>
                    <el-option
                        v-for="(item, key) in exceptionStatus"
                        :key="item"
                        :label="item"
                        :value="key"
                    />
                </el-select>
            </div>
            <div class="table-header">
                <div class="table-header-lab">客户名称</div>
                <el-input v-model="query.customerName" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">客户预警等级</div>
                <el-input v-model="query.alertLevel" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单编号</div>
                <el-input v-model="query.orderSn" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输编号</div>
                <el-input v-model="query.shippingOrderSn" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">派送员</div>
                <el-input v-model="query.deliveryPersonName" clearable> </el-input>
            </div>
        </TableHead>
        <div class="flex-auto flex flex-col">
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="state.loading"
                :data="state.tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="createTime" label="异常预警时间"> </el-table-column>
                <el-table-column prop="status" label="异常类型">
                    <template #default="{ row }">
                        {{ exceptionStatus[row.exceptionType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="订单编号">
                    <template #default="{ row }">
                        {{ row?.orderSn  }}
                        <copy-document :val="row?.orderSn" />
                    </template>
                </el-table-column>
                <el-table-column prop="order.customer.customerName" label="客户名称">
                    <template #default="{ row }">
                        {{ row?.order?.customer?.customerName }}
                        <copy-document :val="row?.order?.customer?.customerName" />
                    </template>
                </el-table-column>
                <el-table-column prop="orderAddress" label="签收地址">
                    <template #default="{ row }">
                        {{ row?.orderAddress  }}
                        <copy-document :val="row?.orderAddress" />
                    </template>
                </el-table-column>
                <el-table-column prop="shippingOrder.shippingSn" label="运输单号">
                    <template #default="{ row }">
                        {{ row?.shippingOrder.shippingSn  }}
                        <copy-document :val="row?.shippingOrder.shippingSn" />
                    </template>
                </el-table-column>
                <el-table-column prop="order.skuCount" label="品种数" />
                <el-table-column prop="order.quantity" label="总盒数" />
                <el-table-column prop="order.amount" label="总金额（元）" />
                <el-table-column label="操作" width="380px">
                    <template #default="{ row }">
                        <el-button @click="handleShowLog(row.exceptionHandlingList)"
                            >处理日志</el-button
                        >
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
    <!-- 处理日志dialog -->
    <log-dialog
        width="80%"
        v-model="state.logDialogVisible"
        :data="state.exceptionHandlingList"
        center
    >
    </log-dialog>
</template>

<script setup>
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { exceptionStatus } from '@/utils/enum'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(),
    router = useRouter(),
    state = reactive({
        loading: false,
        logDialogVisible: false,
        tableData: [],
        exceptionHandlingList: [],
    }),
    query = reactive({}),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    if (route.params.customerName) {
        query.customerName = route.params.customerName
    }
    await getTableData(true)
})

// 日志弹窗
const handleShowLog = (data) => {
    state.logDialogVisible = true
    state.exceptionHandlingList = data
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
    if (query.datetimerange && query.datetimerange.length > 0) {
        params.createTimeStart = query.datetimerange[0]
        params.createTimeEnd = query.datetimerange[1]
        delete params.datetimerange
    }
    try {
        const {
            data: { rows, total },
        } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
        rows.forEach((item) => {
            item.details = JSON.parse(item.details)
        })
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
</script>
