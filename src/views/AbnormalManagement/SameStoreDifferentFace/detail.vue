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
            <el-button round type="danger">撤销本上报</el-button>
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
                <Table :data=" details?.details?.multiFaceInfo" :showPage="false" border style="width: 100%">
                    <el-table-column label="人脸">
                        <template #default="{ row }">
                            <el-image
                                style="width: 50px; height: 50px"
                                :src="row.image"
                                fit="cover"
                                :preview-src-list="[row.image]"
                                :append-to-body="true"
                                :preview-teleported="true"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="人名" />
                    <el-table-column prop="probability" label="概率" />
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
                <descriptions-item label="购方姓名">{{
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
                    details?.shippingOrder?.vehicleCode ?? '--'
                }}</descriptions-item>
                <descriptions-item label="运输人">{{
                    details?.shippingOrder?.deliveryPersonCode ?? '--'
                }}</descriptions-item>
                <descriptions-item label="驾驶证号">{{
                    details?.shippingOrder?.driver?.driverLicense ?? '--'
                }}</descriptions-item>
                <descriptions-item label="配送人">{{
                    details?.shippingOrder?.deliveryPersonCode ?? '--'
                }}</descriptions-item>
                <descriptions-item label="身份证号"
                    >{{ details?.shippingOrder?.deliveryPerson?.idCard ?? '--' }}
                </descriptions-item>
            </div>
        </div>
    </div>
    <Dialog width="600px" v-model="state.logDialogVisible" title="处理日志" center>
        <div
            class="w-[calc(536px - 3.2rem)] bg-[rgba(232,239,247,0.5)] rounded-md flex flex-col mx-auto px-[1.6rem] py-[1.6rem] mb-8"
            v-for="(item, index) in 3"
            :key="index"
        >
            <div class="mb-[1.6rem]">
                <label>日期时间：</label>
                <span>2021-08-09 12:00:00</span>
            </div>
            <div class="mb-[1.6rem]">
                <label>处理操作：</label>
                <span>转发下一级</span>
            </div>
            <div class="mb-[1.6rem]">
                <label>处理内容：</label>
                <span>-</span>
            </div>
            <div>
                <label>操作人：</label>
                <span>-</span>
            </div>
        </div>
    </Dialog>
    <Dialog v-model="state.mapDialogVisible" title="签收地偏差查看">
        <div class="w-full h-[600px]" ref="mapRef"></div>
    </Dialog>
    <Dialog v-model="state.remarkDialogVisible" title="编辑备注" center :showButton="true">
        <el-input
            v-model="state.remark"
            :autosize="{ minRows: 4, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
        />

        <template #footer>
            <el-button class="w-[100px]" @click="state.remarkDialogVisible = false">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="state.remarkDialogVisible = false"
                >确定
            </el-button>
        </template>
    </Dialog>
    <!-- 处理结果填报 -->
    <Dialog v-model="state.resultDialogVisible" title="处理结果填报" center>
        <el-input
            v-model="state.remark"
            :autosize="{ minRows: 4, maxRows: 4 }"
            type="textarea"
            placeholder="请输入处理结果"
        />
        <template #footer>
            <el-button class="w-[100px]" @click="state.resultDialogVisible = false">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="state.resultDialogVisible = false"
                >确定
            </el-button>
        </template>
    </Dialog>
    <Dialog center v-model="state.forwardDialogVisible" title="转发下一级" width="600px">
        <div class="px-4">
            <el-input class="mb-6" v-model="input2" :suffix-icon="Search" />
            <div class="flex mb-6">
                <label class="mr-4">已选:</label>
                <div>
                    <el-tag
                        v-for="tag in 3"
                        :key="tag"
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                        style="margin-right: 10px"
                        >张珊珊</el-tag
                    >
                </div>
            </div>
            <el-tree
                class="mb-6"
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps"
            />
            <div class="flex items-center">
                <label class="mr-4 text-xl flex items-center mr-auto"
                    >多人审批时选择审批方式
                    <el-icon color="#FA9F16" size="16"><QuestionFilled /></el-icon
                ></label>
                <el-radio-group v-model="radio">
                    <el-radio :label="3">指定单签</el-radio>
                    <el-radio :label="6">会签</el-radio>
                    <el-radio :label="9">或签</el-radio>
                </el-radio-group>
            </div>
        </div>
        <template #footer>
            <el-button class="w-[100px]" @click="state.forwardDialogVisible = false"
                >取消</el-button
            >
            <el-button type="primary" class="w-[100px]" @click="state.forwardDialogVisible = false"
                >确定
            </el-button>
        </template>
    </Dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderStatus } from '@/utils/enum'
import { QuestionFilled, Search } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const state = reactive({
        code: '', // 异常上报编号
        remark: '测试备注',
        logDialogVisible: false, // 日志弹窗
        mapDialogVisible: false, // 地图弹窗
        remarkDialogVisible: false, // 备注弹窗
        forwardDialogVisible: false, // 转发弹窗
        resultDialogVisible: false, // 处理结果弹窗
    }),
    details = reactive({})

const defaultProps = {
    children: 'children',
    label: 'label',
}

const data = [
    {
        id: 1,
        label: 'Level one 1',
        children: [
            {
                id: 4,
                label: 'Level two 1-1',
                children: [
                    {
                        id: 9,
                        label: 'Level three 1-1-1',
                    },
                    {
                        id: 10,
                        label: 'Level three 1-1-2',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        label: 'Level one 2',
        children: [
            {
                id: 5,
                label: 'Level two 2-1',
            },
            {
                id: 6,
                label: 'Level two 2-2',
            },
        ],
    },
    {
        id: 3,
        label: 'Level one 3',
        children: [
            {
                id: 7,
                label: 'Level two 3-1',
            },
            {
                id: 8,
                label: 'Level two 3-2',
            },
        ],
    },
]

const tableData = [
    {
        id: '12987122',
        name: 'Tom',
        amount1: '234',
        amount2: '3.2',
        amount3: 10,
    },
    {
        id: '12987123',
        name: 'Tom',
        amount1: '165',
        amount2: '4.43',
        amount3: 12,
    },
    {
        id: '12987124',
        name: 'Tom',
        amount1: '324',
        amount2: '1.9',
        amount3: 9,
    },
    {
        id: '12987125',
        name: 'Tom',
        amount1: '621',
        amount2: '2.2',
        amount3: 17,
    },
    {
        id: '12987126',
        name: 'Tom',
        amount1: '539',
        amount2: '4.1',
        amount3: 15,
    },
]

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
