<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">异常上报编号</div>
                <el-input v-model="query.abnormal_code" placeholder="请输入异常上报编号" clearable>
                </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">状态</div>
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
                <div class="table-header-lab">异常上报时间</div>
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
                <div class="table-header-lab">注册人名</div>
                <el-input v-model="query.register_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">烟包纠错数 ≤</div>
                <el-input v-model="query.error_num" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单编号</div>
                <el-input v-model="query.order_code" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">店名关键词</div>
                <el-input v-model="query.shop_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">购方关键词</div>
                <el-input v-model="query.buyer_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">订单总金额 ≤</div>
                <el-input v-model="query.order_amount" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输单号</div>
                <el-input v-model="query.transport_code" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输日期</div>
                <el-date-picker
                    v-model="query.transport_start_time"
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
                <el-input v-model="query.license_plate" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">运输人</div>
                <el-input v-model="query.transport_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">配送人</div>
                <el-input v-model="query.distribution_name" clearable> </el-input>
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
                <!-- 
                异常上报编号    
                状态
                异常上报时间
                签收店名
                注册人名
                烟包纠错信息
                订单签收地
                订单地址坐标
                订单编号
                运输单号
                操作:备注 转发 结果 撤销 日志-->
                <el-table-column prop="abnormal_code" label="异常上报编号">
                    <template #default="scope">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="
                                router.push({ path: `Deviate/Detail/${scope.row.abnormal_code}` })
                            "
                            >{{ scope.row.abnormal_code }}</el-link
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? '正常' : '异常' }}
                    </template>
                </el-table-column>
                <el-table-column prop="register_name" label="异常上报时间" />
                <el-table-column prop="order_code" label="签收店名" />
                <el-table-column prop="order_code" label="注册人名" />
                <el-table-column prop="order_code" label="烟包纠错信息" />
                <el-table-column prop="order_code" label="订单签收地" />
                <el-table-column prop="order_code" label="订单地址坐标" />
                <el-table-column prop="order_code" label="订单编号" />
                <el-table-column prop="order_code" label="运输单号" />
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
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { reactive, onMounted } from 'vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { useRouter } from 'vue-router'

const router = useRouter(),
    state = reactive({
        loading: false,
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
    }),
    query = reactive({
        abnormal_code: '',
    }),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    // await getTableData(true)
})

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
