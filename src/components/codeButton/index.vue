<template>
    <el-button :disabled="disabled" type="primary" size="large" @click="onClick" :loading="loading">
        {{ msg }}
    </el-button>
</template>

<script setup>
import { useMsgCode } from '@/composables/useMsgCode'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
    countTime: {
        default: 60,
    },
})

const emit = defineEmits(['onClick'])

const onClick = async (event) => {
    countdown()
    emit('onClick')
}

const { disabled, countdown, msg, loading } = useMsgCode()
</script>

<style lang="scss" scoped></style>
