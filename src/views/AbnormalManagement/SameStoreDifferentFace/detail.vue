<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <div class="flex items-center mb-[5.6rem]">
            <div class="w-[160px] flex items-center">
                <p class="text-title">同店异脸总数</p>
                <span class="ml-auto text-primary text-2xl font-bold">{{
                    details?.details?.multiFaceInfo?.length ?? 0
                }}</span>
                <p class="text-title">个</p>
            </div>
            <el-button round class="mx-8">{{
                abnormalOrderStatus[details?.status] ?? '--'
            }}</el-button>
            <div class="flex mr-8">
                <p class="text-title">异常上报编号:</p>
                <p>{{ details.code ?? '--' }}</p>
            </div>
            <div class="flex">
                <p class="text-title">上报时间:</p>
                <p>{{ details.createTime ?? '--' }}</p>
            </div>
            <el-button round class="ml-auto" @click="state.logDialogVisible = true"
                >处理日志
            </el-button>
            <el-button round type="primary" @click="state.remarkDialogVisible = true"
                >编辑备注
            </el-button>
            <el-button round type="primary" @click="state.forwardDialogVisible = true"
                >转发下一级
            </el-button>
            <el-button round type="success" @click="state.resultDialogVisible = true"
                >填写处理结果
            </el-button>
            <el-button round type="danger" @click="handleRevoke(state.code, getDetails)"
                >撤销本上报
            </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-6 gap-4 mb-[2.4rem]">
            <descriptions-item label="订单签收地">{{ details.orderAddress }}</descriptions-item>
            <descriptions-item label="订单地址坐标">
                {{ `${details?.orderLongitude},${details?.orderLatitude}` ?? '--' }}
            </descriptions-item>
            <descriptions-item label="签收店名">
                {{ details?.order?.customer?.customerName ?? '--' }}
            </descriptions-item>
            <descriptions-item label="注册人名">
                {{ details?.order?.customer?.contactPerson ?? '--' }}
            </descriptions-item>
        </div>
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">同店多脸信息</div>
            <div class="flex">
                <Table
                    :data="details?.details?.multiFaceInfo"
                    :showPage="false"
                    border
                    style="width: 100%"
                >
                    <el-table-column label="人脸">
                        <template #default="{ row }">
                            <el-image
                                style="width: 50px; height: 50px"
                                :src="`${row.image}?${Date.now()}`"
                                fit="cover"
                                :preview-src-list="
                                    details?.details.multiFaceInfo.map(
                                        (item) => `${item.image}?${Date.now()}`
                                    )
                                "
                                :append-to-body="true"
                                :preview-teleported="true"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="人名" />
                    <el-table-column prop="probability" label="概率">
                        <template #default="{ row }">
                            概率
                            {{
                                `${(
                                    (row?.cnt /
                                        details?.details?.multiFaceInfo.reduce(
                                            (total, obj) => total + obj.cnt,
                                            0
                                        )) *
                                    100
                                ).toFixed(2)}%`
                            }}
                            （{{ row?.cnt ?? 0 }}次）
                        </template>
                    </el-table-column>
                    <el-table-column prop="label" label="备注" />
                </Table>
            </div>
        </div>
        <el-divider />
        <!-- 订单信息 -->
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">订单信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-8">
                <descriptions-item label="订单编号">{{
                    details?.order?.orderSn ?? '--'
                }}</descriptions-item>
                <descriptions-item label="用户名称">{{
                    details?.order?.customer?.contactPerson ?? '--'
                }}</descriptions-item>
                <descriptions-item label="店名">{{
                    details?.order?.customer?.customerName ?? '--'
                }}</descriptions-item>
                <descriptions-item label="签收地址">{{
                    details?.orderAddress ?? '--'
                }}</descriptions-item>
                <descriptions-item label="品种数">{{
                    details?.order?.skuCount ?? '--'
                }}</descriptions-item>
                <descriptions-item label="总盒数">{{
                    details?.order?.quantity ?? '--'
                }}</descriptions-item>
                <descriptions-item label="总金额（元）"
                    >￥{{ details?.order?.amount ?? '--' }}</descriptions-item
                >
            </div>
        </div>
        <el-divider />
        <!-- 运输信息 -->
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">运输信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-8">
                <descriptions-item label="运输单号">{{
                    details?.shippingOrder?.shippingSn ?? '--'
                }}</descriptions-item>
                <descriptions-item label="运输日期">{{
                    details?.shippingOrder?.shippingDate ?? '--'
                }}</descriptions-item>
                <descriptions-item label="车辆牌照">{{
                    details?.shippingOrder?.licensePlate ?? '--'
                }}</descriptions-item>
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
import { abnormalOrderStatus } from '@/utils/enum'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const { handleRevoke } = useExceptionMonitoringManagement()

const route = useRoute()
const state = reactive({
        code: '', // 异常上报编号
        remark: '测试备注',
        logDialogVisible: false, // 日志弹窗
        remarkDialogVisible: false, // 备注弹窗
        forwardDialogVisible: false, // 转发弹窗
        resultDialogVisible: false, // 处理结果弹窗
    }),
    details = reactive({})

onMounted(async () => {
    state.code = route.params.id
    await getDetails()
})

// 获取详情
const getDetails = async () => {
    const { data } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/${state.code}`)
    data.details = JSON.parse(data.details)
    Object.assign(details, data)
    console.log('details:', details)
}
</script>
