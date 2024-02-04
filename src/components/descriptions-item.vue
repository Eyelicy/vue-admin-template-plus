<style lang="scss" scoped></style>

<template>
    <div>
        <div class="text-xl text-help mb-4">{{ label }}</div>
        <div class="text-xl text-title flex items-center">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: '',
    },
})
</script>
