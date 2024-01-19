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
                    v-model="query.status"
                    placeholder="请选择状态"
                    clearable
                />
            </div>
            <div class="table-header">
                <div class="table-header-lab">异常上报时间</div>
                <el-date-picker
                    v-model="query.createTimeStart"
                    type="datetime"
                    placeholder="开始时间"
                    clearable
                    style="width: 100px"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :picker-options="{
                        disabledDate: (time) => {
                            return time.getTime() > Date.now()
                        },
                    }"
                />
                <span class="mx-2">至</span>
                <el-date-picker
                    v-model="query.createTimeEnd"
                    type="datetime"
                    placeholder="结束时间"
                    clearable
                    style="width: 100px"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :picker-options="{
                        disabledDate: (time) => {
                            return time.getTime() > Date.now()
                        },
                    }"
                />
            </div>
            <!-- 暂无 -->
            <!-- <div class="table-header">
                <div class="table-header-lab">偏差距离范围 ≤（暂无）</div>
                <el-input v-model="query.error_num" clearable> </el-input>
            </div> -->
            <div class="table-header">
                <div class="table-header-lab">订单编号</div>
                <el-input v-model="query.orderSn" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">店名关键词</div>
                <el-input v-model="query.customerName" clearable> </el-input>
            </div>
            <!-- 暂无 -->
            <div class="table-header">
                <div class="table-header-lab">购方关键词</div>
                <el-input v-model="query.buyer_name" clearable> </el-input>
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
                ref="table"
                v-model:page="page"
                v-loading="state.loading"
                :data="state.tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="code" label="异常上报编号">
                    <template #default="{ row }">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="
                                router.push({
                                    path: `same-store-different-faces/detail/${row.code}`,
                                })
                            "
                            >{{ row.code }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        {{ abnormalOrderStatus[row.status] }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="异常上报时间" />
                <el-table-column prop="customerName" label="签收店名">
                    <template #default="{ row }">
                        {{ row.details.customerName }}
                    </template>
                </el-table-column>
                <el-table-column prop="order_code" label="注册人名">
                    <template #default="{ row }">
                        <registrant-info-popover :value="row.details">
                            {{ row.details.contactPerson }}
                        </registrant-info-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="order_code" label="多脸信息集合">
                    <template #default="{ row }">
                        <el-popover
                            width="300"
                            popper-class="h-[400px] overflow-y-auto"
                            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                        >
                            <template #reference>
                                <div class="cursor-pointer">
                                    {{ row.details.multiFaceInfo.length }}
                                    <el-icon class="ml-2"><View /></el-icon>
                                </div>
                            </template>
                            <template #default>
                                <div
                                    v-for="(item, index) in row.details.multiFaceInfo"
                                    :key="index"
                                >
                                    <div
                                        class="bg-[rgba(232,239,247,0.5)] p-4 rounded-md"
                                        :class="`${
                                            index === row.details.multiFaceInfo.length - 1
                                                ? ''
                                                : 'mb-8'
                                        }`"
                                    >
                                        <el-image
                                            :append-to-body="true"
                                            :preview-teleported="true"
                                            style="width: 50px; height: 50px"
                                            :src="item.image"
                                            :preview-src-list="
                                                row.details.multiFaceInfo.map((item) => item.image)
                                            "
                                            fit="cover"
                                        />
                                        <div class="text-xl text-help mb-4">
                                            {{ item.name }}
                                        </div>
                                        <div class="text-xl text-help mb-4">
                                            概率: {{ item.probability }}
                                        </div>
                                        <div class="text-xl text-help">备注: {{ item.label }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="orderAddress" label="订单签收地" />
                <el-table-column prop="order_code" label="订单地址坐标">
                    <template #default="{ row }">
                        {{ row.orderLongitude }},{{ row.orderLatitude }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="订单编号">
                    <template #default="{ row }">
                        <order-info-popover :value="row">
                            {{ row.orderSn }}
                        </order-info-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="shippingOrderSn" label="运输单号" />
                <el-table-column label="操作" width="380px">
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
import registrantInfoPopover from '@/components/popover/registrant-info-popover.vue'
import abnormalOrderStatusSelect from '@/components/select/abnormal-order-status-select.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderStatus } from '@/utils/enum'
import { View } from '@element-plus/icons-vue'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const { handleRevoke } = useExceptionMonitoringManagement()

const router = useRouter(),
    state = reactive({
        loading: false,
        tableData: [],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
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

// 获取表格数据
const getTableData = async (init) => {
    state.loading = true
    if (init) {
        page.index = 1
    }

    let params = {
        pageNum: page.index,
        pageSize: page.size,
        exceptionType: 'B', // 异常类型 A:签收地偏离, B:同店异脸, C:同脸异地
        ...query,
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
