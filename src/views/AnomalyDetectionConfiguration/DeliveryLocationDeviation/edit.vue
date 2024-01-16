<style lang="scss" scoped></style>

<template>
    <div class="w-full flex flex-col p-12 detail">
        <div class="flex items-center mb-[5.6rem]">
            <div class="flex mr-12">
                <p class="text-title">创建时间：</p>
                <p>{{ detail.createTime ?? '--' }}</p>
            </div>
            <div class="flex mr-12">
                <p class="text-title">更新时间：</p>
                <p>{{ detail.updateTime ?? '--' }}</p>
            </div>
            <div class="flex">
                <p class="text-title">更新者：</p>
                <p>{{ detail.updateBy ?? '--' }}</p>
            </div>
            <el-button round class="ml-auto" @click="state.logDialogVisible = true"
                >查看日志
            </el-button>
            <el-button round type="danger" @click="handleDelete">删除 </el-button>
        </div>
        <div class="w-full px-16 grid grid-cols-4 gap-4">
            <descriptions-item label="送货路线编号 - 送货路线名称"
                >{{ detail?.deliveryRoute?.routeCode }} -
                {{ detail?.deliveryRoute?.routeName }}</descriptions-item
            >
            <descriptions-item label="容许偏差距离（米/m）">
                <el-input v-model="detail.maxDistance" class="w-[120px]" />
            </descriptions-item>
            <descriptions-item label="是否支持集中签收">
                <el-select v-model="detail.unifiedSigning" class="w-[120px]">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </descriptions-item>
            <div></div>
            <el-button type="primary" class="w-[100px]" @click="handleEditConfiguration"
                >保存
            </el-button>
        </div>
        <el-divider />
        <div class="w-full px-16">
            <div class="box-title text-title text-2xl">集中签收点列表</div>
            <div class="flex mb-8">
                <el-button
                    type="primary"
                    :icon="Plus"
                    @click="state.centralizedSigningPointDialogVisible = true"
                    >集中签收点
                </el-button>
                <el-button type="primary" @click="getCentralizedSigningPointData" :loading="state.loading"
                    >刷新同步
                </el-button>
            </div>
            <Table
                :data="state.tableData"
                height="380px"
                v-loading="state.loading"
                :page="page"
            >
                <el-table-column prop="name" label="集中签收点名称"> </el-table-column>
                <el-table-column prop="address" label="集中签收点地址" />
                <el-table-column prop="坐标" label="坐标">
                    <template #default="{ row }">
                        {{
                            row.longitude && row.latitude
                                ? `${row.longitude},${row.latitude}`
                                : '--'
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="启用状态" >
                    <template #default="{ row }">
                        <el-switch
                            v-model="row.status"
                            active-value="A"
                            inactive-value="D"
                            
                            :loading="state.statusLoading"
                            @change="handleEditStatus(row)"
                        />
                    </template>
                </el-table-column>
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
    <Dialog
        width="600px"
        v-model="state.centralizedSigningPointDialogVisible"
        title="新增集中签收点"
        center
    >
        <el-form
            :model="centralizedSigningPoint"
            label-width="180px"
            ref="centralizedSigningPointRef"
            :rules="rules"
            class="w-4/5"
        >
            <el-form-item label="集中签收点名称" prop="name">
                <el-input v-model="centralizedSigningPoint.name" class="w-full" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="centralizedSigningPoint.address" class="w-full">
                    <template #append>
                        <el-button :icon="Position" @click="state.mapDialogVisible = true" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input v-model="centralizedSigningPoint.longitude" class="w-full" />
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input v-model="centralizedSigningPoint.latitude" class="w-full" />
            </el-form-item>
            <el-form-item label="状态">
                <el-switch
                    v-model="centralizedSigningPoint.status"
                    active-value="A"
                    inactive-value="D"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="w-[100px]" @click="state.centralizedSigningPointDialogVisible = false"
                >取消</el-button
            >
            <el-button
                type="primary"
                class="w-[100px]"
                @click="handleAddCentralizedSigningPoint(centralizedSigningPointRef)"
                >确定
            </el-button>
        </template>
    </Dialog>
    <get-address
        v-model:show="state.mapDialogVisible"
        title="定位"
        center
        @confirm="handleAddressConfirm"
    />
</template>

<script setup>
import descriptionsItem from '@/components/descriptions-item.vue'
import Dialog from '@/components/dialog/index.vue'
import GetAddress from '@/components/get-address.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { Plus, Position } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(),
    router = useRouter()
const state = reactive({
        loading: false, // 表格loading
        statusLoading: false, // 状态loading
        map: null,
        remark: '测试备注',
        logDialogVisible: false, // 处理日志弹窗
        centralizedSigningPointDialogVisible: false, // 集中签收点弹窗
        mapDialogVisible: false, // 地图弹窗
        tableData: [],
    }),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    }),
    detail = reactive({
        id: '',
    }),
    centralizedSigningPointRef = ref(null), // 集中签收点ref
    centralizedSigningPoint = reactive({
        status: 'A',
    }),
    rules = reactive({
        name: [{ required: true, message: '请输入集中签收点名称', trigger: 'blur' }],
    })

