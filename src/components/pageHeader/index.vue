<template>
    <div class="page-header">
        <span class="title">{{ title }}</span>
        <el-button type="primary" :icon="ArrowLeft" @click="router.go(-1)">返回</el-button>
    </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter()
defineProps({
    title: {
        type: String,
    },
})
</script>

<style lang="scss" scoped>
.page-header {
    padding: 0 32px;
    height: 80px;
    border-bottom: 1px solid #ebeef5;
    @apply w-full flex mb-12 justify-between items-center;

    .title {
        font-size: 18px;
        font-weight: 500;
        color: #303133;
    }
}
</style>
