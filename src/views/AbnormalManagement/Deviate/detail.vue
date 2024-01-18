<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12 detail" v-loading="state.loading">
        <div class="flex items-center mb-[5.6rem]">
            <div class="w-[120px] flex flex-col">
                <div class="flex mb-4">
                    <p class="text-title">偏差距离</p>
                    <span class="ml-auto text-primary text-2xl font-bold">{{
                        details?.details?.deviation ?? '--'
                    }}</span>
                    <p class="text-title">米</p>
                </div>
                <el-button @click="handleMapDialogVisible">地图模式</el-button>
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
        <div class="w-full px-16 grid grid-cols-6 gap-4">
            <descriptions-item label="订单签收地">{{ details.orderAddress }}</descriptions-item>
            <descriptions-item label="订单地址坐标">
                {{ `${details?.orderLongitude},${details?.orderLatitude}` ?? '--' }}
            </descriptions-item>
            <descriptions-item label="实际签收地">{{
                details?.details?.address ?? '--'
            }}</descriptions-item>
            <descriptions-item label="实际地址坐标">
                {{ `${details?.details?.longitude},${details?.details?.latitude}` ?? '--' }}
            </descriptions-item>
            <descriptions-item label="签收店名">
                {{ details?.order?.customer?.customerName ?? '--' }}
            </descriptions-item>
            <descriptions-item label="注册人名">
                {{ details?.order?.customer?.contactPerson ?? '--' }}
            </descriptions-item>
        </div>
        <el-divider />
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
    <!-- 签收地偏差查看 -->
    <Dialog v-model="state.mapDialogVisible" title="签收地偏差查看">
        <div class="w-full h-[600px]" ref="mapRef"></div>
    </Dialog>
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
    <!-- <Dialog v-model="state.resultDialogVisible" title="处理结果填报" center>
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
    </Dialog> -->
    <!-- 转发下一级 -->
    <!-- <Dialog center v-model="state.forwardDialogVisible" title="转发下一级" width="600px">
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
    </Dialog> -->
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { tobaccoApi } from '@/server/api/tobacco'
import { abnormalOrderStatus } from '@/utils/enum'
import { getImageUrl } from '@/utils/index'
import AMapLoader from '@amap/amap-jsapi-loader'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

// const { logDialogVisible, remarkDialogVisible, remark } = useExceptionMonitoringManagement()
const { handleRevoke } = useExceptionMonitoringManagement()
const route = useRoute()
const state = reactive({
        loading: false,
        code: '', // 异常上报编号
        map: null,
        mapDialogVisible: false, // 地图弹窗
        logDialogVisible: false, // 处理日志弹窗
        remarkDialogVisible: false, // 备注弹窗
    }),
    details = reactive({}),
    mapRef = ref(null) // 地图容器

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

onMounted(async () => {
    state.loading = true
    state.code = route.params.id
    await getDetails()
    state.loading = false
})

// const handleRemark = async () => {
//     state.remarkDialogVisible = await remark(details)
// }

const getDetails = async () => {
    const { data } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/${state.code}`)
    data.details = JSON.parse(data.details)
    Object.assign(details, data)
}

const handleMapDialogVisible = async () => {
    state.mapDialogVisible = true
    await initMap()
}

const initMap = async () => {
    await nextTick()
    try {
        const AMap = await AMapLoader.load({
            key: '536f8f9c0f3cd71f799cba67901c571f',
            version: '2.0',
            plugins: ['AMap.Geolocation', 'AMap.Geocoder'],
        })
        state.map = new AMap.Map(mapRef.value, {
            center: [116.395577, 39.892257],
            zoom: 12,
        })
        const path = [
            [details.details.longitude, details.details.latitude],
            [details.orderLongitude, details.orderLatitude],
        ]
        const startIcon = new AMap.Icon({
            size: new AMap.Size(136, 24),
            image: getImageUrl('map-point-left.png'),
            imageSize: new AMap.Size(136, 24),
            imageOffset: new AMap.Pixel(0, 0),
        })

        const startMarker = new AMap.Marker({
            position: new AMap.LngLat(path[0][0], path[0][1]), //位置
            icon: startIcon,
            offset: new AMap.Pixel(-130, -12),
        })
        const endIcon = new AMap.Icon({
            size: new AMap.Size(136, 24),
            image: getImageUrl('map-point-right.png'),
            imageSize: new AMap.Size(136, 24),
            imageOffset: new AMap.Pixel(0, 0),
        })
        const endMarker = new AMap.Marker({
            position: new AMap.LngLat(path[1][0], path[1][1]), //位置
            icon: endIcon,
            offset: new AMap.Pixel(0, -12),
        })
        const polyline = new AMap.Polyline({
            path: path,
            isOutline: false,
            strokeColor: '#303133',
            strokeOpacity: 1,
            strokeWeight: 2,
            strokeStyle: 'dashed',
            strokeDasharray: [5, 3],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        })
        state.map.add([startMarker, polyline, endMarker])
        const text = new AMap.Text({
            text: '',
            className: 'text',
            style: {
                width: '120px',
                height: '28px',
                'background-color': 'rgba(0,0,0,0.8)',
                'font-size': '12px',
                'border-radius': ' 20px',
                color: '#fff',
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center',
            },
        })
        text.setMap(state.map)

        const computeDis = (m1, m2) => {
            var p1 = m1.getPosition()
            var p2 = m2.getPosition()
            var textPos = p1.divideBy(2).add(p2.divideBy(2))
            // var distance = Math.round(p1.distance(p2))
            var path = [p1, p2]
            // line.setPath(path)
            text.setText('偏差距离' + details?.details?.deviation + '米')
            text.setPosition(textPos)
        }
        computeDis(startMarker, endMarker)
        state.map.setFitView()
    } catch (error) {
        console.log('map', error)
    }
}
</script>
