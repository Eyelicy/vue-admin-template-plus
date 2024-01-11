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
    <el-dialog class="my-dialog" v-bind="$attrs" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header zIndex30">
                <p class="my-header-title">{{ title }}</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <slot> </slot>
        <template #footer="scope" v-if="showButton">
            <slot name="footer" v-bind="scope"></slot>
        </template>
    </el-dialog>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue';
import { defineProps, useAttrs } from 'vue';

const attrs = useAttrs()

const props = defineProps({
    showButton: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        default: '',
    },
})
</script>
