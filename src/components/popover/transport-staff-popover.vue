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
            <div class=" cursor-pointer inline transport-staff-popover">
                <slot></slot>
                <el-icon color="#348DED" class="ml-2"><View /></el-icon>
            </div>
        </template>
        <template #default>
            <div class="order-info-popover">
                <div class="item">
                    <div class="text-xl text-help mb-4">运输日期</div>
                    <div class="text-xl text-title">{{ value?.shippingDate ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">运输车辆</div>
                    <div class="text-xl text-title">{{ value?.licensePlate ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">运输人</div>
                    <div class="text-xl text-title">{{ value?.driver?.name ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">驾驶证号</div>
                    <div class="text-xl text-title">{{ value?.driver?.driverLicense ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">配送人</div>
                    <div class="text-xl text-title">{{ value?.deliveryPerson?.name ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">身份证号</div>
                    <div class="text-xl text-title">{{ value?.deliveryPerson?.idCard ?? '--' }}</div>
                </div>
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
