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
    <el-dialog class="my-dialog" v-bind="$attrs" center :show-close="false" @close="close">
        <template #header>
            <div class="my-header zIndex30">
                <p class="my-header-title">备注</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div>
            <el-input
                v-model="state.remark"
                :autosize="{ minRows: 4, maxRows: 4 }"
                type="textarea"
                placeholder="请输入备注"
            />
        </div>
        <template #footer>
            <el-button class="w-[100px]" @click="close">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="confirm">确定 </el-button>
        </template>
    </el-dialog>
</template>

<script setup name="remark-dialog">
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { Close } from '@element-plus/icons-vue'
import { reactive, useAttrs } from 'vue'

const { handleRemark } = useExceptionMonitoringManagement()

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue', 'confirm'])

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    exceptionCode: {
        type: String,
        default: '',
    },
})

const state = reactive({
    remark: '',
})

const close = () => {
    emits('update:modelValue', false)
}

const confirm = async () => {
    await handleRemark(props.exceptionCode, state.remark)
    state.remark = ''
    emits('update:modelValue', false)
    emits('confirm')
}
</script>
