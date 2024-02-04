<style lang="scss" scoped>
.tag-level-1 {
    background-color: #f34628;
    border-color: #f34628;
    color: #fff;
}

.tag-level-2 {
    background-color: #303133;
    border-color: #303133;
    color: #fff;
}

.tag-level-3 {
    background-color: #feea33;
    border-color: #feea33;
    color: #000;
}
</style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">客户基础信息</div>
            <div class="grid grid-cols-4 gap-4 gap-y-8">
                <descriptions-item label="客户名称">{{
                    details?.customerName ?? '--'
                }}</descriptions-item>
                <descriptions-item label="风险预警等级">
                    <el-tag
                        class="p-4 rounded-md mr-12"
                        :class="`tag-level-${details?.alertLevel}`"
                    >
                        {{ details?.customerAlertLevel?.name ?? '暂无' }}
                    </el-tag>
                    <el-button type="danger" plain @click="handleResetLevel">重置</el-button>
                </descriptions-item>
                <descriptions-item label="签收地址">
                    <map-popover :longitude="details?.longitude" :latitude="details?.latitude">
                        {{ details?.address ?? '--' }}
                    </map-popover>
                </descriptions-item>
                <descriptions-item label="注册人名">
                    <registrant-name-popover :value="details?.realname">
                        {{ details?.realname?.name }}
                    </registrant-name-popover>
                </descriptions-item>
                <descriptions-item label="所属路线编号/路线名"
                    >{{ details?.customerDeliveryInfo?.deliveryRoute?.routeCode }} -
                    {{ details?.customerDeliveryInfo?.deliveryRoute?.routeName }}
                </descriptions-item>
                <descriptions-item label="所属服务站点">{{
                    details?.customerDeliveryInfo?.deliveryRoute?.stationCode ?? '--'
                }}</descriptions-item>
                <descriptions-item label="关联派送员">{{
                    details?.deliveryPersonnelList?.length !== 0
                        ? details?.deliveryPersonnelList?.map((item) => item.name).join(',')
                        : null ?? '--'
                }}</descriptions-item>
            </div>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">自定义分类</div>
            <div
                class="flex flex-wrap items-center bg-[#EEEEEE] py-[24px] px-[12px] pb-[64px] relative"
            >
                <el-tag
                    v-for="tag in details.labelList"
                    type="success"
                    class="mr-12 mb-6"
                    effect="dark"
                    closable
                    @close="handleCloseTag(tag.id)"
                    >{{ tag.labelName }}
                </el-tag>
                <el-button
                    class="w-[200px] absolute m-auto bottom-[16px] right-0 left-0"
                    type="primary"
                    plain
                    :icon="Plus"
                    @click="classification.dialogVisible = true"
                    >增加分类标记
                </el-button>
            </div>
        </div>
        <el-divider />
        <div class="w-full px-16 flex-auto text-center">
            <div class="box-title text-title text-2xl text-left">已备案人脸</div>
            <Table :data="state.readNameList" :show-page="false">
                <el-table-column prop="image" label="人脸">
                    <template #default="{ row }">
                        <el-image
                            style="width: 50px; height: 50px"
                            :src="`${row.image}?x-oss-process=image/resize,w_100,h_100`"
                            fit="cover"
                            :preview-src-list="state?.readNameList.map((item) => `${item.image}`)"
                            :append-to-body="true"
                            :preview-teleported="true"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="人名" />
                <el-table-column prop="signingCount" label="概率">
                    <template #default="{ row }">
                        概率
                        {{
                            `${(isNaN(
                                row?.signingCount /
                                    state?.readNameList.reduce(
                                        (total, obj) => total + obj.signingCount,
                                        0
                                    )
                            )
                                ? 0
                                : (row?.signingCount /
                                      state?.readNameList.reduce(
                                          (total, obj) => total + obj.signingCount,
                                          0
                                      )) *
                                  100
                            ).toFixed(2)}%`
                        }}
                        （{{ row?.signingCount ?? 0 }}次）
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" />
            </Table>
        </div>
        <el-divider />
        <div class="w-full px-16 flex-auto text-center">
            <div class="box-title text-title text-2xl text-left">异常订单信息</div>
            <Table :data="state.tableData" :show-page="false">
                <el-table-column prop="createTime" label="异常预警时间"> </el-table-column>
                <el-table-column prop="status" label="异常类型">
                    <template #default="{ row }">
                        {{ exceptionStatus[row.exceptionType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="orderSn" label="订单编号" />
                <el-table-column prop="order.customer.customerName" label="客户名称" />
                <el-table-column prop="orderAddress" label="签收地址" />
                <el-table-column prop="order.skuCount" label="品种数" />
                <el-table-column prop="order.quantity" label="总盒数" />
                <el-table-column prop="order.amount" label="总金额（元）" />
            </Table>
            <el-button
                v-if="state.tableData.length > 0"
                type="primary"
                class="w-[200px] mx-auto mt-[32px]"
                @click="
                    router.push({
                        path: `/abnormal-receipt-statistics/abnormal-receipt-order/${details.customerName}`,
                    })
                "
            >
                查看更多
            </el-button>
        </div>
    </div>
    <Dialog width="600px" v-model="classification.dialogVisible" title="添加分类标记" center>
        <el-select
            filterable
            remote
            reserve-keyword
            remote-show-suffix
            :remote-method="getWarningLevel"
            :loading="state.loading"
            v-model="state.labelId"
        >
            <el-option
                v-for="item in state.warningLevelData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
            <template #footer>
                <div class="flex items-center">
                    <el-input
                        v-model="state.typeText"
                        class="option-input mr-12"
                        placeholder="请输入分类名称"
                        size="small"
                    />
                    <el-button type="primary" size="small" @click="onConfirm"> 确认 </el-button>
                </div>
            </template>
        </el-select>
        <template #footer>
            <el-button class="w-[100px]" @click="classification.dialogVisible = false"
                >取消
            </el-button>
            <el-button type="primary" class="w-[100px]" @click="handleAddTag">新增</el-button>
        </template>
    </Dialog>
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { exceptionStatus } from '@/utils/enum'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(),
    router = useRouter()

const state = reactive({
        labelId: '',
        customerCode: '',
        tableData: [],
        readNameList: [],
        warningLevelData: [],
        typeText: '', // 新增分类标记文本
        customerLabelData: [], // 客户自定义分类
    }),
    details = reactive({}),
    classification = reactive({
        dynamicTags: ['标签一', '标签二', '标签三'],
        dialogVisible: false,
        inputValue: '',
    })

onMounted(async () => {
    state.customerCode = route.params.id
    await getDetails()
    await getOrderList()
    await getWarningLevel()
    await getRealNameList()
})

// 删除客户自定义分类
const handleCloseTag = (id) => {
    ElMessageBox.confirm('是否删除该分类标记？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const { code } = await tobaccoApi('delete', `/api/v1/tobacco/customerLabel/${id}`)
        if (code === 200) {
            ElMessage.success('删除成功')
            await getDetails()
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 绑定客服自定义分类
const handleAddTag = async () => {
    if (!state.labelId) {
        ElMessage.error('请选择分类标记')
        return
    }
    const { code } = await tobaccoApi('post', `/api/v1/tobacco/customerLabel`, {
        customerCode: state.customerCode,
        labelId: state.labelId,
    })
    if (code === 200) {
        ElMessage.success('新增成功')
        classification.dialogVisible = false
        state.labelId = ''
        await getDetails()
    } else {
        ElMessage.error('新增失败')
    }
}

// 重置客户预警等级
const handleResetLevel = async () => {
    try {
        await ElMessageBox.confirm('是否重置该客户的预警等级？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        const { code } = await tobaccoApi(
            'post',
            `/api/v1/tobacco/customer/resetAlertLevel/${details?.customerCode}`
        )
        if (code === 200) {
            ElMessage.success('重置成功')
            router.back()
        } else {
            ElMessage.error('重置失败')
        }
    } catch (error) {
        // if (error === 'cancel') {
        //     ElMessage.error('重置失败')
        // }
    }
}

// 获取详情
const getDetails = async () => {
    const { data } = await tobaccoApi('get', `/api/v1/tobacco/customer/${state.customerCode}`)
    Object.assign(details, data)
    console.log('details:', details)
}

// 已备案人脸
const getRealNameList = async () => {
    const {
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/realname/list?customerCode=${state.customerCode}`)
    state.readNameList = rows
}

// 按客户名称获取异常订单列表
const getOrderList = async () => {
    let params = {
        customerCode: details.customerCode,
        pageNum: 1,
        pageSize: 5,
    }
    const {
        data: { rows, total },
    } = await tobaccoApi('get', `/api/v1/tobacco/exceptionInfo/list?${qs.stringify(params)}`)
    state.tableData = rows
}

// 获取预警等级
const getWarningLevel = async (query) => {
    const params = {
        name: query,
        isDefault: false,
        orderByColumn: 'sort',
        isAsc: 'desc',
    }
    const {
        code,
        data: { rows },
    } = await tobaccoApi('get', `/api/v1/tobacco/customerAlertLevel/list?${qs.stringify(params)}`)
    if (code === 200) {
        state.warningLevelData = rows
    }
}

// 新增预警等级
const onConfirm = async () => {
    if (!state.typeText) {
        ElMessage.error('请输入分类名称')
        return
    }
    const { code } = await tobaccoApi('post', `/api/v1/tobacco/customerAlertLevel`, {
        name: state.typeText,
        isDefault: false,
    })
    if (code === 200) {
        state.typeText = ''
        ElMessage.success('新增成功')
        await getWarningLevel()
    }
}
</script>
