el-date-picker
<template>
    <div class="w-full h-full flex flex-col">
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
                    <el-select
                        v-model="query.staff_guid"
                        placeholder=""
                        clearable
                        @change="getTableData(true)"
                    >
                        <el-option
                            v-for="item in staffs"
                            :key="item.guid"
                            :label="item.staff_name"
                            :value="item.guid"
                        />
                    </el-select>
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
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="action_name" label="操作类型" />
                <el-table-column prop="relate_id" label="关联操作ID" />
                <el-table-column prop="info" label="操作信息摘要" />
                <!-- <el-table-column prop="result" label="操作结果" /> -->
                <el-table-column prop="corporation_name" label="所属机构" />
                <el-table-column prop="department_name" label="所属部门" />
                <el-table-column prop="staff_name" label="操作用户" />
                <el-table-column prop="createtime_text" label="操作时间" />
                <el-table-column label="操作" width="120">
                    <template #default="{ row: { result } }">
                        <el-button @click="showResultDialog(result)">查看详情</el-button>
                    </template>
                </el-table-column>
            </Table>
        </div>
    </div>
    <Dialog width="40%" v-model="resultDialog" :title="deviceLogTitle" :show-button="false">
        <pre style="height: 500px; overflow-y: auto; white-space: pre-wrap"
            >{{ result }}
        </pre>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { getDeviceActionLogListApi } from '@/server/device'
import { useUserStore } from '@/store/user'
import { jnqFunc, shortcuts } from '@/utils/enum'
import { reactive, ref } from 'vue'

const { staffs } = useUserStore()

const loading = ref(true),
    tableData = ref([]),
    query = ref({}),
    resultDialog = ref(false),
    result = ref({}),
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
        } = await getDeviceActionLogListApi(params)
        tableData.value = data
        page.total = total
    } catch (error) {
        tableData.value = []
        page.index = 1
        page.total = 0
    }
    loading.value = false
}

const showResultDialog = async (res) => {
    resultDialog.value = true
    // console.log(res.trim())
    res.toString().trim()
    result.value = res
    // const { code, msg } = await getDeviceActionLogListApi({ id })
    // if (code === 200) {
    //     ElMessage.success('处理完成')
    // } else {
    //     ElMessage.error(msg)
    // }
    // await getTableData()
}

getTableData()
</script>

<style lang="scss" scoped></style>
