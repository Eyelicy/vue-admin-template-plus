<style lang="scss" scoped>
.el-link + .copy-document {
    margin-left: 8px;
    line-height: 23px;
}

.order-info-popover + .copy-document {
    margin-left: 8px;
}
</style>

<template>
    <el-icon v-if="val" class="cursor-pointer copy-document text-xl" @click="copyTextToClipboard(val)"
        ><CopyDocument
    /></el-icon>
</template>

<script setup>
import { copyTextToClipboard } from '@/utils/index';
import { CopyDocument } from '@element-plus/icons-vue';

const props = defineProps({
    val: {
        type: String,
        default: '',
    },
})
</script>
