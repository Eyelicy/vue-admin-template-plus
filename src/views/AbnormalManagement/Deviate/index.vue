<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">异常上报编号</div>
                <el-input v-model="query.code" placeholder="请输入异常上报编号" clearable>
                </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">状态</div>
                <abnormal-order-status-select
                    class="w-[200px]"
                    v-model="query.status"
                    placeholder="请选择状态"
                    clearable
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">异常上报时间</div>
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
                <div class="table-header-lab">偏差距离范围 ≤</div>
                <el-input v-model="query.value" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单编号</div>
                <el-input v-model="query.orderSn" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">店名关键词</div>
                <el-input v-model="query.customerName" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">购方关键词</div>
                <el-input v-model="query.custKeyWords" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单总金额 ≤</div>
                <el-input v-model="query.orderTotalAmount" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输单号</div>
                <el-input v-model="query.shippingOrderSn" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输日期</div>
                <el-date-picker
                    v-model="query.shippingDate"
                    type="date"
                    placeholder="开始时间"
                    clearable
                    value-format="YYYY-MM-DD"
                    :picker-options="{
                        disabledDate: (time) => {
                            return time.getTime() > Date.now()
                        },
                    }"
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">车辆牌照</div>
                <el-input v-model="query.licensePlate" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输人</div>
                <el-input v-model="query.driverName" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">配送人</div>
                <el-input v-model="query.deliveryPersonName" clearable> </el-input>
            </div>
        </TableHead>
        <div class="flex-auto flex flex-col">
            <Table
                class="flex-auto"
                ref="tableRef"
                v-model:page="page"
                v-loading="state.loading"
                :data="state.tableData"
                @getTableData="getTableData"
                sortable="custom"
                @sort-change="sortChange"
                style="width: 100%"
            >
                <el-table-column prop="code" label="异常上报编号" width="230">
                    <template #default="{ row }">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="
                                router.push({
                                    path: `delivery-location-deviation/detail/${row.code}`,
                                })
                            "
                            >{{ row.code }}
                        </el-link>
                        <copy-document :val="row.code" />
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        {{ abnormalOrderStatus[row.status] }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" sortable label="异常上报时间" />
                <el-table-column prop="order_code" label="实际签收地">
                    <template #default="{ row }">
                        {{ JSON.parse(row.details).address }}
                    </template>
                </el-table-column>
                <el-table-column prop="order_code" label="实际地址坐标">
                    <template #default="{ row }">
                        {{
                            `${JSON.parse(row.details).longitude},${
                                JSON.parse(row.details).latitude
                            }`
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderAddress" label="订单签收地" />
                <el-table-column prop="order_code" label="订单地址坐标">
                    <template #default="{ row }">
                        {{ row.orderLongitude }},{{ row.orderLatitude }}
                    </template>
                </el-table-column>
                <el-table-column prop="deviation" label="偏差距离" sortable>
                    <!-- <template #default="{ row }">
                        {{ JSON.parse(row.details).deviation }}
                    </template> -->
                </el-table-column>
                <el-table-column prop="orderSn" label="订单编号">
                    <template #default="{ row }">
                        <order-info-popover :value="row">
                            {{ row.orderSn }}
                        </order-info-popover>
                        <copy-document :val="row.orderSn" />
                    </template>
                </el-table-column>
                <el-table-column prop="shippingOrderSn" label="运输单号">
                    <template #default="{ row }">
                        {{ row.shippingOrderSn }}
                        <copy-document :val="row.shippingOrderSn" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="380px" fixed="right">
                    <template #default="{ row }">
                        <el-button @click="handleEditRemark(row.code)">备注</el-button>
                        <el-button @click="handleShowForward(row)">转发</el-button>
                        <el-button @click="handleEditResult(row)">结果</el-button>
                        <el-button @click="handleRevoke(row.code, getTableData)">撤销</el-button>
                        <el-button @click="handleShowLog(row.exceptionHandlingList)"
                            >日志
                        </el-button>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
    <!-- 日志弹窗 -->
    <log-dialog
        width="80%"
        v-model="state.logDialogVisible"
        :data="state.exceptionHandlingList"
        center
    >
    </log-dialog>
    <!-- 备注弹窗 -->
    <remark-dialog
        v-model="state.remarkDialogVisible"
        :exceptionCode="state.exceptionCode"
        @confirm="getTableData"
    ></remark-dialog>
    <!-- 处理结果弹窗 -->
    <processing-result-dialog
        v-model="state.resultDialogVisible"
        v-model:result="state.result"
        @confirm="getTableData"
    >
    </processing-result-dialog>
    <!-- 转发弹窗 -->
    <forward-dialog
        v-model="state.forwardDialogVisible"
        :exceptionCode="state.code"
        @confirm="getTableData"
    ></forward-dialog>
</template>

<script setup>
import orderInfoPopover from '@/components/popover/order-info-popover.vue'
import abnormalOrderStatusSelect from '@/components/select/abnormal-order-status-select.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderStatus } from '@/utils/enum'
import qs from 'qs'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const { handleRevoke } = useExceptionMonitoringManagement()

const router = useRouter(),
    state = reactive({
        loading: false,
        tableData: [],
        exceptionHandlingList: [],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
        exceptionCode: '', // 异常上报编号
        logDialogVisible: false, // 日志弹窗
        remarkDialogVisible: false, // 备注弹窗
        result: '', // 处理结果
        resultDialogVisible: false, // 处理结果弹窗
    }),
    query = reactive({}),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    sort = reactive({
        prop: '',
        order: '',
    }),
    tableRef = ref(null)

onMounted(async () => {
    await getTableData(true)
})

// 备注弹窗
const handleEditRemark = (code) => {
    state.remarkDialogVisible = true
    state.exceptionCode = code
}

// 转发弹窗
const handleShowForward = (row) => {
    state.forwardDialogVisible = true
    state.code = row.code
}

// 处理结果弹窗
const handleEditResult = (row) => {
    state.exceptionCode = row.code
    state.result = row.result
    state.resultDialogVisible = true
}

// 日志弹窗
const handleShowLog = (data) => {
    state.logDialogVisible = true
    state.exceptionHandlingList = data
}

const sortChange = (e) => {
    const { order, prop } = e
    sort.order = order
    sort.prop = prop
}

// 获取表格数据
const getTableData = async (init) => {
    state.loading = true
    if (init) {
        page.index = 1
    }
    // tableRef.value.tableRef.clearSort()
    console.log(tableRef.value)
    let params = {
        pageNum: page.index,
        pageSize: page.size,
        exceptionType: 'A',
        ...query,
        orderByColumn: 'createTime',
        isAsc: 'desc',
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
        rows.forEach((element, index) => {
            rows[index].deviation = JSON.parse(element.details).deviation
        })
        if (sort.order && sort.prop) {
            state.tableData = sortByField(rows, sort.prop, sort.order)
        } else {
            state.tableData = rows
        }

        page.total = Number(total)
    } catch (error) {
        state.tableData = []
        page.index = 1
        page.total = 0
    } finally {
        state.loading = false
    }
}

const sortByField = (arr, field, order) => {
    return arr.sort((a, b) => {
        const valueA = a[field]
        const valueB = b[field]

        if (valueA < valueB) {
            return order === 'ascending' ? -1 : 1
        }
        if (valueA > valueB) {
            return order === 'ascending' ? 1 : -1
        }
        return 0
    })
}
</script>
