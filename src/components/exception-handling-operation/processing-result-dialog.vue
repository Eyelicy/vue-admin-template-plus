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
                <p class="my-header-title">处理结果</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div>
            <el-input
                v-model="state.result"
                @change="change"
                :autosize="{ minRows: 4, maxRows: 4 }"
                type="textarea"
                placeholder="请输入处理结果"
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

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue', 'update:result', 'confirm'])

const { handleResult } = useExceptionMonitoringManagement()

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
    result: '',
})

const change = (val) => {
    state.result = val
    emits('update:result', val)
}

const close = () => {
    emits('update:modelValue', false)
}

const confirm = async () => {
    await handleResult(props.exceptionCode, state.result)
    emits('update:modelValue', false)
    emits('confirm')
}
</script>
