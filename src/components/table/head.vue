<template>
    <div class="w-full flex flex-col items-center table-header-content">
        <div class="w-full grid grid-cols-4 gap-4 mb-12">
            <slot></slot>
        </div>
        <div class="flex justify-center mb-12">
            <el-button class="mr-6" @click="handleSearch()" type="primary">查询</el-button>
            <el-button class="mr-6" @click="handleReset()" type="primary">重置</el-button>
            <el-button @click="handleExport()" type="primary">导出</el-button>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
const props = defineProps({
    modelValue: {
        type: Object,
    },
})

const emit = defineEmits(['onSearch', 'onReset', 'onExport', 'update:modelValue'])

const handleSearch = async () => {
    emit('onSearch')
}

const handleReset = async () => {
    // let emptyObj = Object.assign({}, props.modelValue)
    // for (let key of Object.keys(emptyObj)) {
    //     emptyObj[key] = ''
    // }
    let obj = props.modelValue
    Object.keys(obj).forEach((keys) => {
        obj[keys] = ''
    })
    emit('update:modelValue', obj)
    emit('onReset')
}

const handleExport = async () => {
    emit('onExport')
}
</script>

<style lang="scss" scoped>
// :deep(.table-header-content) {
//     position: sticky;
//     top: 0;
// }
// .table-header-content {
//     position: sticky;
//     top: 0;
//     z-index: 999;
//     background-color: #fff;
// }
</style>
