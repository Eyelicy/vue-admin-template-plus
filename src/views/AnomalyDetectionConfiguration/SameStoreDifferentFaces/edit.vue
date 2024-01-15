<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="flex items-center mb-[5.6rem]">
            <div class="flex mr-12">
                <p class="text-title">创建时间:</p>
                <p>20210809123456789</p>
            </div>
            <div class="flex mr-12">
                <p class="text-title">更新时间:</p>
                <p>20210809123456789</p>
            </div>
            <div class="flex">
                <p class="text-title">更新者:</p>
                <p>20210809123456789</p>
            </div>
            <el-button round class="ml-auto" @click="state.logDialogVisible = true"
                >查看日志
            </el-button>
            <el-button round type="danger">删除 </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-4 gap-4 mb-[5.6rem]">
            <descriptions-item label="送货路线编号 - 送货路线名称"
                >123213123 - 新百地下500米</descriptions-item
            >
            <descriptions-item label="同店异脸告警数值（大于等于）">
                <el-input v-model="detail.input" class="w-[120px]" />
            </descriptions-item>
            <descriptions-item label="订单统计周期（小于等于/天）">
                <el-input v-model="detail.input" class="w-[120px]" />
            </descriptions-item>
        </div>
        <div class="w-full flex justify-center">
            <el-button round class="w-[120px] mr-12" @click="router.back()">返回</el-button>
            <el-button round type="primary" class="w-[120px]" @click="handleSave">保存</el-button>
        </div>
    </div>
    <Dialog width="600px" v-model="state.logDialogVisible" title="操作日志" center>
        <div
            class="w-[calc(536px - 3.2rem)] bg-[rgba(232,239,247,0.5)] rounded-md flex flex-col mx-auto px-[1.6rem] py-[1.6rem] mb-8"
            v-for="(item, index) in 3"
            :key="index"
        >
            <div class="mb-[1.6rem]">
                <label>日期时间：</label>
                <span>2021-08-09 12:00:00</span>
            </div>
            <div class="mb-[1.6rem]">
                <label>处理操作：</label>
                <span>转发下一级</span>
            </div>
            <div>
                <label>操作人：</label>
                <span>-</span>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import Table from '@/components/table/index.vue'
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
        map: null,
        remark: '测试备注',
        logDialogVisible: false, // 处理日志弹窗
        tableData: [],
    }),
    detail = reactive({
        input: 15,
    })

const handleSave = () => {
    console.log('保存')
    router.back()
}
</script>
