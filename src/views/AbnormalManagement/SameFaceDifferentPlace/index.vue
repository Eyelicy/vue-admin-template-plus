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
                <el-table-column prop="code" label="异常上报编号" width="230">
                    <template #default="{ row }">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="
                                router.push({
                                    path: `same-face-different-places/detail/${row.code}`,
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
                <el-table-column prop="createTime" label="异常上报时间" />
                <el-table-column prop="order_code" label="同脸图像">
                    <template #default="{ row }">
                        <el-image
                            :append-to-body="true"
                            :preview-teleported="true"
                            style="width: 50px; height: 50px"
                            :src="row.signingInfo.image"
                            :preview-src-list="[row.signingInfo.image]"
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="order_code" label="系统标记人名">
                    <template #default="{ row }">
                        <registrant-info-popover :value="row.details">
                            {{ row.details.contactPerson }}
                        </registrant-info-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="order_code" label="出现地集合">
                    <template #default="{ row }">
                        <el-popover
                            width="240"
                            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                        >
                            <template #reference>
                                <div class="cursor-pointer">
                                    {{ row.details.locationSet.length }}
                                    <el-icon class="ml-2"><View /></el-icon>
                                </div>
                            </template>
                            <template #default>
                                <div>
                                    <div
                                        v-for="(item, index) in row.details.locationSet"
                                        :key="index"
                                    >
                                        <div
                                            class="bg-[rgba(232,239,247,0.5)] p-2 rounded-md"
                                            :class="`${
                                                index === row.details.locationSet.length - 1
                                                    ? ''
                                                    : 'mb-8'
                                            }`"
                                        >
                                            <div class="text-xl text-help mb-4">
                                                {{ item.customerName }}
                                            </div>
                                            <div class="text-xl text-help mb-4">
                                                {{ item.signingTime }}
                                            </div>
                                            <div class="text-xl text-help">
                                                {{ item.orderSn }}
                                            </div>
                                        </div>
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
                        <copy-document :val="row.orderSn" />
                    </template>
                </el-table-column>
                <el-table-column prop="shippingOrderSn" label="运输单号">
                    <template #default="{ row }">
                        {{ row.shippingOrderSn }}
                        <copy-document :val="row.shippingOrderSn" />
                    </template>
                </el-table-column>
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
        exceptionType: 'C', // 异常类型 A:签收地偏离, B:同店异脸, C:同脸异地
        ...query,
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    if (params.datetimerange && params.datetimerange.length > 0) {
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
