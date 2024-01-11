<template>
    <!-- <div class="w-full h-full">
        <Table
            v-model:page="page"
            v-loading="loading"
            :data="tableData"
            @getTableData="getTableData"
        >
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="device_name" label="设备名称" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="msg" label="详情">
                <template #default="{ row }"> {{ row.msg }}</template>
            </el-table-column>
            <el-table-column prop="create_time_text" label="记录时间" />
        </Table>
    </div> -->

    <div class="w-full h-full flex flex-col p-12">
        <div>
            <Table
                v-model:page="page"
                v-loading="loading"
                :data="tableData"
                @getTableData="getTableData"
            >
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="iot_id" label="设备ID"  width="200" />
                <el-table-column prop="device_name" width="120" label="设备名称" />
                <el-table-column prop="type" label="类型" width="100" />
                <el-table-column prop="product_key" label="产品标识" width="100" />
                <el-table-column prop="msg" label="详情">
                    <template #default="{ row }"> {{ row.msg }}</template>
                </el-table-column>
                <el-table-column prop="create_time_text" width="200" label="记录时间" />
            </Table>
        </div>
    </div>
</template>

<script setup>
import Table from '@/components/table/index.vue';
import { getDeviceLogsApi } from '@/server/system';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(),
    loading = ref(true),
    tableData = ref([]),
    page = reactive({
        index: 1,
        size: 10,
        total: 0,
    }),
    query = ref({}),
    age = ref([0, 0])

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
        } = await getDeviceLogsApi(params)
        tableData.value = data
        page.total = total
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

getTableData(true)
</script>

<style lang="scss" scoped></style>
