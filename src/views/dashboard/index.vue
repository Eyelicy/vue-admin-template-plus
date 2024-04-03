<style lang="scss" scoped>
:deep(.scrollbar-div) {
    .el-button--primary:focus {
        color: var(--el-color-white);
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary);
        outline: 0;
    }

    .el-button--primary:hover {
        color: var(--el-color-white);
        border-color: var(--el-color-primary-light-3);
        background-color: var(--el-color-primary-light-3);
        outline: 0;
    }

    .el-button.is-plain:focus {
        color: var(--el-button-text-color);
        border-color: var(--el-button-border-color);
    }

    .el-button.is-plain:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }

    .el-button.is-link:focus {
        color: var(--el-button-text-color);
    }

    .el-button.is-link:hover {
        color: var(--el-button-hover-link-text-color);
    }

    .el-button--primary.is-link:hover,
    .el-button--primary.is-plain:hover,
    .el-button--primary.is-text:hover {
        color: var(--el-color-primary-light-5);
        background-color: var(--el-color-primary-light-9) !important;
    }
}

.scrollbar-div::-webkit-scrollbar {
    position: absolute;
    right: 0px;
}

.abnormal-content {
    @apply w-full flex flex-wrap;

    .card {
        width: 180px;
        height: 120px;
        margin-right: 55px;
        background: linear-gradient(180deg, #fdfbfb 0%, #eff7ff 100%);
        box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        border: 1px solid #e8eff7;
        position: relative;

        @apply flex flex-col justify-center items-center;

        p:first-child {
            @apply text-title text-xl mb-8;
        }

        p:nth-child(2) {
            @apply text-title text-3xl font-bold;
        }

        .card-icon {
            position: absolute;
            right: 8px;
            top: 8px;
            cursor: pointer;
        }
    }
}

.chart-box {
    @apply w-full flex flex-col;

    .chart-box-header {
        @apply w-full flex items-center mb-8;
    }
}
</style>

<template>
    <div class="w-full h-full flex flex-col overflow-y-auto scrollbar-div">
        <p class="text-title font-bold text-[24px] mb-12">{{ state.currentTime }}</p>

        <!-- 异常监控实时消息 start -->
        <div class="box-title text-primary text-[18px]">异常监控实时消息</div>
        <div class="grid grid-cols-2 gap-8 text-test-black text-[14px]">
            <!-- 签收地偏离 -->
            <div class="bg-white rounded-md p-[1.6rem] ml-1" style="box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.08)">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xl">签收地偏离</span>
                    <span class="text-[1.4rem] text-primary cursor-pointer" @click="
            router.push(
                '/exception-monitoring-management/delivery-location-deviation'
            )
            ">全部
                    </span>
                </div>
                <template v-for="(item, index) in realTimeNews.deliveryLocationDeviation">
                    <div class="flex py-2 items-center bg-sky-100/50" :class="index < 4 ? 'mb-[0.8rem]' : ''">
                        <span class="text-primary flex-shrink-0 mr-4  truncate">【{{ item?.address }}】</span>
                        <!-- <Vue3Marquee
                            class="cursor-pointer h-[24px]"
                            :pause-on-hover="true"
                            :clone="true"
                            :duration="50"
                        >
                           
                        </Vue3Marquee> -->
                        <span class="cursor-pointer h-[24px]">
                            【{{ item?.order?.customer?.customerName }}】 签收地偏离
                            <span class="text-primary">
                                {{ JSON.parse(item?.details)?.deviation?.toFixed(2) }} </span>米
                        </span>
                        <span class="ml-auto flex-shrink-0 text-[#999999]">{{
            item.createTime
        }}</span>
                        <el-button class="mx-4 w-[48px]" style="
                                border: 1px solid #348ded;
                                background-color: #fff;
                                color: #348ded;
                            " @click="
        router.push({
            path: `/exception-monitoring-management/delivery-location-deviation/detail/${item.code}`,
        })
            ">详情</el-button>
                    </div>
                </template>
            </div>
            <!-- 同脸异地 -->
            <div class="bg-white rounded-md p-[1.6rem] ml-1" style="box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.08)">
                <div class="mb-4 flex justify-between items-center">
                    <span class="text-xl">同脸异地</span>
                    <span class="text-[1.4rem] text-primary cursor-pointer" @click="
            router.push(
                '/exception-monitoring-management/same-face-different-places'
            )
            ">全部</span>
                </div>

                <template v-for="(item, index) in realTimeNews.sameFaceDifferentPlaces">
                    <div class="flex py-2 items-center bg-sky-100/50" :class="index < 4 ? 'mb-[0.8rem]' : ''">
                        <span class="text-primary flex-shrink-0 mr-4  truncate">【{{ item?.address }}】
                        </span>
                        <Vue3Marquee class="cursor-pointer" :pause-on-hover="true" :clone="true" :duration="80">
                            <template class="h-[24px]" v-for="(item, index) in JSON.parse(item?.details)?.locationSet">
                                &nbsp;&nbsp;
                                {{ item.customerName }}
                                {{ item.signingTime }}
                                签收
                            </template>
                        </Vue3Marquee>
                        <!-- <div class="flex flex-auto whitespace-nowrap overflow-hidden">
                            <template
                                class="h-[24px]"
                                v-for="(item, index) in JSON.parse(item?.details)?.locationSet"
                                >{{ item.customerName }} {{ item.signingTime }}签收
                            </template>
                        </div> -->
                        <span class="flex-shrink-0 ml-[16px] text-[#999999]">{{
            item.createTime
        }}</span>
                        <el-button class="mx-4 w-[48px] flex-shrink-0" style="
                                border: 1px solid #348ded;
                                background-color: #fff;
                                color: #348ded;
                            " @click="
        router.push({
            path: `/exception-monitoring-management/same-face-different-places/detail/${item.code}`,
        })
            ">详情</el-button>
                    </div>
                </template>
            </div>
            <!-- 同店异脸 -->
            <div class="bg-white rounded-md p-[1.6rem] ml-1" style="box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.08)">
                <div class="mb-4 flex justify-between items-center">
                    <span class="text-xl">同店异脸</span>
                    <span class="text-[1.4rem] text-primary cursor-pointer" @click="
            router.push(
                '/exception-monitoring-management/same-store-different-faces'
            )
            ">全部</span>
                </div>

                <template v-for="(item, index) in realTimeNews.sameStoreDifferentFaces">
                    <div class="flex py-2 items-center bg-sky-100/50" :class="index < 4 ? 'mb-[0.8rem]' : ''">
                        <span class="text-primary flex-shrink-0 mr-4  truncate">【{{ item?.address }}】</span>
                        <span>【{{ item?.order?.customer?.customerName }}】</span>
                        <span>累计共
                            <span class="text-primary">{{ item?.faces }} </span>
                            张脸数</span>
                        <!-- <span>{{ item?.signingInfo?.createTime }}签收 </span> -->
                        <span class="ml-auto text-[#999999]">{{ item.createTime }}</span>
                        <el-button class="mx-4 w-[48px] flex-shrink-0" style="
                                border: 1px solid #348ded;
                                background-color: #fff;
                                color: #348ded;
                            " @click="
            router.push({
                path: `/exception-monitoring-management/same-store-different-faces/detail/${item.code}`,
            })
            ">详情</el-button>
                    </div>
                </template>
            </div>
            <!-- <div class="shadow-lg bg-white rounded-md p-[1.6rem]">
                <div lass="mb-4 flex justify-between items-center">
                    <span class="text-xl">烟包纠错</span>
                    <span class="text-[1.4rem] text-primary">全部</span>
                </div>
                <template v-for="(item, index) in 5">
                    <div
                        class="flex py-2 items-center bg-sky-100/50"
                        :class="index < 4 ? 'mb-[0.8rem]' : ''"
                    >
                        <span class="text-blue-400">【xx区】</span>
                        <span>【xx店名】</span>
                        <span>{{ '17:42' }}签收 偏离签收地{{ '10' }}米</span>
                        <span class="ml-auto">{{item.createTime}}</span>
                        <el-button class="mx-4" color="#348DED" plain>详情</el-button>
                    </div>
                </template>
            </div> -->
        </div>
        <!-- 异常监控实时消息 end -->

        <!-- 统计摘要 start -->
        <div class="box-title text-primary text-[18px] mt-12">统计摘要</div>
        <div class="abnormal-content">
            <div class="card">
                <p>今日异常上报</p>
                <p class="text-[#303133]">{{ state?.summaryData?.today_exception_report }}</p>
                <el-popover :width="300" trigger="hover" content="今日累计（从今日0:00开始至当前时刻）所有类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="card">
                <p>昨日异常上报</p>
                <p class="text-[#303133]">{{ state?.summaryData?.yesterday_exception_report }}</p>
                <el-popover :width="300" trigger="hover" content="昨日累计（从昨日0:00开始至昨日23:59）所有类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="card">
                <p>本月异常上报</p>
                <p class="text-[#303133]">{{ state?.summaryData?.this_month_exception_report }}</p>
                <el-popover :width="300" trigger="hover" content="本月累计（从本月1号0:00开始至今日此刻）所有类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="card">
                <p>今日签收地偏离</p>
                <p class="text-[#303133]">{{ state?.summaryData?.today_sign_deviation }}</p>
                <el-popover :width="300" trigger="hover" content="今日累计（从今日0:00开始至当前时刻）所有“签收地偏离”类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="card">
                <p>今日同脸异地</p>
                <p class="text-[#303133]">
                    {{ state?.summaryData?.today_same_face_diff_location }}
                </p>
                <el-popover :width="300" trigger="hover" content="今日累计（从今日0:00开始至当前时刻）所有“同脸异地”类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="card">
                <p>今日同店异脸</p>
                <p class="text-[#303133]">{{ state?.summaryData?.today_same_store_diff_face }}</p>
                <el-popover :width="300" trigger="hover" content="今日累计（从今日0:00开始至当前时刻）所有“同店异脸”类型的异常签收上报数量">

                    <template #reference>
                        <el-icon class="card-icon" color="#FA9F16" size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <!-- <div class="card">
                <p>今日烟包纠错</p>
                <p class="text-[#303133]">12</p>
            </div> -->
        </div>
        <!-- 统计摘要 end -->

        <!-- 异常上报趋势统计 start -->
        <div class="box-title text-primary text-[18px] mt-12">异常上报趋势统计</div>
        <div class="chart-box">
            <div class="chart-box-header">
                <div class="mr-4">起止日期范围</div>
                <el-date-picker v-model="exceptionReporting.startDate" type="date" unlink-panels style="width: 300px"
                    value-format="YYYY-MM-DD" />
                <div class="mx-4">至</div>
                <el-date-picker v-model="exceptionReporting.endDate" type="date" unlink-panels style="width: 300px"
                    class="mr-4" value-format="YYYY-MM-DD" />
                <el-button type="primary" @click="getExceptionReportingTrend">查询</el-button>
                <el-button type="primary" class="mr-auto"
                    @click="setEchartTimeToThisMonth('exceptionReporting')">重置</el-button>
                <el-button type="primary" plain round class="w-[120px]"
                    @click="setEchartTimeToThisMonth('exceptionReporting')">本月</el-button>
                <el-button type="primary" plain round class="w-[120px]"
                    @click="setEchartTimeToNearlyThirtyDays('exceptionReporting')">近30天</el-button>
                <el-button v-if="exceptionReporting.type === 'line'" type="primary" round class="w-[120px]"
                    :icon="PieChart" @click="; (exceptionReporting.type = 'pie'), initExceptionReportingChart()">看饼图
                </el-button>
                <el-button v-else type="primary" round class="w-[120px]" :icon="TrendCharts"
                    @click="; (exceptionReporting.type = 'line'), initExceptionReportingChart()">看线图</el-button>
            </div>
            <div ref="exceptionReportingChartRef" id="exceptionReportingChartRef" class="w-full"></div>
        </div>
        <!-- 异常上报趋势统计 end -->

        <!-- 异常上报趋势统计 start -->
        <div class="box-title text-primary text-[18px] mt-12">异常签收客户统计</div>
        <div class="chart-box">
            <div class="chart-box-header">
                <div class="mr-4">起止日期范围</div>
                <el-date-picker v-model="exceptionalDelivery.startDate" type="date" unlink-panels style="width: 300px"
                    value-format="YYYY-MM-DD" />
                <div class="mx-4">至</div>
                <el-date-picker v-model="exceptionalDelivery.endDate" type="date" unlink-panels style="width: 300px"
                    value-format="YYYY-MM-DD" class="mr-4" />
                <el-button type="primary" @click="getExceptionalDelivery">查询</el-button>
                <el-button type="primary" class="mr-auto"
                    @click="setEchartTimeToThisMonth('exceptionalDelivery')">重置</el-button>
                <el-button type="primary" plain round class="w-[120px]"
                    @click="setEchartTimeToThisMonth('exceptionalDelivery')">本月</el-button>
                <el-button type="primary" plain round class="w-[120px]"
                    @click="setEchartTimeToNearlyThirtyDays('exceptionalDelivery')">近30天</el-button>
                <el-button v-if="exceptionalDelivery.type === 'line'" type="primary" round class="w-[120px]"
                    :icon="PieChart" @click="; (exceptionalDelivery.type = 'pie'), initExceptionalDeliveryChart()">看饼图
                </el-button>
                <el-button v-else type="primary" round class="w-[120px]" :icon="TrendCharts"
                    @click="; (exceptionalDelivery.type = 'line'), initExceptionalDeliveryChart()">看线图</el-button>
            </div>
            <div ref="exceptionalDeliveryChartRef" id="exceptionalDeliveryChartRef" class="w-full"></div>
        </div>
        <!-- 异常上报趋势统计 end -->
    </div>
</template>

<script setup>
import { tobaccoApi } from '@/server/api/tobacco';
import { PieChart, QuestionFilled, TrendCharts } from '@element-plus/icons-vue';
import dayjs from 'dayjs'; // 引入中文语言包
import * as echarts from 'echarts';
import qs from 'qs';
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const pattern = /(..市)(.*?市|.*?区|.*?县)/
const state = reactive({
    summaryData: [],
    currentTime: dayjs().format('YYYY年MM月DD日 dddd HH:mm:ss'),
}),
    realTimeNews = reactive({
        deliveryLocationDeviation: [],
        sameFaceDifferentPlaces: [],
        sameStoreDifferentFaces: [],
    }),
    exceptionReporting = reactive({
        chart: null,
        type: 'line',
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        data: [],
    }),
    exceptionReportingChartRef = ref(null), // 异常上报图表实例
    exceptionalDelivery = reactive({
        chart: null,
        type: 'line',
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        data: [],
    }),
    exceptionalDeliveryChartRef = ref(null) // 异常签收客户图表实例

let timer // 定时器变量
let exceptionReportingChart = null, // 异常上报图表实例
    exceptionalDeliveryChart = null // 异常签收客户图表实例

onMounted(async () => {
    // 每秒更新时间
    setInterval(() => {
        timer = state.currentTime = dayjs().format('YYYY年MM月DD日 dddd HH:mm:ss')
    }, 1000)
    await nextTick()
    getDeliveryLocationDeviation()
    getSameFaceDifferentPlaces()
    getSameStoreDifferentFaces()
    getSummaryData()
    getExceptionReportingTrend()
    getExceptionalDelivery()
})

onUnmounted(() => {
    // 销毁定时器
    clearInterval(timer)
})

// 获取签收地偏离数据
const getDeliveryLocationDeviation = async () => {
    const params = {
        pageNum: 1,
        pageSize: 5,
        exceptionType: 'A',
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
    if (code === 200) {
        rows.forEach((item) => {
            item.address = item.signingInfo.address.match(pattern)[0]
        })
        realTimeNews.deliveryLocationDeviation = rows
    }
}

// 获取同脸异地数据
const getSameFaceDifferentPlaces = async () => {
    const params = {
        pageNum: 1,
        pageSize: 5,
        exceptionType: 'C',
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
    if (code === 200) {
        rows.forEach((item) => {
            if (item?.signingInfo?.address?.match(pattern) && item?.signingInfo?.address?.match(pattern)?.length !== 0) {
                const city = item?.signingInfo?.address?.match(pattern)[1]
                const district = item?.signingInfo?.address?.match(pattern)[2] || '';
                console.log(city, district);
                item.address = `${city}${district}`
            }
        })
        realTimeNews.sameFaceDifferentPlaces = rows
    }
}

// 获取同店异脸数据
const getSameStoreDifferentFaces = async () => {
    const params = {
        pageNum: 1,
        pageSize: 5,
        exceptionType: 'B',
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
    if (code === 200) {
        rows.forEach((item) => {
            item.details = JSON.parse(item.details)
            item.faces = item.details.multiFaceInfo.length
            item.address = item.signingInfo.address.match(pattern)[0]
        })
        realTimeNews.sameStoreDifferentFaces = rows
    }
}

// 获取统计摘要数据
const getSummaryData = async () => {
    const { code, data } = await tobaccoApi('get', '/api/v1/tobacco/exceptionInfo/stat/summary')
    if (code === 200) {
        state.summaryData = data
    }
}

// 设置echart时间为本月
const setEchartTimeToThisMonth = (val) => {
    if (val === 'exceptionReporting') {
        exceptionReporting.startDate = dayjs().startOf('month').format('YYYY-MM-DD')
        exceptionReporting.endDate = dayjs().format('YYYY-MM-DD')
        getExceptionReportingTrend()
    } else {
        exceptionalDelivery.startDate = dayjs().startOf('month').format('YYYY-MM-DD')
        exceptionalDelivery.endDate = dayjs().format('YYYY-MM-DD')
        getExceptionalDelivery()
    }
}

// 设置echart时间为近30天
const setEchartTimeToNearlyThirtyDays = (val) => {
    if (val === 'exceptionReporting') {
        exceptionReporting.startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
        exceptionReporting.endDate = dayjs().format('YYYY-MM-DD')
        console.log(exceptionReporting.startDate, exceptionReporting.endDate)
        getExceptionReportingTrend()
    } else {
        exceptionalDelivery.startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
        exceptionalDelivery.endDate = dayjs().format('YYYY-MM-DD')
        getExceptionalDelivery()
    }
}

// 获取异常上报趋势统计数据
const getExceptionReportingTrend = async () => {
    const params = {
        startTime: exceptionReporting.startDate,
        endTime: `${exceptionReporting.endDate} 23:59:59`,
    }
    const { code, data } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/exceptionInfo/stat/trend?${qs.stringify(params)}`
    )
    exceptionReporting.data = data
    await initExceptionReportingChart()
}

// 初始化异常上报图表
const initExceptionReportingChart = () => {
    exceptionReportingChart = echarts.init(exceptionReportingChartRef.value)
    const xAxisData = exceptionReporting.data.map((item) => item.report_date)
    const total_exceptions = exceptionReporting.data.map((item) => item.total_exceptions)
    // 签收地偏离
    const sign_deviation_count = exceptionReporting.data.map((item) => item.sign_deviation_count)
    // 同脸异地
    const same_face_diff_location_count = exceptionReporting.data.map(
        (item) => item.same_face_diff_location_count
    )
    // 同店异脸
    const same_store_diff_face_count = exceptionReporting.data.map(
        (item) => item.same_store_diff_face_count
    )
    const lineOption = {
        legend: {},
        tooltip: {
            show: true,
            trigger: 'axis',
            formatter: (params) => {
                const dataIndex = params[0].dataIndex
                return `${xAxisData[dataIndex]}
                        <br/>
                        签收地偏离： ${sign_deviation_count[dataIndex]}
                        <br/>
                        同脸异地： ${same_face_diff_location_count[dataIndex]}
                        <br/>
                        同店异脸： ${same_store_diff_face_count[dataIndex]}`
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    color: '#303133',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#303133',
                },
            },
            minInterval: 1,
            min: 0,
        },
        series: [
            {
                name: '异常上报',
                type: exceptionReporting.type,
                data: total_exceptions,
                stack: 'Total',
                itemStyle: {
                    color: '#348DED',
                },
            },
        ],
    }

    setTimeout(() => {
        exceptionReportingChart.resize()
    }, 100)
    exceptionReportingChart.clear()
    if (exceptionReporting.type === 'line') {
        exceptionReportingChartRef.value.style.height = '600px'
        lineOption && exceptionReportingChart.setOption(lineOption)
    } else {
        exceptionReportingChartRef.value.style.height = '760px'
        const cellSize = [180, 120]
        const pieRadius = 45

        const scatterData = exceptionReporting.data.map((item, index) => {
            return [
                echarts.time.format(item.report_date, '{yyyy}-{MM}-{dd}', false),
                item.sign_deviation_count,
                item.same_face_diff_location_count,
                item.same_store_diff_face_count,
            ]
        })
        const pieSeries = scatterData.map((item, index) => {
            return {
                type: 'pie',
                id: 'pie-' + index,
                center: item[0],
                radius: pieRadius,
                coordinateSystem: 'calendar',
                label: {
                    formatter: '{c}',
                    position: 'inside',
                },
                data: [
                    { name: '签收地偏离', value: item[1], itemStyle: { color: '#5A8FF7' } },
                    { name: '同脸异地', value: item[2], itemStyle: { color: '#54DFA7' } },
                    { name: '同店异脸', value: item[3], itemStyle: { color: '#FCBE28' } },
                ],
                itemStyle: {
                    color: '#C2C2C2',
                    normal: {
                        borderColor: '#fff', // 设置边框颜色为白色（或者任意想要的颜色）
                        borderWidth: 0, // 将边框宽度设置为0，即不显示边框
                    },
                },
            }
        })
        const pieOption = {
            tooltip: {},
            legend: {
                data: ['签收地偏离', '同脸异地', '同店异脸'],
                // bottom: 20,
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
            },
            calendar: {
                top: 'middle',
                left: 'center',
                orient: 'vertical',
                cellSize: cellSize,
                yearLabel: {
                    show: false,
                    fontSize: 30,
                },
                calculable: false,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#EEEEEE',
                },
                splitLine: {
                    show: false,
                },
                dayLabel: {
                    margin: 20,
                    firstDay: 1,
                    nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    backgroundColor: 'rgba(240,242,245,0.8)',
                    width: 180,
                    height: 40,
                    lineHeight: 40,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                monthLabel: {
                    show: false,
                },
                range: [xAxisData[0], xAxisData[xAxisData.length - 1]],
            },
            series: [
                {
                    id: 'label',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 0,
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.time.format(params.value[0], '{dd}', false)
                        },
                        offset: [-cellSize[0] / 2 + 20, -cellSize[1] / 2 + 20],
                        fontSize: 26,
                        lineHeight: 26,
                        color: '#C2C2C2',
                    },
                    data: scatterData,
                },
                ...pieSeries,
            ],
        }
        pieOption && exceptionReportingChart.setOption(pieOption)
    }
}

// 获取异常签收客户数据
const getExceptionalDelivery = async () => {
    const params = {
        startTime: exceptionalDelivery.startDate,
        endTime: `${exceptionalDelivery.endDate} 23:59:59`,
    }
    const { code, data } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/exceptionInfo/stat/customerTrend?${qs.stringify(params)}`
    )
    exceptionalDelivery.data = data
    await initExceptionalDeliveryChart()
}

// 初始化异常签收客户图表
const initExceptionalDeliveryChart = () => {
    exceptionalDeliveryChart = echarts.init(exceptionalDeliveryChartRef.value)
    const xAxisData = exceptionalDelivery.data.map((item) => item.report_date)
    // 一级预警
    const first_level_count = exceptionalDelivery.data.map((item) => {
        return item['1']
    })
    // 二级预警
    const second_level_count = exceptionalDelivery.data.map((item) => {
        return item['2']
    })
    // 三级预警
    const third_level_count = exceptionalDelivery.data.map((item) => {
        return item['3']
    })
    const lineOption = {
        legend: {},
        tooltip: {
            show: true,
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    color: '#303133',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#303133',
                },
            },
            minInterval: 1,
            min: 0,
        },
        series: [
            {
                name: '一级预警',
                type: exceptionalDelivery.type,
                data: first_level_count,
                itemStyle: {
                    color: '#f34628',
                },
            },
            {
                name: '二级预警',
                type: exceptionalDelivery.type,
                data: second_level_count,
                itemStyle: {
                    color: '#303133',
                },
            },
            {
                name: '三级预警',
                type: exceptionalDelivery.type,
                data: third_level_count,
                itemStyle: {
                    color: '#feea33',
                },
            },
        ],
    }
    exceptionalDeliveryChart.clear()
    setTimeout(() => {
        exceptionalDeliveryChart.resize()
    }, 100)
    if (exceptionalDelivery.type === 'line') {
        exceptionalDeliveryChartRef.value.style.height = '600px'
        lineOption && exceptionalDeliveryChart.setOption(lineOption)
    } else {
        exceptionalDeliveryChartRef.value.style.height = '760px'
        const cellSize = [180, 120]
        const pieRadius = 45

        const scatterData = exceptionalDelivery.data.map((item, index) => {
            return [
                echarts.time.format(item.report_date, '{yyyy}-{MM}-{dd}', false),
                item[1],
                item[2],
                item[3],
            ]
        })
        const pieSeries = scatterData.map((item, index) => {
            return {
                type: 'pie',
                id: 'pie-' + index,
                center: item[0],
                radius: pieRadius,
                coordinateSystem: 'calendar',
                label: {
                    formatter: '{c}',
                    position: 'inside',
                },
                data: [
                    {
                        name: '一级预警',
                        value: item[1],
                        itemStyle: {
                            color: '#f34628',
                        },
                    },
                    {
                        name: '二级预警',
                        value: item[2],
                        itemStyle: {
                            color: '#303133',
                        },
                    },
                    {
                        name: '三级预警',
                        value: item[3],
                        itemStyle: {
                            color: '#feea33',
                        },
                    },
                ],
            }
        })
        const pieOption = {
            tooltip: {},
            legend: {
                data: ['一级预警', '二级预警', '三级预警'],
            },
            calendar: {
                top: 'middle',
                left: 'center',
                orient: 'vertical',
                cellSize: cellSize,
                yearLabel: {
                    show: false,
                    fontSize: 30,
                },
                splitLine: {
                    show: false,
                },
                dayLabel: {
                    margin: 20,
                    firstDay: 1,
                    nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    backgroundColor: 'rgba(240,242,245,0.8)',
                    width: 180,
                    height: 40,
                    lineHeight: 40,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                monthLabel: {
                    show: false,
                },
                range: [xAxisData[0], xAxisData[xAxisData.length - 1]],
            },
            series: [
                {
                    id: 'label',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 0,
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.time.format(params.value[0], '{dd}', false)
                        },
                        offset: [-cellSize[0] / 2 + 20, -cellSize[1] / 2 + 20],
                        fontSize: 26,
                        lineHeight: 26,
                        color: '#C2C2C2',
                    },
                    data: scatterData,
                },
                ...pieSeries,
            ],
        }
        pieOption && exceptionalDeliveryChart.setOption(pieOption)
    }
}
</script>
