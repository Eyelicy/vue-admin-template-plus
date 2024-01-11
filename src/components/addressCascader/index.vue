<template>
    <el-cascader class="w-full" :props="cascaderProps" clearable @change="onChange" />
</template>

<script setup>
import { getAreaListApi } from '@/server/index';
import { defineEmits } from 'vue';

const emit = defineEmits(['update:id', 'update:code'])

let id = 0
const cascaderProps = {
    emitPath: false,
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level } = node
        let info = {
            pid: node?.value?.id,
        }
        const { data } = await getAreaListApi(info)
        const nodes = []
        for (const key in data) {
            nodes.push({
                value: { id: data[key].id, code: data[key].area_code },
                label: data[key].name,
                leaf: level >= 2,
            })
        }
        resolve(nodes)
    },
}

const onChange = (value) => {
    const { id, code } = value
    emit('update:id', id)
    emit('update:code', Number(code))
}
</script>

<style lang="scss" scoped></style>
