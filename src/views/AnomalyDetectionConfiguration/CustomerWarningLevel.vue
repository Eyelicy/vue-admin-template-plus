<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">异常签收预警配置</div>
            <div class="grid grid-cols-4 gap-4 gap-y-8">
                <descriptions-item :label="item.name" v-for="item in state.defaultWarningLevelData">
                    <el-input-number v-model="item.threshold" class="w-[220px]" />
                </descriptions-item>
            </div>
            <el-button type="primary" class="w-[100px] mt-8" @click="handleSaveDefaultWarningLevel"
                >保存
            </el-button>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">异常客户自定义分类管理</div>
            <div class="flex flex-wrap items-center">
                <el-tag
                    v-for="tag in state.warningLevelData"
                    :key="tag.id"
                    type="success"
                    class="mr-12"
                    effect="dark"
                    closable
                    @close="handleDeleteWarningLevel(tag)"
                    >{{ tag.name }}
                </el-tag>
                <el-button
                    type="primary"
                    plain
                    class="text-primary"
                    color="#569DED"
                    :icon="Plus"
                    @click="classification.dialogVisible = true"
                    >增加分类标记
                    
                </el-button>
            </div>
        </div>
    </div>
    <Dialog width="600px" v-model="classification.dialogVisible" title="新增分类标记" center>
        <el-input v-model="classification.inputValue" placeholder="请输入分类名称" />
        <template #footer>
            <el-button class="w-[100px]" @click="classification.dialogVisible = false"
                >取消</el-button
            >
            <el-button type="primary" class="w-[100px]" @click="handleAddWarningLevel"
                >确定</el-button
            >
        </template>
    </Dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive } from 'vue'

const state = reactive({
        defaultWarningLevelData: [],
        warningLevelData: [],
    }),
    classification = reactive({
        dialogVisible: false,
        inputValue: '',
    })

onMounted(async () => {
    await getDefaultWarningLevel()
    await getWarningLevel()
})

const handleAddWarningLevel = async () => {
    if (!classification.inputValue) {
        ElMessage.error('请输入分类名称')
        return
    }
    const { code } = await tobaccoApi('post', `/api/v1/tobacco/customerAlertLevel`, {
        name: classification.inputValue,
        isDefault: false,
        sort: 0,
    })
    if (code === 200) {
        classification.inputValue = ''
        ElMessage.success('新增成功')
        await getWarningLevel()
    }
    classification.dialogVisible = false
}

const handleDeleteWarningLevel = async(tag) => {
    const {code} = await tobaccoApi('delete', `/api/v1/tobacco/customerAlertLevel/${tag.id}`)
    if (code === 200) {
        ElMessage.success('删除成功')
        await getWarningLevel()
    }
}

const handleSaveDefaultWarningLevel = async () => {
    let totalIndex = 0
    for (let index = 0; index < state.defaultWarningLevelData.length; index++) {
        const element = state.defaultWarningLevelData[index]
        const { code } = await tobaccoApi('put', `/api/v1/tobacco/customerAlertLevel`, element)
        if (code === 200) {
            totalIndex++
        }
    }
    if (totalIndex === state.defaultWarningLevelData.length) {
        ElMessage.success('保存成功')
    }
    totalIndex = 0
}

const getDefaultWarningLevel = async () => {
    const params = {
        isDefault: true,
        orderByColumn: 'sort',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/customerAlertLevel/list?${qs.stringify(params)}`)
    if (code === 200) {
        state.defaultWarningLevelData = rows
    }
}

const getWarningLevel = async () => {
    const params = {
        isDefault: false,
        orderByColumn: 'sort',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/customerAlertLevel/list?${qs.stringify(params)}`)
    if (code === 200) {
        state.warningLevelData = rows
    }
}
</script>
