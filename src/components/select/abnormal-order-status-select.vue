<style lang="scss" scoped></style>

<template>
    <el-select v-bind="$attrs">
        <el-option
            v-for="(item, key) in abnormalOrderStatus"
            :key="key"
            :label="item"
            :value="key"
        />
    </el-select>
</template>

<script setup>
import { abnormalOrderStatus } from '@/utils/enum';
import { useAttrs } from 'vue';

const attrs = useAttrs()
</script>
