<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">客户基础信息</div>
            <div class="grid grid-cols-4 gap-4 gap-y-8">
                <descriptions-item label="客户名称">要油条一根</descriptions-item>
                <descriptions-item label="风险预警等级">
                    <el-tag type="warning" class="mr-12" effect="dark">高风险</el-tag>
                    <el-button type="danger" plain>重置</el-button>
                </descriptions-item>
                <descriptions-item label="签收地址">著行为只抽烟店</descriptions-item>
                <descriptions-item label="注册人名">要香油一勺</descriptions-item>
                <descriptions-item label="所属路线编号/路线名">南京南 - 大行宫</descriptions-item>
                <descriptions-item label="所属服务站点">大行宫从不服务站点</descriptions-item>
                <descriptions-item label="关联派送员">要键盘一把</descriptions-item>
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
        <el-divider />
        <div class="w-full px-16 flex-auto">
            <div class="box-title text-title text-2xl">异常订单信息</div>
            <Table :data="state.tableData" :show-page="false">
                <el-table-column prop="abnormal_code" label="异常预警时间"> </el-table-column>
                <el-table-column prop="status" label="异常类型">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? '正常' : '异常' }}
                    </template>
                </el-table-column>
                <el-table-column prop="register_name" label="订单编号" />
                <el-table-column prop="order_code" label="客户名称" />
                <el-table-column prop="order_code" label="签收地址" />
                <el-table-column prop="order_code" label="品种数" />
                <el-table-column prop="order_code" label="总盒数" />
                <el-table-column prop="order_code" label="总金额（元）" />
            </Table>
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
                abnormal_code:'2021-08-12 12:00:00',
            },
            {
                abnormal_code:'2021-08-12 12:00:00',
            },
            {
                abnormal_code:'2021-08-12 12:00:00',
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