// 页面初始化
onMounted(async () => {
    detail.id = route.params.id //  获取签收地偏离配置id
    centralizedSigningPoint.deviationId = detail.id // 集中签收点关联签收地偏离配置id
    await getDetail()
    await getCentralizedSigningPointData()
})

// 删除签收地偏离配置
const handleDelete = async () => {
    try {
        await ElMessageBox.confirm('请确认是否删除该条数据？', 'Warning', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        })
        const { code } = await tobaccoApi(
            'delete',
            `/api/v1/tobacco/signingDeviationConfig/${detail.id}`
        )
        if (code === 200) {
            ElMessage.success('删除成功')
            router.back()
        }
    } catch (error) {
        console.log(error)
    }
}

// 修改签收地偏离配置
const handleEditConfiguration = async () => {
    const { code } = await tobaccoApi('put', `/api/v1/tobacco/signingDeviationConfig`, detail)
    if (code === 200) {
        ElMessage.success('修改成功')
        await getDetail()
    }
}

// 获取签收地偏离配置详情
const getDetail = async () => {
    const { data, code } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/signingDeviationConfig/${detail.id}`
    )
    if (code === 200) {
        Object.assign(detail, data)
        centralizedSigningPoint.code = detail.routeCode
    }
}

// 获取地图标点信息
const handleAddressConfirm = (address) => {
    const { longitude, latitude, detailAddress } = address
    centralizedSigningPoint.longitude = longitude
    centralizedSigningPoint.latitude = latitude
    centralizedSigningPoint.address = detailAddress
    state.mapDialogVisible = false
}

// 新增集中签收点
const handleAddCentralizedSigningPoint = async (formEl) => {
    if (!formEl) return
    try {
        await formEl.validate()
        const { code } = await tobaccoApi(
            'post',
            `/api/v1/tobacco/unifiedSigningPoint`,
            centralizedSigningPoint
        )
        if (code === 200) {
            ElMessage.success('新增成功')
            formEl.resetFields()
            await getDetail()
        }
        state.centralizedSigningPointDialogVisible = false
    } catch (error) {
        console.log(error)
    }
}

// 修改集中签收点状态
const handleEditStatus = async (row) => {
    state.statusLoading = true
    const { code } = await tobaccoApi(
        'put',
        `/api/v1/tobacco/unifiedSigningPoint`,
        row
    )
    if (code === 200) {
        ElMessage.success('修改成功')
        await getCentralizedSigningPointData()
    }
    state.statusLoading = false
}

// 获取集中签收点列表
const getCentralizedSigningPointData = async () => {
    state.loading = true
    let params = {
        pageNum: page.index,
        pageSize: page.size,
        isAsc: 'desc',
        orderByColumn: 'createTime',
        deviationId: detail.id,
        // ...query,
    }
    try {
        const {
            data: { rows, total },
        } = await tobaccoApi(
            'get',
            `/api/v1/tobacco/unifiedSigningPoint/list?${qs.stringify(params)}`
        )
        state.tableData = rows
        page.total = Number(total)
    } catch (error) {
        state.tableData = []
        page.index = 1
        page.total = 0
    } finally {
        state.loading = false
    }
}
</script>
