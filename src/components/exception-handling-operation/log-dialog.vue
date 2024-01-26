<style lang="scss">
.my-dialog {
    border-radius: 8px;

    .el-dialog__header {
        padding: 0;
        margin-right: 0;
        border-bottom: 1px solid #eeeeee;
    }

    .my-header {
        padding: 20px 32px;
        @apply flex items-center justify-between;
    }

    .my-header-title {
        @apply text-2xl font-medium;
        color: #303133;
    }
}
</style>

<template>
    <el-dialog class="my-dialog" v-bind="$attrs" :show-close="false" @close="close">
        <template #header>
            <div class="my-header zIndex30">
                <p class="my-header-title">处理日志</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div>
            <Table :data="data" :show-page="false">
                <el-table-column prop="operation" label="类型"></el-table-column>
                <el-table-column prop="detail" label="处理详情"></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column prop="handler_username" label="处理者"></el-table-column>
            </Table>
        </div>
        <template #footer>
            <el-button @click="close" class="w-[100px]">返回</el-button>
        </template>
    </el-dialog>
</template>

<script setup name="log-dialog">
import Table from '@/components/table/index.vue'
import { Close } from '@element-plus/icons-vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
})

const close = () => {
    emits('update:modelValue', false)
}
</script>
