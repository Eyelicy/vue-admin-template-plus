<style lang="scss" scoped>
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

        @apply flex flex-col justify-center items-center;

        p:first-child {
            @apply text-title text-xl mb-8;
        }

        p:nth-child(2) {
            @apply text-title text-3xl font-bold;
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
    <div class="w-full h-full flex flex-col p-[3.2rem]">
        <p class="text-title font-bold text-[24px] mb-12">{{ state.currentTime }}</p>
        <div class="box-title text-primary text-[18px]">异常监控实时消息</div>
        <div class="grid grid-cols-2 gap-8 text-test-black">
            <div class="shadow-lg bg-white rounded-md p-[1.6rem]">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xl">签收地偏离</span>
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
                        <span class="ml-auto">2023-10-31</span>
                        <el-button class="mx-4" color="#348DED" plain>详情</el-button>
                    </div>
                </template>
            </div>
            <div class="shadow-lg bg-white rounded-md p-[1.6rem]">
                <div class="mb-4 flex justify-between items-center">
                    <span class="text-xl">同脸异地</span>
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
                        <span class="ml-auto">2023-10-31</span>
                        <el-button class="mx-4" color="#348DED" plain>详情</el-button>
                    </div>
                </template>
            </div>
            <div class="shadow-lg bg-white rounded-md p-[1.6rem]">
                <div class="mb-4 flex justify-between items-center">
                    <span class="text-xl">同店异脸</span>
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
                        <span class="ml-auto">2023-10-31</span>
                        <el-button class="mx-4" color="#348DED" plain>详情</el-button>
                    </div>
                </template>
            </div>
            <div class="shadow-lg bg-white rounded-md p-[1.6rem]">
                <div class="mb-4 flex justify-between items-center">
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
                        <span class="ml-auto">2023-10-31</span>
                        <el-button class="mx-4" color="#348DED" plain>详情</el-button>
                    </div>
                </template>
            </div>
        </div>
        <div class="box-title text-primary text-[18px] mt-12">统计摘要</div>
        <div class="abnormal-content">
            <div class="card">
                <p>今日异常上报</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>昨日异常上报</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>本月异常上报</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>今日签收地偏离</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>今日同脸异地</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>今日同店异脸</p>
                <p class="text-[#303133]">12</p>
            </div>
            <div class="card">
                <p>今日烟包纠错</p>
                <p class="text-[#303133]">12</p>
            </div>
        </div>
        <div class="box-title text-primary text-[18px] mt-12">异常上报趋势统计</div>
        <div class="chart-box">
            <div class="chart-box-header">
                <div class="mr-4">起止日期范围</div>
                <el-date-picker
                    v-model="exceptionReporting.startDate"
                    type="date"
                    unlink-panels
                    style="width: 300px"
                />
                <div class="mx-4">至</div>
                <el-date-picker
                    v-model="exceptionReporting.endDate"
                    type="date"
                    unlink-panels
                    style="width: 300px"
                    class="mr-4"
                />
                <el-button type="primary">查询</el-button>
                <el-button type="primary" class="mr-auto">重置</el-button>
                <el-button type="primary" plain round class="w-[120px]">本月</el-button>
                <el-button type="primary" plain round class="w-[120px]">近30天</el-button>
                <el-button
                    v-if="exceptionReporting.type === 'line'"
                    type="primary"
                    round
                    class="w-[120px]"
                    :icon="PieChart"
                    @click=";(exceptionReporting.type = 'pie'), initExceptionReportingChart()"
                    >看饼图
                </el-button>
                <el-button
                    v-else
                    type="primary"
                    round
                    class="w-[120px]"
                    :icon="TrendCharts"
                    @click=";(exceptionReporting.type = 'line'), initExceptionReportingChart()"
                    >看线图</el-button
                >
            </div>
            <div
                ref="exceptionReportingChart"
                id="exceptionReportingChart"
                class="w-full h-[500px]"
            ></div>
        </div>
        <div class="box-title text-primary text-[18px] mt-12">异常签收客户统计</div>
        <div class="chart-box">
            <div class="chart-box-header">
                <div class="mr-4">起止日期范围</div>
                <el-date-picker
                    v-model="exceptionalDelivery.startDate"
                    type="date"
                    unlink-panels
                    style="width: 300px"
                />
                <div class="mx-4">至</div>
                <el-date-picker
                    v-model="exceptionalDelivery.endDate"
                    type="date"
                    unlink-panels
                    style="width: 300px"
                    class="mr-4"
                />
                <el-button type="primary">查询</el-button>
                <el-button type="primary" class="mr-auto">重置</el-button>
                <el-button type="primary" plain round class="w-[120px]">本月</el-button>
                <el-button type="primary" plain round class="w-[120px]">近30天</el-button>
                <el-button
                    v-if="exceptionalDelivery.type === 'line'"
                    type="primary"
                    round
                    class="w-[120px]"
                    :icon="PieChart"
                    @click=";(exceptionalDelivery.type = 'pie'), initExceptionalDeliveryChart()"
                    >看饼图
                </el-button>
                <el-button
                    v-else
                    type="primary"
                    round
                    class="w-[120px]"
                    :icon="TrendCharts"
                    @click=";(exceptionalDelivery.type = 'line'), initExceptionalDeliveryChart()"
                    >看线图</el-button
                >
            </div>
            <div
                ref="exceptionalDeliveryChart"
                id="exceptionalDeliveryChart"
                class="w-full h-[500px]"
            ></div>
        </div>
    </div>
</template>

<script setup>
import { PieChart, TrendCharts } from '@element-plus/icons-vue';
import dayjs from 'dayjs'; // 引入中文语言包
import * as echarts from 'echarts';
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

dayjs.locale('zh-cn')

const state = reactive({
        currentTime: dayjs().format('YYYY年MM月DD日 dddd HH:mm:ss'),
    }),
    exceptionReporting = reactive({
        chart: null,
        type: 'line',
        startDate: '',
        endDate: '',
    }),
    exceptionReportingChart = ref(null), // 异常上报图表实例
    exceptionalDelivery = reactive({
        chart: null,
        type: 'line',
        startDate: '',
        endDate: '',
    }),
    exceptionalDeliveryChart = ref(null) // 异常签收客户图表实例

let timer // 定时器变量

onMounted(async () => {
    // 每秒更新时间
    setInterval(() => {
        timer = state.currentTime = dayjs().format('YYYY年MM月DD日 dddd HH:mm:ss')
    }, 1000)
    await nextTick()
    await initExceptionReportingChart()
    await initExceptionalDeliveryChart()
})

onUnmounted(() => {
    // 销毁定时器
    clearInterval(timer)
})

// 初始化异常上报图表
const initExceptionReportingChart = () => {
    exceptionReporting.chart = echarts.init(exceptionReportingChart.value)
    const lineOption = {
        // tooltip: {
        //     trigger: 'axis',
        // },
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
            data: ['10-01', '10-02', '10-03', '10-04', '10-05'],
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
        },
        series: [
            {
                name: '异常上报',
                type: exceptionReporting.type,
                data: [10, 12, 11, 8, 2],
                itemStyle: {
                    color: '#348DED',
                },
            },
        ],
    }
    const pieOption = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
    exceptionReporting.chart.clear()
    if (exceptionReporting.type === 'line') {
        lineOption && exceptionReporting.chart.setOption(lineOption)
    } else {
        pieOption && exceptionReporting.chart.setOption(pieOption)
    }
}

// 初始化异常签收客户图表
const initExceptionalDeliveryChart = () => {
    exceptionalDelivery.chart = echarts.init(exceptionalDeliveryChart.value)
    const lineOption = {
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
            data: ['10-01', '10-02', '10-03', '10-04', '10-05'],
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
        },
        series: [
            {
                name: '异常上报',
                type: exceptionalDelivery.type,
                data: [10, 12, 11, 8, 2],
                itemStyle: {
                    color: '#348DED',
                },
            },
        ],
    }
    const pieOption = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }
    exceptionalDelivery.chart.clear()
    if (exceptionalDelivery.type === 'line') {
        lineOption && exceptionalDelivery.chart.setOption(lineOption)
    } else {
        pieOption && exceptionalDelivery.chart.setOption(pieOption)
    }
}
</script>
