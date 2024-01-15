<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">异常预警时间</div>
                <el-date-picker
                    v-model="query.start_time"
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
                    v-model="query.end_time"
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
            <div class="table-header">
                <div class="table-header-lab">异常类型</div>
                <el-select v-model="query.status" placeholder="请选择状态" clearable>
                    <el-option
                        v-for="item in state.statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
            <div class="table-header">
                <div class="table-header-lab">客户名称</div>
                <el-input v-model="query.register_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">客户预警等级</div>
                <el-input v-model="query.error_num" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单编号</div>
                <el-input v-model="query.order_code" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输编号</div>
                <el-input v-model="query.shop_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">派送员</div>
                <el-input v-model="query.buyer_name" clearable> </el-input>
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
                <el-table-column prop="abnormal_code" label="异常预警时间"> </el-table-column>
                <el-table-column prop="status" label="异常类型">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? '正常' : '异常' }}
                    </template>
                </el-table-column>
                <el-table-column prop="register_name" label="订单编号" />
                <el-table-column prop="order_code" label="客户名称" />
                <el-table-column prop="order_code" label="签收地址" />
                <el-table-column prop="order_code" label="品种数" />
                <el-table-column prop="order_code" label="总盒数" />
                <el-table-column prop="order_code" label="总金额（元）" />
                <el-table-column label="操作" width="380px">
                    <template #default="scope">
                        <el-button @click="handleLog(scope.row)">处理日志</el-button>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>

    <Dialog width="600px" v-model="state.logDialogVisible" title="风险预警等级变化日志" center>
        <el-timeline>
            <el-timeline-item
                v-for="(activity, index) in state.activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :hollow="activity.hollow"
                :timestamp="activity.timestamp"
            >
                {{ activity.content }}
            </el-timeline-item>
        </el-timeline>
    </Dialog>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue'
import Dialog from '@/components/dialog/index.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter(),
    state = reactive({
        loading: false,
        logDialogVisible: false,
        tableData: [
            {
                abnormal_code: '123',
                status: 1,
                register_name: '张三',
                order_code: '123',
            },
        ],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
        activities: [
            {
                content: 'Custom icon',
                timestamp: '2018-04-12 20:46',
                size: 'large',
                type: 'primary',
                icon: MoreFilled,
            },
            {
                content: 'Custom color',
                timestamp: '2018-04-03 20:46',
                color: '#0bbd87',
            },
            {
                content: 'Custom size',
                timestamp: '2018-04-03 20:46',
                size: 'large',
            },
            {
                content: 'Custom hollow',
                timestamp: '2018-04-03 20:46',
                type: 'primary',
                hollow: true,
            },
            {
                content: 'Default node',
                timestamp: '2018-04-03 20:46',
            },
        ],
    }),
    query = reactive({
        abnormal_code: '',
    }),
    processLog = reactive({
        tableData: [],
    }),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    // await getTableData(true)
})

const handleLog = (row) => {
    state.logDialogVisible = true
}

const getTableData = async (init) => {
    state.loading = true
    if (init) {
        page.index = 1
    }

    let params = {
        page: page.index,
        limit: page.size,
        ...query,
    }
    try {
        const {
            data: { data, total },
        } = await tobaccoApi('', params)
        state.tableData = data
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
