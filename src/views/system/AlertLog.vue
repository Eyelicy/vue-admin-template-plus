el-date-picker
<template>
    <div class="w-full h-full flex flex-col p-12">
        <div class="">
            <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
                <div class="table-header">
                    <div class="table-header-lab">所属机构</div>
                    <el-input />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">所属部门</div>
                    <el-input />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">预警类型</div>
                    <el-select v-model="query.type" @change="getTableData(true)" clearable>
                        <template v-for="(item, key) in jnqFunc">
                            <el-option
                                v-if="Number(key) !== 0"
                                :key="key"
                                :label="item"
                                :value="Number(key)"
                            />
                        </template>
                    </el-select>
                </div>
                <div class="table-header">
                    <div class="table-header-lab">患者姓名</div>
                    <el-input v-model="query.patient_name" @change="getTableData(true)" />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">设备DN</div>
                    <el-input v-model="query.device_name" @change="getTableData(true)" />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">发生时间</div>
                    <el-date-picker
                        value-format="YYYY-MM-DD"
                        v-model="query.occur_time"
                        type="date"
                        :shortcuts="shortcuts"
                        @change="getTableData(true)"
                    />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">处理时间</div>
                    <el-date-picker
                        value-format="YYYY-MM-DD"
                        v-model="query.handle_time"
                        type="date"
                        :shortcuts="shortcuts"
                        @change="getTableData(true)"
                    />
                </div>
                <div class="table-header">
                    <div class="table-header-lab">操作用户</div>
                    <el-input />
                </div>
            </TableHead>
        </div>
        <div class="flex-auto">
            <Table
                v-model:page="page"
                v-loading="loading"
                :data="tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="id" label="ID" width="100px" />
                <el-table-column prop="info" label="预警名称" />
                <el-table-column prop="patient.patient_name" label="患者姓名" />
                <el-table-column prop="iot_id" min-width="160" label="设备ID" />
                <el-table-column prop="corporation_name" label="所属机构" />
                <el-table-column prop="department_name" label="所属部门" />
                <el-table-column prop="staff_name" label="操作用户" />
                <el-table-column prop="createtime_text" label="发生时间" />
                <el-table-column prop="handletime_text" label="处理时间">
                    <template #default="{ row: { handletime_text }, row }">
                        {{ handletime_text ? handletime_text : '--' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #default="{ row: { handletime_text, id } }">
                        <el-popconfirm
                            @confirm="handleWarningLog(id)"
                            title="请确认是否处理"
                            v-if="!handletime_text"
                        >
                            <template #reference>
                                <el-button>处理复位 </el-button>
                            </template>
                        </el-popconfirm>
                        <el-button v-else disabled> 已处理 </el-button>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
</template>

<script setup>
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { getDeviceWarningLogListApi, handleWarningLogApi } from '@/server/device'
import { jnqFunc, shortcuts } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const loading = ref(true),
    tableData = ref([]),
    query = ref({}),
    page = reactive({
        index: 1,
        size: 10,
        total: 0,
    })

const getTableData = async (init) => {
    loading.value = true
    if (init) {
        page.index = 1
    }
    let params = {
        page: page.index,
        limit: page.size,
        ...query.value,
    }
    try {
        const {
            data: { total, data },
        } = await getDeviceWarningLogListApi(params)
        tableData.value = data
        page.total = total
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const handleWarningLog = async (id) => {
    const { code, msg } = await handleWarningLogApi({ id })
    if (code === 200) {
        ElMessage.success('处理完成')
    } else {
        ElMessage.error(msg)
    }
    await getTableData()
}

getTableData()
</script>

<style lang="scss" scoped></style>
