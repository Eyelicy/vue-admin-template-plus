<style lang="scss" scoped>
:deep(.avatar-uploader) {
    .avatar {
        width: 144px;
        height: 144px;
        display: block;
        // border-radius: 50%;
    }

    .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        // border-radius: 50%;
    }

    .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 144px;
        height: 144px;
        text-align: center;
    }
}
</style>

<template>
    <div class="w-full h-full flex flex-col">
        <TableHead v-model="query" @onSearch="getTableData(true)" @onReset="getTableData(true)">
            <div class="table-header">
                <div class="table-header-lab">姓名</div>
                <el-input v-model="query.name" clearable> </el-input>
            </div>
            <div class="table-header">
                <div class="table-header-lab">所属路线</div>
                <line-select v-model="query.routeCode" placeholder="请选择所属路线" clearable />
            </div>
            <div class="table-header">
                <div class="table-header-lab">类型</div>
                <el-select
                    v-model="query.entityType"
                    @change=";(query.customerCode = ''), (query.personnelCode = '')"
                >
                    <el-option
                        v-for="(item, key) in entityTypeText"
                        :key="key"
                        :label="item"
                        :value="key"
                    />
                </el-select>
            </div>
            <div class="table-header">
                <div class="table-header-lab">包含客户</div>
                <client-select
                    v-model="query.customerCode"
                    placeholder="请选择包含客户"
                    clearable
                    val="customerCode"
                />
            </div>
            <div class="table-header" v-if="query.entityType === 'DELIVERY'">
                <div class="table-header-lab">所属服务站点</div>
                <station-code-select
                    v-model="query.stationCode"
                    placeholder="请选择所属服务站点"
                    clearable
                    val="stationCode"
                    label="stationName"
                />
            </div>
        </TableHead>
        <el-button
            class="mb-8"
            type="primary"
            style="width: 100px"
            :icon="Plus"
            @click="state.addDialogVisible = true"
            >新增
        </el-button>
        <Table
            class="flex-auto"
            ref="table"
            v-model:page="page"
            v-loading="state.loading"
            :data="state.tableData"
            @getTableData="getTableData"
        >
            <el-table-column prop="name" label="人名"> </el-table-column>
            <el-table-column prop="image" label="人脸">
                <template #default="{ row }">
                    <template v-if="!row.image"> -- </template>
                    <el-image
                        v-else
                        :append-to-body="true"
                        :preview-teleported="true"
                        style="width: 50px; height: 50px"
                        :src="`${row.image}?x-oss-process=image/resize,w_100,h_100`"
                        :preview-src-list="[`${row.image}?${Date.now()}`]"
                        fit="cover"
                    />
                </template>
            </el-table-column>
            <el-table-column prop="entityType" label="类型">
                <template #default="{ row }">
                    <div class="flex flex-wrap">
                        {{ entityTypeText[row.entityType] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="customer.customerName" label="归属客户" />
            <el-table-column prop="idCard" label="身份证号" />
            <el-table-column prop="deliveryRoute.routeName" label="所属路线" />
            <el-table-column prop="station.stationName" label="所属服务站点" />
            <el-table-column prop="label" label="备注" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button
                        @click="handleStatus(row)"
                        :type="row.status === 'A' ? 'danger' : 'primary'"
                        >{{ row.status === 'A' ? '禁用' : '启用' }}</el-button
                    >
                    <el-button @click="handleEdit(row)">编辑</el-button>
                    <!-- <el-button @click="handleLogDialogVisible(row)">日志</el-button>
                        <el-button
                            @click="
                                router.push({
                                    path: `abnormal-receipt-order/${row.customerName}`,
                                })
                            "
                            >订单</el-button
                        >
                        <el-popconfirm
                            title="请确认是否删除该条数据？"
                            @confirm="handleDelete(row)"
                        >
                            <template #reference>
                                <el-button>删除 </el-button>
                            </template>
                        </el-popconfirm> -->
                </template>
            </el-table-column>
        </Table>
    </div>
    <Dialog width="600px" v-model="state.addDialogVisible" title="新增" center>
        <el-form
            style="width: 400px"
            :model="addRealName"
            label-width="180px"
            ref="addRealNameRef"
            :rules="rules"
        >
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addRealName.name" class="w-full" />
            </el-form-item>
            <el-form-item label="人脸" prop="image">
                <el-upload
                    class="avatar-uploader"
                    :action="action"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :disabled="edit"
                >
                    <img v-if="addRealName.image" :src="addRealName.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="addRealName.idCard" class="w-full" />
            </el-form-item>
            <el-form-item label="备注" prop="label">
                <el-input v-model="addRealName.label" class="w-full" />
            </el-form-item>
            <el-form-item label="类型" prop="entityType">
                <el-select
                    v-model="addRealName.entityType"
                    @change=";(addRealName.customerCode = ''), (addRealName.personnelCode = '')"
                >
                    <el-option
                        v-for="(item, key) in entityTypeText"
                        :key="key"
                        :label="item"
                        :value="key"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="addRealName.entityType === 'CUSTOMER'"
                label="归属客户"
                prop="customerCode"
            >
                <client-select
                    val="customerCode"
                    v-model="addRealName.customerCode"
                    placeholder="请选择归属客户"
                    class="w-full"
                />
            </el-form-item>
            <el-form-item
                v-else-if="addRealName.entityType === 'DRIVER'"
                label="运输员"
                prop="personnelCode"
            >
                <el-select v-model="addRealName.personnelCode">
                    <el-option
                        v-for="(item, index) in state.driverList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-else-if="addRealName.entityType === 'DELIVERY'"
                label="派送员"
                prop="personnelCode"
            >
                <el-select v-model="addRealName.personnelCode">
                    <el-option
                        v-for="(item, index) in state.deliveryList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch
                    v-model="addRealName.status"
                    active-value="A"
                    inactive-value="D"
                    :active-text="addRealName.status === 'A' ? '禁用' : '启用'"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="w-[100px]" @click="state.addDialogVisible = false">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="handleAddRealName(addRealNameRef)"
                >确定
            </el-button>
        </template>
    </Dialog>
    <Dialog width="600px" v-model="state.editDialogVisible" title="编辑" center>
        <el-form
            style="width: 400px"
            :model="editRealName"
            label-width="180px"
            ref="editRealNameRef"
            :rules="rules"
        >
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editRealName.name" class="w-full" />
            </el-form-item>
            <el-form-item label="人脸" prop="image">
                <el-upload
                    class="avatar-uploader"
                    :action="action"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :disabled="edit"
                >
                    <img v-if="editRealName.image" :src="editRealName.image" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="editRealName.idCard" class="w-full" />
            </el-form-item>
            <el-form-item label="备注" prop="label">
                <el-input v-model="editRealName.label" class="w-full" />
            </el-form-item>
            <el-form-item label="类型" prop="entityType">
                <el-select v-model="editRealName.entityType">
                    <el-option
                        v-for="(item, key) in entityTypeText"
                        :key="key"
                        :label="item"
                        :value="key"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="editRealName.entityType === 'CUSTOMER'"
                label="归属客户"
                prop="customerCode"
            >
                <client-select
                    val="customerCode"
                    v-model="editRealName.customerCode"
                    placeholder="请选择归属客户"
                    class="w-full"
                />
            </el-form-item>
            <el-form-item
                v-else-if="editRealName.entityType === 'DRIVER'"
                label="运输员"
                prop="personnelCode"
            >
                <el-select v-model="editRealName.personnelCode">
                    <el-option
                        v-for="(item, index) in state.driverList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-else-if="editRealName.entityType === 'DELIVERY'"
                label="派送员"
                prop="personnelCode"
            >
                <el-select v-model="editRealName.personnelCode">
                    <el-option
                        v-for="(item, index) in state.deliveryList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch
                    v-model="editRealName.status"
                    active-value="A"
                    inactive-value="D"
                    :active-text="editRealName.status === 'A' ? '禁用' : '启用'"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="w-[100px]" @click="state.editDialogVisible = false">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="handleEditRealName(editRealNameRef)"
                >确定
            </el-button>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import clientSelect from '@/components/select/client-select.vue'
import lineSelect from '@/components/select/line-select.vue'
import TableHead from '@/components/table/head.vue'
import Table from '@/components/table/index.vue'
import { tobaccoApi } from '@/server/api/tobacco.js'
import { useUserStore } from '@/store/user'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const entityTypeText = {
    CUSTOMER: '客户注册人',
    DRIVER: '运输员',
    DELIVERY: '派送员',
}

const { userInfo, token, app_guid } = useUserStore(),
    action = `${import.meta.env.VITE_BASE_URL}/common/upload_aliyun`,
    headers = {
        Authorization: `app_guid=${app_guid}`,
        token: token,
    }

const router = useRouter(),
    state = reactive({
        logDialogVisible: false,
        addDialogVisible: false,
        editDialogVisible: false,
        loading: false,
        customerCode: '',
        tableData: [
            {
                abnormal_code: '123',
                status: 1,
                register_name: '张三',
                order_code: '123',
            },
        ],
        driverList: [],
        deliveryList: [],
        statusList: [
            { label: '正常', value: 1 },
            { label: '异常', value: 2 },
        ],
    }),
    warningLog = reactive({
        tableData: [],
    }),
    rules = reactive({
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        image: [{ required: true, message: '请上传人脸', trigger: 'change' }],
        idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            {
                validator: async (rule, value, callback) => {
                    if (
                        !/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
                            value
                        )
                    )
                        callback(new Error('请输入正确格式'))
                    callback()
                },
                trigger: 'blur',
            },
        ],
        entityType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        customerCode: [{ required: true, message: '请选择归属客户', trigger: 'blur' }],
        personnelCode: [
            {
                required: true,
                message: `请选择人员`,
                trigger: 'change',
            },
        ],
    }),
    addRealNameRef = ref(null),
    addRealName = reactive({
        routeCode: '',
        maxDistance: '',
        unifiedSigning: '',
        status: 'A',
    }),
    editRealName = reactive({}),
    editRealNameRef = ref(null),
    query = reactive({}),
    page = reactive({
        index: 1,
        total: 0,
        size: 10,
    })

