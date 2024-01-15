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
        <div class="w-full px-16 grid grid-cols-4 gap-4">
            <descriptions-item label="送货路线编号 - 送货路线名称"
                >123213123 - 新百地下500米</descriptions-item
            >
            <descriptions-item label="容许偏差距离（米/m）">
                <el-input v-model="detail.input" class="w-[120px]" />
            </descriptions-item>
            <descriptions-item label="是否支持集中签收">
                <el-select v-model="detail.value" class="w-[120px]">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </descriptions-item>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">集中签收点列表</div>
            <Table :data="state.tableData">
                <el-table-column prop="abnormal_code" label="异常预警时间"> </el-table-column>
                <el-table-column prop="status" label="异常类型">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? '正常' : '异常' }}
                    </template>
                </el-table-column>
                <el-table-column prop="register_name" label="订单编号" />
                <el-table-column prop="order_code" label="客户名称" />
                <el-table-column prop="order_code" label="签收地址" />
                <el-table-column prop="order_code" label="品种数" />
                <el-table-column prop="order_code" label="总盒数" />
                <el-table-column prop="order_code" label="总金额（元）" />
            </Table>
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

const state = reactive({
        map: null,
        remark: '测试备注',
        logDialogVisible: false, // 处理日志弹窗
        tableData: [],
    }),
    detail = reactive({
        input: 15,
    })
</script>
