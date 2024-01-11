<template>
    <span>
        <span class="text-label mr-4">{{ label }}</span>
        <span class="text-value">{{ value }}</span>
    </span>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: null,
    },
    value: {
        type: String,
        default: null,
    },
})
</script>

<style lang="scss" scoped>
.text-value {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}
</style>
