<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">异常签收预警配置</div>
            <div class="grid grid-cols-4 gap-4 gap-y-8">
                <descriptions-item label="黄标客户（三级预警）">
                    <el-input v-model="state.value" class="w-[220px]"></el-input>
                </descriptions-item>
                <descriptions-item label="黑标客户（二级预警）">
                    <el-input v-model="state.value1" class="w-[220px]"></el-input>
                </descriptions-item>
                <descriptions-item label="红标客户（一级预警）">
                    <el-input v-model="state.value2" class="w-[220px]"></el-input
                ></descriptions-item>
            </div>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">自定义分类</div>
            <div class="grid grid-cols-12 gap-4 gap-y-8 items-center">
                <el-tag
                    v-for="tag in classification.dynamicTags"
                    type="success"
                    class="mr-12"
                    effect="dark"
                    closable
                    @close="handleCloseTag(tag)"
                    >{{ tag }}
                </el-tag>
                <el-button
                    type="primary"
                    plain
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
            <el-button type="primary" class="w-[100px]" @click="handleAddTag">确定</el-button>
        </template>
    </Dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import { Plus } from '@element-plus/icons-vue'
import { reactive } from 'vue'

const state = reactive({
        tableData: [
            {
                abnormal_code: '2021-08-12 12:00:00',
            },
            {
                abnormal_code: '2021-08-12 12:00:00',
            },
            {
                abnormal_code: '2021-08-12 12:00:00',
            },
        ],
    }),
    classification = reactive({
        dynamicTags: ['标签一', '标签二', '标签三'],
        dialogVisible: false,
        inputValue: '',
    })

const handleCloseTag = (tag) => {
    classification.dynamicTags.splice(classification.dynamicTags.indexOf(tag), 1)
}

const handleAddTag = () => {
    classification.dynamicTags.push(classification.inputValue)
    classification.inputValue = ''
    classification.dialogVisible = false
}
</script>
