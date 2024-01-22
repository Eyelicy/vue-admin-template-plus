<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
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
                <p>{{ configuration.updateBy ?? '--' }}</p>
            </div>
            <el-button round class="ml-auto" @click="handleShowLog">查看日志 </el-button>
            <el-button round type="danger" @click="handleDelete">删除 </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-4 gap-4 mb-[5.6rem]">
            <descriptions-item label="送货路线编号 - 送货路线名称"
                >{{ configuration?.deliveryRoute?.routeCode }} -
                {{ configuration?.deliveryRoute?.routeName }}</descriptions-item
            >
            <descriptions-item label="同店异脸告警数值（大于等于）">
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
    
    <log-dialog
        width="80%"
        v-model="state.logDialogVisible"
        :data="state.exceptionHandlingList"
        center
    >
    </log-dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { ElMessage, ElMessageBox } from 'element-plus'
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
        `/api/v1/tobacco/signingMultiFacesConfig`,
        configuration
    )
    if (code === 200) {
        ElMessage.success('修改成功')
        router.back()
    }
}

onMounted(async () => {
    configuration.id = route.params.id // 获取同店异脸配置id
    await getConfigurationDetail() // 获取同店异脸配置详情
})

// 查看日志
const handleShowLog = async () => {
    state.logDialogVisible = true
    await getLogData()
}

// 获取日志数据
const getLogData = async () => {
    const {
        code,
        data: { rows },
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingMultiFacesConfigHis/list?id=${configuration.id}`
    )
    if (code === 200) {
        state.exceptionHandlingList = rows
    }
}

// 删除同店异脸配置
const handleDelete = async () => {
    try {
        await ElMessageBox.confirm('请确认是否删除该条数据？', 'Warning', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        })
        const { code } = await tobaccoApi(
            'delete',
            `/api/v1/tobacco/signingMultiFacesConfig/${configuration.id}`
        )
        if (code === 200) {
            ElMessage.success('删除成功')
            router.back()
        }
    } catch (error) {
        console.log(error)
    }
}

// 获取同店异脸配置详情
const getConfigurationDetail = async () => {
    const { data, code } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingMultiFacesConfig/${configuration.id}`
    )
    if (code === 200) {
        Object.assign(configuration, data)
    }
}
</script>
