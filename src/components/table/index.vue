<template>
    <div class="system-table-box overflow-hidden flex-auto">
        <!-- @selection-change="handleSelectionChange" -->
        <el-table
            v-bind="$attrs"
            class="system-table"
            :border="border"
            :data="data"
            @select="selectChange"
            @select-all="selectChange"
            ref="tableRef"
            :class="multiple ? '' : 'multipleShow'"
            height="100%"
            max-height="100%"
        >
            <el-table-column type="selection" align="center" width="50" v-if="showSelection" />
            <el-table-column label="序号" width="60" align="center" v-if="showIndex">
                <template #default="scope">
                    {{ (page.index - 1) * page.size + scope.$index + 1 }}
                </template>
            </el-table-column>
            <slot></slot>
        </el-table>
        <el-pagination
            v-if="showPage"
            v-model:current-page="page.index"
            class="system-page"
            background
            :layout="pageLayout"
            :total="page.total"
            v-model:page-size="page.size"
            :page-sizes="pageSizes"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import { defineComponent, nextTick, ref } from 'vue'
export default defineComponent({
    props: {
        value: { type: String, default: 'id' },
        border: { type: Boolean, default: true },
        multiple: { type: Boolean, default: false },
        data: { type: Array, default: () => [] }, // 数据源
        select: { type: Array, default: () => [] }, // 已选择的数据，与selection结合使用
        showIndex: { type: Boolean, default: false }, // 是否展示index选择，默认否
        showSelection: { type: Boolean, default: false }, // 是否展示选择框，默认否
        showPage: { type: Boolean, default: true }, // 是否展示页级组件，默认是
        page: {
            // 分页参数
            type: Object,
            default: () => {
                return { index: 1, size: 20, total: 0 }
            },
        },
        pageLayout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper',
        }, // 分页需要显示的东西，默认全部
        pageSizes: { type: Array, default: [10, 20, 50, 100] },
    },
    setup(props, context) {
        const tableRef = ref(null)
        let select = []
        let timer = null
        // 分页相关：监听页码切换事件
        const handleCurrentChange = (val) => {
            if (timer) {
                props.page.index = 1
            } else {
                props.page.index = val
                context.emit('getTableData')
            }
        }

        // 分页相关：监听单页显示数量切换事件
        const handleSizeChange = (val) => {
            timer = 'work'
            setTimeout(() => {
                timer = null
            }, 100)
            props.page.size = val
            context.emit('getTableData', true)
        }

        // 选择监听器
        // const handleSelectionChange = (val) => {
        //     context.emit('selection-change', val)
        // }

        const selectChange = async (e, row) => {
            await nextTick()
            if (!props.multiple) {
                tableRef.value.clearSelection()
                nextTick(() => {
                    tableRef.value.toggleRowSelection(row, true)
                })
            }
            if (props.multiple) {
                let ids = e.map((i) => i[props.value])
                console.log(ids)
                context.emit('update:modelValue', ids)
                context.emit('change', ids)
            } else {
                context.emit('update:modelValue', e[0][props.value])
                context.emit('change', e[0][props.value])
            }
        }

        return {
            handleCurrentChange,
            handleSizeChange,
            selectChange,
            tableRef,
            // handleSelectionChange,
        }
    },
})
</script>

<style lang="scss" scoped>
.system-table-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    overflow: hidden;

    .multipleShow {
        ::v-deep .el-table__header {
            .el-table-column--selection {
                .cell {
                    display: none;
                }
            }
        }
    }

    .system-page {
        align-self: flex-end;
        margin-top: 20px;
        button {
            .el-icon-arrow-left {
                margin: 0 auto;
            }

            .el-icon-arrow-right {
                margin: 0 auto;
            }
        }
    }
}

:deep(.el-table) {
    .cell {
        padding: 0 12px;
    }
}
</style>
