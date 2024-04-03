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
            <div class="cursor-pointer flex items-center">
                <slot></slot>
                <el-icon color="#348DED" class="ml-2"><Postcard /></el-icon>
            </div>
        </template>
        <template #default>
            <div class="order-info-popover">
                <div class="item">
                    <div class="text-xl text-help mb-4">姓名</div>
                    <div class="text-xl text-title">
                        {{ info?.contactPerson ?? info?.name ?? '--' }}
                    </div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">身份证号</div>
                    <div class="text-xl text-title">{{ info?.idCard ?? '--' }}</div>
                </div>
                <div class="item">
                    <div class="text-xl text-help mb-4">注册时间</div>
                    <div class="text-xl text-title">{{ info?.registerDate ?? '--' }}</div>
                </div>
                <img :src="info?.image" alt="" srcset="" />
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { tobaccoApi } from '@/server/api/tobacco'
import { Postcard } from '@element-plus/icons-vue'
import { reactive, watch } from 'vue'

const info = reactive({})

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
})

watch(
    () => props.value,
    async () => {
        if (props.value.entityId) {
            await getRealNameInfo()
        }
    }
)

const getRealNameInfo = async () => {
    const {
        data,
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/realname/${props.value.entityId}`
    )
    Object.assign(info, data)
}
</script>
