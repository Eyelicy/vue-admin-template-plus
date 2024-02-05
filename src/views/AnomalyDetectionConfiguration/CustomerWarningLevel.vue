<style lang="scss" scoped></style>

<template>
    <div class="w-full h-full flex flex-col detail">
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">异常签收预警配置
                <el-popover
                    :width="300"
                    trigger="hover"
                    content="通过设置异常签收累计次数来对应不同预警级别，请注意重置后，将从0开始重新累计"
                    placement="right"
                >
                    <template #reference>
                        <el-icon class="card-icon cursor-pointer" color="#FA9F16" size="16"
                            ><QuestionFilled />
                        </el-icon>
                    </template>
                </el-popover>
            </div>
            <div class="grid grid-cols-4 gap-4 gap-y-8">
                <descriptions-item
                    :label="item.name"
                    v-for="(item, index) in state.defaultWarningLevelData"
                >
                    <template v-if="state.editIndex === index">
                        <el-input-number v-model.number="item.threshold" class="w-[220px]" />
                        <span class="ml-4"> 次</span>

                        <el-button
                            class="ml-4"
                            style="
                                width: 48px;
                                height: 34px;
                                background: rgba(52, 141, 237, 0.1);
                                border-radius: 4px;
                                opacity: 1;
                                border: 1px solid #348ded;
                                font-size: 14px;
                                font-weight: 400;
                                color: #348ded;
                            "
                            @click="handleSaveDefaultWarningLevel"
                            >完成
                        </el-button>
                    </template>
                    <template v-else>
                        <el-input
                            v-model.number="item.threshold"
                            class="input-with-select w-[80px]"
                        >
                        </el-input>
                        <span class="ml-4"> 次数</span>
                        <el-icon
                            class="text-[#348DED] ml-4 cursor-pointer"
                            @click="state.editIndex = index"
                            ><EditPen
                        /></el-icon>
                    </template>
                </descriptions-item>
            </div>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">异常客户自定义分类管理</div>
            <div
                class="flex flex-wrap items-center bg-[#F9FAFA] py-[24px] px-[12px] pb-[64px] relative"
                style="border: 1px solid #EEEEEE;"
            >
                <el-tag
                    v-for="tag in state.warningLevelData"
                    :key="tag.id"
                    type="success"
                    class="mr-12 mb-6 text-[14px] h-[32px] leading-[32px]"
                    effect="dark"
                    closable
                    @close="handleDeleteWarningLevel(tag)"
                    >{{ tag.name }}
                </el-tag>
                <el-button
                    type="primary"
                    plain
                    class="w-[200px] absolute m-auto bottom-[16px] right-0 left-0"
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
import { EditPen, Plus, QuestionFilled } from '@element-plus/icons-vue'
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

const handleDeleteWarningLevel = async (tag) => {
    const { code } = await tobaccoApi('delete', `/api/v1/tobacco/customerAlertLevel/${tag.id}`)
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
    state.editIndex = ''
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
