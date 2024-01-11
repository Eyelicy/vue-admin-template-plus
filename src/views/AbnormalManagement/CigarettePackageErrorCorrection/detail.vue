<style lang="scss" scoped>
.cigarette-pack {
    .header {
        @apply w-full;
    }
}
</style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <div class="flex items-center mb-16">
            <div class="w-[160px] flex items-center">
                <p class="text-title">烟包纠错数</p>
                <span class="ml-auto text-primary text-2xl font-bold">4</span>
                <p class="text-title">个</p>
            </div>
            <el-button round class="mx-8">处理中</el-button>
            <div class="flex mr-8">
                <p class="text-title">异常上报编号:</p>
                <p>20210809123456789</p>
            </div>
            <div class="flex">
                <p class="text-title">上报时间:</p>
                <p>20210809123456789</p>
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
        <div class="w-full px-16 grid grid-cols-6 gap-4 mb-12">
            <descriptions-item label="订单签收地">新百地下500米</descriptions-item>
            <descriptions-item label="订单地址坐标">123,123</descriptions-item>
            <descriptions-item label="签收店名">小武不抽烟店</descriptions-item>
            <descriptions-item label="注册人名">要甜菜一碗</descriptions-item>
        </div>
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">烟包信息</div>
            <div class="mb-8 w-full flex">
                <div class="flex-auto flex">
                    <img src="" alt="" srcset="" style="width: 50%; height: 400px" />
                    <img src="" alt="" srcset="" style="width: 50%; height: 400px" />
                </div>
                <div class="flex-auto">
                    <div class="cigarette-pack">
                        <div class="header flex">
                            <div class="right mr-auto">品牌规格</div>
                            <div class="left">识别数量/订单数量</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="flex">
                <Table :data="tableData" :showPage="false" border style="width: 100%">
                    <el-table-column prop="id" label="店名" width="180" />
                    <el-table-column prop="name" label="时间" />
                    <el-table-column prop="amount1" label="订单号" />
                    <el-table-column prop="amount2" label="购方姓名" />
                    <el-table-column prop="amount3" label="订单盒数" />
                    <el-table-column prop="amount3" label="订单金额" />
                    <el-table-column label="图片">
                        <template #default="{ row }">
                            <el-image
                                style="width: 50px; height: 50px"
                                :src="getImageUrl('avatar.png')"
                                fit="cover"
                                :preview-src-list="[getImageUrl('avatar.png')]"
                            />
                        </template>
                    </el-table-column>
                </Table>
            </div> -->
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">订单信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-8">
                <descriptions-item label="订单编号">123</descriptions-item>
                <descriptions-item label="购方姓名">要咸鱼一条</descriptions-item>
                <descriptions-item label="店名">著行为只抽烟店</descriptions-item>
                <descriptions-item label="签收地址">321,321</descriptions-item>
                <descriptions-item label="品种数">24</descriptions-item>
                <descriptions-item label="总盒数">124</descriptions-item>
                <descriptions-item label="总金额（元）">24800￥</descriptions-item>
            </div>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">运输信息</div>
            <div class="grid grid-cols-6 gap-4 gap-y-8">
                <descriptions-item label="运输单号">123</descriptions-item>
                <descriptions-item label="运输日期">10.24</descriptions-item>
                <descriptions-item label="车辆牌照">苏A·123121</descriptions-item>
                <descriptions-item label="运输人">要酸菜一坛</descriptions-item>
                <descriptions-item label="驾驶证号">1231231</descriptions-item>
                <descriptions-item label="配送人">要榨菜一包</descriptions-item>
                <descriptions-item label="身份证号">321183199805041414</descriptions-item>
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
import { getImageUrl } from '@/utils/index'
import AMapLoader from '@amap/amap-jsapi-loader'
import { QuestionFilled, Search } from '@element-plus/icons-vue'
import { nextTick, reactive, ref } from 'vue'

const state = reactive({
        map: null,
        remark: '测试备注',
        logDialogVisible: false, // 日志弹窗
        mapDialogVisible: false, // 地图弹窗
        remarkDialogVisible: false, // 备注弹窗
        forwardDialogVisible: false, // 转发弹窗
        resultDialogVisible: false, // 处理结果弹窗
    }),
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
            [116.362209, 39.887487],
            [116.422897, 39.878002],
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
            strokeWeight: 1,
            strokeStyle: 'dashed',
            strokeDasharray: [10, 5],
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
            var distance = Math.round(p1.distance(p2))
            var path = [p1, p2]
            // line.setPath(path)
            text.setText('偏差距离' + distance + '米')
            text.setPosition(textPos)
        }
        computeDis(startMarker, endMarker)
        // state.map.setFitView()
    } catch (error) {
        console.log('map', error)
    }
}
</script>
