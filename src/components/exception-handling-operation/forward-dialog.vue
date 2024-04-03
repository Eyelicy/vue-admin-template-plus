<style lang="scss">
.my-dialog {
    border-radius: 8px;

    .el-dialog__header {
        padding: 0;
        margin-right: 0;
        border-bottom: 1px solid #eeeeee;
    }

    .my-header {
        padding: 20px 32px;
        @apply flex items-center justify-between;
    }

    .my-header-title {
        @apply text-2xl font-medium;
        color: #303133;
    }
}
</style>

<template>
    <el-dialog
        width="600px"
        class="my-dialog"
        v-bind="$attrs"
        center
        :show-close="false"
        @close="close"
    >
        <template #header>
            <div class="my-header zIndex30">
                <p class="my-header-title">转发</p>
                <el-icon color="#909399" class="" style="cursor: pointer" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="px-4">
            <el-input
                class="mb-6"
                v-model="state.staff_name"
                :suffix-icon="Search"
                @change="getAllStaffTree"
                placeholder="请输入员工姓名进行检索"
            />
            <el-tree
                class="mb-6"
                :data="state.staffTree"
                node-key="staff_guid"
                :props="defaultProps"
                show-checkbox
                ref="staffTreeRef"
                check-strictly
                @node-click="handleNodeClick"
                @check-change="checkChange"
            />
            <div class="flex items-center">
                <label class="mr-4 text-xl flex items-center mr-auto"
                    >多人审批时选择审批方式
                    <el-icon color="#FA9F16" size="16"><QuestionFilled /></el-icon
                ></label>
                <el-radio-group v-model="state.radio">
                    <el-radio :label="3">指定单签</el-radio>
                    <el-radio :label="6" disabled>会签</el-radio>
                    <el-radio :label="9" disabled>或签</el-radio>
                </el-radio-group>
            </div>
        </div>
        <template #footer>
            <el-button class="w-[100px]" @click="close">取消</el-button>
            <el-button type="primary" class="w-[100px]" @click="confirm">确定 </el-button>
        </template>
    </el-dialog>
</template>

<script setup name="remark-dialog">
import { useExceptionMonitoringManagement } from '@/composables/useExceptionMonitoringManagement'
import { getAllStaffTreeApi } from '@/server/organization'
import { useUserStore } from '@/store/user'
import { Close, QuestionFilled, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref, useAttrs } from 'vue'

const { handleForward } = useExceptionMonitoringManagement()
const userStore = useUserStore()
const corporation_guid = userStore.userInfo?.extinfo?.Organization?.GUID

const attrs = useAttrs()
const emits = defineEmits(['update:modelValue', 'update:result', 'confirm'])

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    exceptionCode: {
        type: String,
        default: '',
    },
})

const state = reactive({
        radio: 3,
        staff_name: '',
        staffTree: [],
    }),
    staffTreeRef = ref(null)

const defaultProps = {
    children: 'children',
    label: 'name',
    disabled: 'disabled',
}

const getAllStaffTree = async () => {
    let params = {}
    if (state.staff_name) {
        params = {
            staff_name: state.staff_name,
            corporation_guid: corporation_guid,
            department_guid: '',
        }
    } else {
        params = {
            corporation_guid: corporation_guid,
            department_guid: '',
        }
    }
    const { data } = await getAllStaffTreeApi(params)
    state.staffTree = processDataToTree(data)
}

const processDataToTree = (data) => {
    const tree = []

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const department = data[key]
            const departmentNode = {
                department_guid: department.department_guid,
                name: department.department_name,
                disabled: true,
                children: [],
            }

            for (const staffKey in department.staff) {
                if (department.staff.hasOwnProperty(staffKey)) {
                    const staffMember = department.staff[staffKey]
                    const staffNode = {
                        staff_id: staffMember.staff_id,
                        staff_guid: staffMember.staff_guid,
                        name: staffMember.staff_name,
                        user_id: staffMember.user_id,
                        career_id: staffMember.career_id,
                        career_title: staffMember.career_title,
                        career_level: staffMember.career_level,
                    }

                    departmentNode.children.push(staffNode)
                }
            }

            tree.push(departmentNode)
        }
    }

    return tree
}

const change = (val) => {
    state.result = val
    emits('update:result', val)
}

const close = () => {
    emits('update:modelValue', false)
}

const confirm = async () => {
    const staffGuid = staffTreeRef.value.getCheckedKeys()
    if (staffGuid.length === 0) {
        ElMessage.error('请选择转发员工')
        return
    }
    await handleForward(props.exceptionCode, staffGuid[0])
    staffTreeRef.value.setCheckedKeys([])
    emits('update:modelValue', false)
    emits('confirm')
}

const handleNodeClick = (item, node, self) => {
    state.editCheckId = item.staff_guid /*接收当前带你就的节点id  */
    staffTreeRef.value.setCheckedKeys([item.staff_guid])
}

const checkChange = (item, node, self) => {
    if (node == true) {
        state.editCheckId = item.staff_guid
        staffTreeRef.value.setCheckedKeys([item.staff_guid])
    } else {
        if (state.editCheckId === item.staff_guid) {
            staffTreeRef.value.setCheckedKeys([item.staff_guid])
        }
    }
    console.log(item, node, self)
}

getAllStaffTree()
</script>
