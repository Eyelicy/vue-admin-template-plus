<style lang="scss" scoped></style>

<template>
    <el-select
        v-bind="$attrs"
        filterable
        remote
        reserve-keyword
        remote-show-suffix
        :remote-method="remoteMethod"
        :loading="state.loading"
    >
        <el-option
            v-for="(item,index) in state.lineList"
            :key="index"
            :label="item.name"
            :value="item.name"
        />
    </el-select>
</template>

<script setup>
import { tobaccoApi } from '@/server/api/tobacco.js'
import qs from 'qs'
import { onMounted, reactive, useAttrs } from 'vue'

const attrs = useAttrs()

const state = reactive({
    loading: false,
    lineList: [],
})

const remoteMethod = async (query) => {
    // console.log(query);
    // if (query) {
    //     state.loading = true

    // }
    const params = {
        name: query,
    }
    try {
        state.loading = true
        const {
            data: { rows },
        } = await tobaccoApi('get', `/api/v1/tobacco/unifiedSigningPoint/list?${qs.stringify(params)}`)
        state.lineList = rows
    } catch (error) {
        state.lineList = []
    } finally {
        state.loading = false
    }
}

const getLineList = async () => {
    try {
        const {
            data: { rows },
        } = await tobaccoApi('get', '/api/v1/tobacco/unifiedSigningPoint/list')
        state.lineList = rows
    } catch (error) {
        console.log(error)
    }
}

onMounted(async () => {
    await getLineList()
})
</script>
