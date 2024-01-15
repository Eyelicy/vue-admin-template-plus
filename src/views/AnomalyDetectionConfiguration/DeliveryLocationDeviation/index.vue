import { pushScopeId } from 'vue'; import { routerKey } from 'vue-router';
<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col p-12">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">送货路线</div>
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
                <div class="table-header-lab">包含客户</div>
                <el-input v-model="query.register_name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">包含集中签收点</div>
                <el-input v-model="query.error_num" clearable> </el-input>
            </div>
        </TableHead>
        <div class="flex-auto flex flex-col">
            <el-button class="mb-8" type="primary" style="width: 100px" :icon="Plus"
                >新增配置
            </el-button>
            <Table
                class="flex-auto"
                ref="table"
                v-model:page="page"
                v-loading="state.loading"
                :data="state.tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="abnormal_code" label="送货路线编号"> </el-table-column>
                <el-table-column prop="status" label="送货路线名称"> </el-table-column>
                <el-table-column prop="register_name" label="集中签收点个数" />
                <el-table-column prop="order_code" label="容许偏差距离（米/m）" />
                <el-table-column prop="order_code" label="是否支持集中签收" />
                <el-table-column prop="order_code" label="更新时间" />
                <el-table-column prop="order_code" label="更新者" />
                <el-table-column prop="order_code" label="启用状态">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280px">
                    <template #default="scope">
                        <el-button
                            @click="
                                router.push({
                                    path: `/anomaly-detection-configuration/delivery-location-deviation/edit/${1}`,
                                })
                            "
                            >编辑</el-button
                        >
                        <el-button @click="state.logDialogVisible = true">日志</el-button>
                        <el-popconfirm
                            title="请确认是否删除该条数据？"
                            @confirm="handleDelete(scope.row)"
                        >
                            <template #reference>
                                <el-button>删除 </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
    <Dialog width="600px" v-model="state.logDialogVisible" title="操作日志" center>
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
            <div>
                <label>操作人：</label>
                <span>-</span>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { MoreFilled, Plus } from '@element-plus/icons-vue'
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

const handleDelete = (row) => {
    state.tableData.splice(state.tableData.indexOf(row), 1)
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
