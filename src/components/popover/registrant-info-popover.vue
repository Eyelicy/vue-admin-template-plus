<style lang="scss" scoped>
.order-info-popover {
    .item {
        @apply flex;

        div:nth-child(1) {
            width: 80px;
            margin-right: 12px;
            text-align-last: justify;
        }
    }
}
</style>

<template>
    <el-popover
        :width="320"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
        <template #reference>
            <div class=" cursor-pointer">
                <slot></slot>
                <el-icon class="ml-2 "><View /></el-icon>
            </div>
        </template>
        <template #default>
            <div class="order-info-popover">
                <div class="item">
                    <div class="text-xl text-help mb-4">注册店名</div>
                    <div class="text-xl text-title">{{ value?.customerName ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">代理年数</div>
                    <div class="text-xl text-title">{{ value?.years ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">性别</div>
                    <div class="text-xl text-title">{{ sexMap[value?.gender] ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">年龄</div>
                    <div class="text-xl text-title">{{ value?.age ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">身份证号</div>
                    <div class="text-xl text-title">{{ value?.idCard ?? '--' }}</div>
                </div>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { View } from '@element-plus/icons-vue';

const sexMap = {
    male: '男',
    female: '女',
}

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
})
</script>
