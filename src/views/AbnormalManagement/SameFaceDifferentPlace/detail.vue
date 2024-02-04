<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col">
        <div class="flex items-center mb-[5.6rem]">
            <div class="w-[160px] flex items-center">
                <p class="text-title">同脸出现地总数</p>
                <span class="ml-auto text-primary text-2xl font-bold">{{
                    details?.details?.locationSet?.length ?? 0
                }}</span>
                <p class="text-title">个</p>
            </div>
            <el-button round class="mx-8" :color="abnormalOrderColor[details?.status]" plain>{{
                abnormalOrderStatus[details?.status] ?? '--'
            }}</el-button>
            <div class="flex items-center mr-8">
                <p class="text-title">异常上报编号:</p>
                <p>{{ details.code ?? '--' }}</p>
                <copy-document :val="details?.code" />
            </div>
            <div class="flex">
                <p class="text-title">上报时间:</p>
                <p>{{ details.createTime ?? '--' }}</p>
            </div>
            <el-button round class="ml-auto" @click="state.logDialogVisible = true"
                >处理日志
            </el-button>
            <el-button
                v-if="details?.status !== 'COMPLETED' && details?.status !== 'CANCELLED'"
                round
                type="primary"
                @click="state.remarkDialogVisible = true"
                >编辑备注
            </el-button>
            <el-button
                v-if="details?.status !== 'COMPLETED' && details?.status !== 'CANCELLED'"
                round
                type="primary"
                @click="state.forwardDialogVisible = true"
                >转发下一级
            </el-button>
            <el-button
                v-if="details?.status === 'PROCESSING' || details?.status === 'WAITING'"
                round
                type="success"
                @click="state.resultDialogVisible = true"
                >填写处理结果
            </el-button>
            <el-button
                v-if="details?.status === 'PROCESSING' || details?.status === 'WAITING'"
                round
                type="danger"
                @click="handleRevoke(state.code, getDetails)"
                >撤销本上报
            </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-6 gap-4 mb-[3.2rem]">
            <descriptions-item label="订单签收地">{{
                details.orderAddress ?? '--'
            }}</descriptions-item>
            <descriptions-item label="订单地址坐标">
                <map-popover
                    :longitude="details?.orderLongitude"
                    :latitude="details?.orderLatitude"
                >
                    {{ `${details?.orderLongitude},${details?.orderLatitude}` ?? '--' }}
                </map-popover>
            </descriptions-item>
            <descriptions-item label="签收店名">
                {{ details?.order?.customer?.customerName ?? '--' }}
                <copy-document :val="details?.order?.customer?.customerName" />
            </descriptions-item>
            <descriptions-item label="注册人名">
                <registrant-name-popover :value="details?.order?.customer">
                    {{ details?.order?.customer?.contactPerson ?? '--' }}
                </registrant-name-popover>
            </descriptions-item>
        </div>
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">同脸异地信息</div>
            <div class="mb-8">
                <div class="grid grid-cols-6 gap-4">
                    <descriptions-item label="同脸图像">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="`${details?.signingInfo?.image}?${Date.now()}`"
                            fit="cover"
                            :preview-src-list="[`${details?.signingInfo?.image}?${Date.now()}`]"
                            :append-to-body="true"
                            :preview-teleported="true"
                    /></descriptions-item>
                    <descriptions-item label="系统登记人名">
                        <registrant-name-popover :value="details?.order?.customer">
                            {{ details?.details?.contactPerson ?? '--' }}
                        </registrant-name-popover>
                    </descriptions-item>
                </div>
            </div>
            <div class="flex">
                <Table :data="state.tableData" :showPage="false" border style="width: 100%">
                    <el-table-column prop="customer.customerName" label="客户名称" width="180" />
                    <el-table-column prop="createTime" label="时间" />
                    <el-table-column prop="orderSn" label="订单号" />
                    <el-table-column prop="customer.contactPerson" label="注册人名" />
                    <el-table-column prop="quantity" label="订单盒数" />
                    <el-table-column prop="amount" label="订单金额" />
                    <el-table-column label="图片">
                        <template #default="{ row }">
                            <el-image
                                style="width: 50px; height: 50px"
                                :src="`${details?.signingInfo?.image}?x-oss-process=image/resize,w_100,h_100`"
                                fit="cover"
                                :preview-src-list="[`${details?.signingInfo?.image}?${Date.now()}`]"
                                :append-to-body="true"
                                :preview-teleported="true"
                            />
                        </template>
                    </el-table-column>
                </Table>
            </div>
        </div>
        <el-divider />
        <!-- 订单信息 -->
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">订单信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-[3.2rem]">
                <descriptions-item label="订单编号">
                    {{ details?.order?.orderSn ?? '--' }}
                    <copy-document :val="details?.order?.orderSn" />
                </descriptions-item>
                <descriptions-item label="客户名称">
                    {{ details?.order?.customer?.customerName ?? '--' }}
                    <copy-document :val="details?.order?.customer?.customerName" />
                </descriptions-item>
                <descriptions-item label="签收地址">
                    <map-popover
                        :longitude="details?.orderLongitude"
                        :latitude="details?.orderLatitude"
                    >
                        {{ details?.orderAddress ?? '--' }}
                    </map-popover>
                </descriptions-item>
                <descriptions-item label="品种数">{{
                    details?.order?.skuCount ?? '--'
                }}</descriptions-item>
                <descriptions-item label="总盒数">{{
                    details?.order?.quantity ?? '--'
                }}</descriptions-item>
                <descriptions-item label="总金额（元）">{{
                    details?.order?.amount ? `￥${details?.order?.amount}` : '--'
                }}</descriptions-item>
            </div>
        </div>
        <el-divider />
        <!-- 运输信息 -->
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">运输信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-[3.2rem]">
                <descriptions-item label="运输单号">
                    {{ details?.shippingOrder?.shippingSn ?? '--' }}
                    <copy-document :val="details?.shippingOrder?.shippingSn" />
                </descriptions-item>
                <descriptions-item label="运输日期">{{
                    details?.shippingOrder?.shippingDate ?? '--'
                }}</descriptions-item>
                <descriptions-item label="车辆牌照">
                    {{ details?.shippingOrder?.licensePlate ?? '--' }}
                    <copy-document :val="details?.shippingOrder?.licensePlate" />
                </descriptions-item>
                <descriptions-item label="运输人">{{
                    details?.shippingOrder?.driver?.name ?? '--'
                }}</descriptions-item>
                <descriptions-item label="驾驶证号">{{
                    details?.shippingOrder?.driver?.driverLicense ?? '--'
                }}</descriptions-item>
                <descriptions-item label="配送人">{{
                    details?.shippingOrder?.deliveryPerson?.name ?? '--'
                }}</descriptions-item>
                <descriptions-item label="身份证号"
                    >{{ details?.shippingOrder?.deliveryPerson?.idCard ?? '--' }}
                </descriptions-item>
            </div>
        </div>
    </div>
    <!-- 处理日志dialog -->
    <log-dialog
        width="80%"
        v-model="state.logDialogVisible"
        :data="details.exceptionHandlingList"
        center
    >
    </log-dialog>
    <!-- 编辑备注dialog -->
    <remark-dialog
        v-model="state.remarkDialogVisible"
        :exceptionCode="state.code"
        @confirm="getDetails"
    ></remark-dialog>
    <!-- 处理结果填报 -->
    <processing-result-dialog
        v-model="state.resultDialogVisible"
        :exceptionCode="state.code"
        @confirm="getDetails"
    >
    </processing-result-dialog>
    <!-- 转发下一级 -->
    <forward-dialog
        v-model="state.forwardDialogVisible"
        :exceptionCode="state.code"
        @confirm="getDetails"
    ></forward-dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Table from '@/components/table/index.vue'
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderColor, abnormalOrderStatus } from '@/utils/enum'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const { handleRevoke } = useExceptionMonitoringManagement()

const route = useRoute()
const state = reactive({
        code: '',
        remark: '测试备注',
        tableData: [],
        logDialogVisible: false, // 日志弹窗
        remarkDialogVisible: false, // 备注弹窗
        forwardDialogVisible: false, // 转发弹窗
        resultDialogVisible: false, // 处理结果弹窗
    }),
    details = reactive({})

onMounted(async () => {
    state.code = route.params.id
    await getDetails()
    await getOrderList()
})

const getOrderList = async () => {
    const orderSns = details?.details?.locationSet.map((item) => item.orderSn).join(',')
    const { data } = await tobaccoApi('get', `/api/v1/tobacco/order/list/${orderSns}`)
    state.tableData = data
}

// 获取详情
const getDetails = async () => {
    const { data } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/${state.code}`)
    data.details = JSON.parse(data.details)
    Object.assign(details, data)
    console.log('details:', details)
}
</script>
