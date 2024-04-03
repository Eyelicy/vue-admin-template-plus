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
        :width="300"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
        <template #reference>
            <div class="cursor-pointer inline order-info-popover">
                <slot></slot>
                <el-icon color="#348DED" class="ml-2"><View /></el-icon>
            </div>
        </template>
        <template #default>
            <div class="order-info-popover">
                <div class="item">
                    <div class="text-xl text-help mb-4">购方姓名</div>
                    <div class="text-xl text-title">{{ value?.order?.customer?.contactPerson }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">店名</div>
                    <div class="text-xl text-title">{{ value?.order?.customer?.customerName }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">品种数</div>
                    <div class="text-xl text-title">{{ value?.order?.skuCount }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">总盒数</div>
                    <div class="text-xl text-title">{{ value?.order?.quantity }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">总金额</div>
                    <div class="text-xl text-title">{{ value?.order?.amount }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">签收地址</div>
                    <div class="text-xl text-title">{{ value?.signingInfo?.address }}</div>
                </div>
                <img :src="value?.signingInfo?.faceImage" class="w-full" />
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { View } from '@element-plus/icons-vue';

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
})
</script>