onMounted(async () => {
    await getTableData(true)
    await getDeliveryPersonList()
})

const handleEdit = (row) => {
    Object.assign(editRealName, row)
    state.editDialogVisible = true
}

const handleStatus = async (row) => {
    row.status = row.status === 'A' ? 'D' : 'A'
    const { code } = await tobaccoApi('put', `/api/v1/tobacco/realname`, row)
    if (code === 200) {
        if (row.status === 'A') {
            ElMessage.success('启用成功')
        } else {
            ElMessage.success('禁用成功')
        }
        // ElMessage.success('编辑成功')
        // state.editDialogVisible = false
        getTableData(true)
    } else {
        ElMessage.error('编辑失败')
    }
}

const handleEditRealName = async (formEl) => {
    if (!formEl) return
    const valid = await formEl.validate()
    if (!valid) {
        return
    }
    const { code } = await tobaccoApi('put', `/api/v1/tobacco/realname`, editRealName)
    if (code === 200) {
        ElMessage.success('编辑成功')
        state.editDialogVisible = false
        getTableData(true)
    } else {
        ElMessage.error('编辑失败')
    }
}

const handleLogDialogVisible = async (row) => {
    state.logDialogVisible = true
    state.customerCode = row.customerCode
    await getLogData()
}

// 删除异常客户
const handleDelete = async (row) => {
    const { code } = await tobaccoApi('delete', `/api/v1/tobacco/customer/${row.customerCode}`)
    if (code === 200) {
        getTableData(true)
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}

// 获取表格数据
const getTableData = async (init) => {
    state.loading = true
    if (init) {
        page.index = 1
    }

    let params = {
        pageNum: page.index,
        pageSize: page.size,
        ...query,
    }
    // if (query.alertLevel) {
    //     params.alertLevel = query.alertLevel
    // } else {
    //     params.alertLevel = -1
    // }
    try {
        const {
            data: { rows, total },
        } = await tobaccoApi('get', `/api/v1/tobacco/realname/list?${qs.stringify(params)}`)
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

// 获取送货人员列表
const getDeliveryPersonList = async () => {
    const {
        data: { rows },
    } = await tobaccoApi('get', '/api/v1/tobacco/deliveryPersonnel/list')
    state.deliveryList = rows
        .filter((item) => {
            return item.position === 'DELIVERY'
        })
        .map((item) => {
            return {
                label: item.name,
                value: item.personnelCode,
            }
        })
    state.driverList = rows
        .filter((item) => {
            return item.position === 'DRIVER'
        })
        .map((item) => {
            return {
                label: item.name,
                value: item.personnelCode,
            }
        })
}

// 获取日志数据
const getLogData = async () => {
    let params = {
        customerCode: state.customerCode,
    }
    const {
        data: { rows },
    } = await tobaccoApi(
        'get',
        `/api/v1/tobacco/customerAlertLevelChangeLog/list?${qs.stringify(params)}`
    )
    warningLog.tableData = rows
}

// 上传头像
const handleAvatarSuccess = async (response, uploadFile) => {
    const {
        data: { url },
    } = await response
    addRealName.image = url
}

const handleAddRealName = async (formEl) => {
    if (!formEl) return
    const valid = await formEl.validate()
    console.log(valid)
    if (!valid) {
        return
    }
    const { code } = await tobaccoApi('post', '/api/v1/tobacco/realname', addRealName)
    if (code === 200) {
        ElMessage.success('新增成功')
        state.addDialogVisible = false
        getTableData(true)
    } else {
        ElMessage.error('新增失败')
    }
}
</script>
