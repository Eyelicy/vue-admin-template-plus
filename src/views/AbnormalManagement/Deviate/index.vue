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
                    type="date"
                    placeholder="开始时间"
                    clearable
                    style="width: 100px"
                    value-format="yyyy-MM-dd"
                    :picker-options="{
                        disabledDate: (time) => {
                            return time.getTime() > Date.now()
                        },
                    }"
                />
                <span class="mx-2">至</span>
                <el-date-picker
                    v-model="query.createTimeEnd"
                    type="date"
                    placeholder="结束时间"
                    clearable
                    style="width: 100px"
                    value-format="yyyy-MM-dd"
                    :picker-options="{
                        disabledDate: (time) => {
                            return time.getTime() > Date.now()
                        },
                    }"
                />
            </div>
            <!-- 暂无 -->
            <div class="table-header">
                <div class="table-header-lab">偏差距离范围 ≤（暂无）</div>
                <el-input v-model="query.error_num" clearable> </el-input>
            </div>
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
                    value-format="yyyy-MM-dd"
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
                                    path: `delivery-location-deviation/detail/${row.code}`,
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
                <el-table-column label="偏差距离" sortable>
                    <template #default="{ row }">
                        {{ JSON.parse(row.details).deviation }}
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
                    <template #default="scope">
                        <el-button @click="handleEdit(scope.row)">备注</el-button>
                        <el-button @click="handleEdit(scope.row)">转发</el-button>
                        <el-button @click="handleEdit(scope.row)">结果</el-button>
                        <el-button @click="handleEdit(scope.row)">撤销</el-button>
                        <el-button @click="handleEdit(scope.row)">日志</el-button>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
</template>

<script setup>
import orderInfoPopover from '@/components/popover/order-info-popover.vue'
import abnormalOrderStatusSelect from '@/components/select/abnormal-order-status-select.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderStatus } from '@/utils/enum'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter(),
    state = reactive({
        loading: false,
        tableData: [],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
    }),
    query = reactive({
        exceptionType: 'A', // 异常类型 A:签收地偏离, B:同店异脸, C:同脸异地
    }),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    await getTableData(true)
})

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
        } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
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
