<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col detail">
        <div class="flex items-center mb-[5.6rem]">
            <div class="flex mr-12">
                <p class="text-title">创建时间：</p>
                <p>{{ configuration.createTime ?? '--' }}</p>
            </div>
            <div class="flex mr-12">
                <p class="text-title">更新时间：</p>
                <p>{{ configuration.updateTime ?? '--' }}</p>
            </div>
            <div class="flex">
                <p class="text-title">更新者：</p>
                <p>{{ configuration.updateBy_username ?? '--' }}</p>
            </div>
            <el-button round class="ml-auto" @click="handleShowLog"> 查看日志 </el-button>
            <el-button round type="danger" @click="handleDelete">删除 </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-4 gap-4 mb-[5.6rem]">
            <descriptions-item label="送货路线编号 - 送货路线名称"
                >{{ configuration?.deliveryRoute?.routeCode }} -
                {{ configuration?.deliveryRoute?.routeName }}</descriptions-item
            >
            <descriptions-item label="同脸异地告警数值（大于等于）">
                <el-input-number v-model="configuration.threshold" class="w-[120px]" />
            </descriptions-item>
            <descriptions-item label="订单统计周期（小于等于/天）">
                <el-input-number v-model="configuration.period" class="w-[120px]" />
            </descriptions-item>
        </div>
        <div class="w-full flex justify-center">
            <el-button round class="w-[120px] mr-12" @click="router.back()">返回</el-button>
            <el-button round type="primary" class="w-[120px]" @click="handleSave">保存</el-button>
        </div>
    </div>
    <!-- 操作日志弹窗 -->
    <Dialog width="80%" v-model="state.logDialogVisible" title="处理日志" center>
        <div>
            <Table :data="state.exceptionHandlingList" :show-page="false">
                <el-table-column
                    prop="threshold"
                    label="同脸异地告警数值（大于等于）"
                ></el-table-column>
                <el-table-column
                    prop="period"
                    label="订单统计周期（小于等于/天）"
                ></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column prop="createBy_username" label="处理者"></el-table-column>
            </Table>
        </div>
    </Dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(),
    router = useRouter()

const state = reactive({
        map: null,
        remark: '测试备注',
        logDialogVisible: false, // 处理日志弹窗
        tableData: [],
    }),
    configuration = reactive({
        id: '',
    })

const handleSave = async () => {
    const { code } = await tobaccoApi(
        'put',
        `/api/v1/tobacco/signingMultiLocationsConfig`,
        configuration
    )
    if (code === 200) {
        ElMessage.success('修改成功')
        router.back()
    }
}

onMounted(async () => {
    configuration.id = route.params.id // 获取同脸异地配置id
    await getConfigurationDetail() // 获取同脸异地配置详情
})

// 查看日志
const handleShowLog = async () => {
    state.logDialogVisible = true
    await getLogData()
}

// 获取日志数据
const getLogData = async () => {
    let params = {
        id: configuration.id,
        orderByColumn: 'createTime',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingMultiLocationsConfigHis/list?${qs.stringify(params)}`
    )
    if (code === 200) {
        state.exceptionHandlingList = rows
    }
}

// 删除签收地偏离配置
const handleDelete = async () => {
    try {
        await ElMessageBox.confirm('请确认是否删除该条数据？', 'Warning', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        })
        const { code } = await tobaccoApi(
            'delete',
            `/api/v1/tobacco/signingMultiLocationsConfig/${configuration.id}`
        )
        if (code === 200) {
            ElMessage.success('删除成功')
            router.back()
        }
    } catch (error) {
        console.log(error)
    }
}

// 获取同脸异地配置详情
const getConfigurationDetail = async () => {
    const { data, code } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingMultiLocationsConfig/${configuration.id}`
    )
    if (code === 200) {
        Object.assign(configuration, data)
    }
}
</script>
