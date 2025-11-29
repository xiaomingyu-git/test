<template>
  <div class="crud-page">
    <el-card>
      <!-- 页面标题区域 -->
      <div class="page-header">
        <h2 class="page-title">权限管理</h2>
        <div class="page-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd"> 新增权限 </el-button>
        </div>
      </div>

      <!-- 高级搜索表单区域 -->
      <div class="search-form">
        <el-form
          :model="searchForm"
          inline
          @submit.prevent="handleSearch"
          class="demo-form-inline"
          :class="{ expanded: isExpanded }"
        >
          <!-- 核心字段（默认显示） -->
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="权限名称或编码"
              clearable
              class="demo-input"
              style="width: 200px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="权限类型">
            <el-select
              v-model="searchForm.type"
              placeholder="请选择权限类型"
              clearable
              class="demo-select"
              style="width: 150px"
              @change="handleSearch"
            >
              <el-option
                v-for="option in permissionTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <el-tag :type="option.type" size="small" effect="light">
                  {{ option.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              class="demo-select"
              style="width: 120px"
              @change="handleSearch"
            >
              <el-option
                v-for="option in permissionStatusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <el-tag :type="option.type" size="small" effect="light">
                  {{ option.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 扩展字段（折叠时隐藏） -->
          <template v-if="isExpanded">
            <el-form-item label="所属模块">
              <el-select
                v-model="searchForm.module"
                placeholder="请选择所属模块"
                clearable
                class="demo-select"
                style="width: 150px"
                @change="handleSearch"
              >
                <el-option
                  v-for="option in permissionModuleOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                  <el-icon v-if="option.icon">
                    <component :is="option.icon" />
                  </el-icon>
                  <span style="margin-left: 8px">{{ option.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchForm.createdDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="demo-date-picker"
                style="width: 280px"
                :shortcuts="datePickerShortcuts"
                @change="handleSearch"
              />
            </el-form-item>

            <el-form-item label="更新时间">
              <el-date-picker
                v-model="searchForm.updatedDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="demo-date-picker"
                style="width: 280px"
                :shortcuts="datePickerShortcuts"
                @change="handleSearch"
              />
            </el-form-item>

            <el-form-item label="描述信息">
              <el-input
                v-model="searchForm.description"
                placeholder="权限描述关键词"
                clearable
                class="demo-input"
                style="width: 200px"
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </template>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="tableLoading">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>

            <!-- 展开/折叠按钮 -->
            <el-button type="primary" link @click="toggleExpanded" class="expand-button">
              {{ isExpanded ? '收起' : '展开' }}
              <el-icon class="expand-icon" :class="{ expanded: isExpanded }">
                <ArrowDown />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-toolbar" v-if="selectedRows.length > 0">
        <div class="toolbar-left">
          <span class="selected-info"> 已选择 {{ selectedRows.length }} 项 </span>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete"> 批量删除 </el-button>
        </div>

        <div class="toolbar-right">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <!-- 数据表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="name" label="权限名称" min-width="120" show-overflow-tooltip />

          <el-table-column prop="code" label="权限编码" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <el-text type="primary" tag="code">{{ row.code }}</el-text>
            </template>
          </el-table-column>

          <el-table-column
            prop="description"
            label="权限描述"
            min-width="180"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-text :type="row.description ? 'primary' : 'info'" size="small">
                {{ row.description || '暂无描述' }}
              </el-text>
            </template>
          </el-table-column>

          <el-table-column prop="type" label="权限类型" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getPermissionTypeTagType(row.type)" size="small" effect="light">
                {{ PERMISSION_TYPE_LABELS[row.type as PermissionType] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="module" label="所属模块" width="120" align="center">
            <template #default="{ row }">
              <el-tag type="info" size="small" effect="light">
                {{ PERMISSION_MODULE_LABELS[row.module as PermissionModule] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.status === PermissionStatus.ACTIVE ? 'success' : 'danger'"
                size="small"
              >
                {{ PERMISSION_STATUS_LABELS[row.status as PermissionStatus] }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="创建时间" width="180" show-overflow-tooltip />

          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">
                删除
              </el-button>
              <el-dropdown
                trigger="click"
                @command="(command: string) => handleDropdownCommand(command, row)"
              >
                <el-button type="primary" link size="small">
                  更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="view">查看详情</el-dropdown-item>
                    <el-dropdown-item command="copy">复制编码</el-dropdown-item>
                    <el-dropdown-item command="logs">操作日志</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑权限对话框 -->
    <PermissionFormDialog
      v-model="dialogVisible"
      :permission-data="currentPermission"
      :is-edit="isEdit"
      :loading="dialogLoading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- 权限详情对话框 -->
    <PermissionDetailDialog v-model="detailVisible" :permission-data="currentPermission" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Delete,
  Refresh,
  Search,
  Download,
  ArrowDown,
  User,
  Setting,
  Document,
  DataAnalysis,
  View,
} from '@element-plus/icons-vue'

// 导入组件
import PermissionFormDialog from '@/components/permission/PermissionFormDialog.vue'
import PermissionDetailDialog from '@/components/permission/PermissionDetailDialog.vue'

// 导入类型和API
import type {
  Permission,
  PermissionFormData,
  PermissionSearchForm,
  PermissionListResponse,
  ApiResponse,
} from '@/types/permission'
import {
  PERMISSION_TYPE_LABELS,
  PERMISSION_MODULE_LABELS,
  PERMISSION_STATUS_LABELS,
  PermissionStatus,
  PermissionType,
  PermissionModule,
} from '@/types/permission'
import {
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
  batchDeletePermissions,
} from '@/api/permission'

// 响应式数据
const tableLoading = ref(false)
const dialogLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const isExpanded = ref(false)
const tableData = ref<Permission[]>([])
const selectedRows = ref<Permission[]>([])
const currentPermission = ref<Permission | null>(null)

// 搜索表单数据
const searchForm = reactive<
  PermissionSearchForm & {
    createdDateRange?: [Date, Date] | null
    updatedDateRange?: [Date, Date] | null
    description?: string
  }
>({
  keyword: '',
  type: '',
  module: '',
  status: '',
  createdDateRange: null,
  updatedDateRange: null,
  description: '',
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 日期选择器快捷选项
const datePickerShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]

// 计算请求参数
const fetchParams = computed(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  keyword: searchForm.keyword || undefined,
  type: searchForm.type || undefined,
  module: searchForm.module || undefined,
  status: searchForm.status || undefined,
  description: searchForm.description || undefined,
  createdStartDate: searchForm.createdDateRange?.[0] || undefined,
  createdEndDate: searchForm.createdDateRange?.[1] || undefined,
  updatedStartDate: searchForm.updatedDateRange?.[0] || undefined,
  updatedEndDate: searchForm.updatedDateRange?.[1] || undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
}))

// 权限类型选项
const permissionTypeOptions = [
  {
    label: PERMISSION_TYPE_LABELS[PermissionType.MENU],
    value: PermissionType.MENU,
    type: 'primary',
  },
  {
    label: PERMISSION_TYPE_LABELS[PermissionType.BUTTON],
    value: PermissionType.BUTTON,
    type: 'success',
  },
  { label: PERMISSION_TYPE_LABELS[PermissionType.API], value: PermissionType.API, type: 'warning' },
]

// 权限模块选项
const permissionModuleOptions = [
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.USER_MANAGE],
    value: PermissionModule.USER_MANAGE,
    icon: User,
  },
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.ROLE_MANAGE],
    value: PermissionModule.ROLE_MANAGE,
    icon: Setting,
  },
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.SYSTEM_CONFIG],
    value: PermissionModule.SYSTEM_CONFIG,
    icon: Setting,
  },
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.CONTENT_MANAGE],
    value: PermissionModule.CONTENT_MANAGE,
    icon: Document,
  },
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.DATA_EXPORT],
    value: PermissionModule.DATA_EXPORT,
    icon: DataAnalysis,
  },
  {
    label: PERMISSION_MODULE_LABELS[PermissionModule.LOG_VIEW],
    value: PermissionModule.LOG_VIEW,
    icon: View,
  },
]

// 权限状态选项
const permissionStatusOptions = [
  {
    label: PERMISSION_STATUS_LABELS[PermissionStatus.ACTIVE],
    value: PermissionStatus.ACTIVE,
    type: 'success',
  },
  {
    label: PERMISSION_STATUS_LABELS[PermissionStatus.INACTIVE],
    value: PermissionStatus.INACTIVE,
    type: 'danger',
  },
]

// 获取权限列表
const fetchPermissionList = async () => {
  tableLoading.value = true
  try {
    const response: ApiResponse<PermissionListResponse> = await getPermissionList(fetchParams.value)

    if (response.success) {
      tableData.value = response.data.permissions
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取权限列表失败')
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    ElMessage.error('获取权限列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchPermissionList()
}

// 展开/折叠切换
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: '',
    module: '',
    status: '',
    createdDateRange: null,
    updatedDateRange: null,
    description: '',
  })
  pagination.page = 1
  fetchPermissionList()
}

// 处理刷新
const handleRefresh = () => {
  fetchPermissionList()
}

// 处理新增
const handleAdd = () => {
  isEdit.value = false
  currentPermission.value = null
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (permission: Permission) => {
  isEdit.value = true
  currentPermission.value = permission
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (permission: Permission) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限 "${permission.name}" (${permission.code}) 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    tableLoading.value = true
    const response = await deletePermission(permission.id)

    if (response.success) {
      ElMessage.success('删除成功')
      fetchPermissionList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除权限失败:', error)
      ElMessage.error('删除失败')
    }
  } finally {
    tableLoading.value = false
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的权限')
    return
  }

  try {
    const permissionNames = selectedRows.value
      .map((permission) => `${permission.name} (${permission.code})`)
      .join('、')
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个权限（${permissionNames}）吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    tableLoading.value = true
    const ids = selectedRows.value.map((permission) => permission.id)
    const response = await batchDeletePermissions(ids)

    if (response.success) {
      ElMessage.success(response.message || '批量删除成功')
      selectedRows.value = []
      fetchPermissionList()
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量删除权限失败:', error)
      ElMessage.error('批量删除失败')
    }
  } finally {
    tableLoading.value = false
  }
}

// 处理下拉菜单命令
const handleDropdownCommand = (command: string, permission: Permission) => {
  switch (command) {
    case 'view':
      currentPermission.value = permission
      detailVisible.value = true
      break
    case 'copy':
      navigator.clipboard.writeText(permission.code)
      ElMessage.success('权限编码已复制到剪贴板')
      break
    case 'logs':
      ElMessage.info('操作日志功能开发中...')
      break
  }
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理表单提交
const handleSubmit = async (formData: PermissionFormData) => {
  dialogLoading.value = true
  try {
    let response: ApiResponse<Permission>

    if (isEdit.value && currentPermission.value) {
      // 编辑权限
      response = await updatePermission(currentPermission.value.id, formData)
    } else {
      // 新增权限
      response = await createPermission(formData)
    }

    if (response.success) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      fetchPermissionList()
    } else {
      ElMessage.error(response.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    console.error('保存权限失败:', error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    dialogLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
  currentPermission.value = null
}

// 处理选择变化
const handleSelectionChange = (selection: Permission[]) => {
  selectedRows.value = selection
}

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchPermissionList()
}

// 处理每页数量变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  fetchPermissionList()
}

// 获取权限类型标签类型
const getPermissionTypeTagType = (type: PermissionType) => {
  switch (type) {
    case PermissionType.MENU:
      return 'primary'
    case PermissionType.BUTTON:
      return 'success'
    case PermissionType.API:
      return 'warning'
    default:
      return 'info'
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPermissionList()
})
</script>

<style scoped>
.crud-page {
  padding: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-actions {
  display: flex;
  gap: 8px;
}

.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

/* Element Plus 官方 inline 表单样式 */
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.demo-form-inline .el-date-picker {
  --el-date-picker-width: 280px;
}

/* 展开/折叠动画 */
.demo-form-inline {
  transition: all 0.3s ease;
}

.demo-form-inline .el-form-item {
  transition: all 0.3s ease;
}

/* 折叠状态下隐藏扩展字段 */
.demo-form-inline:not(.expanded) .el-form-item:nth-child(n + 4):not(:last-child) {
  display: none;
}

/* 展开/折叠按钮样式 */
.expand-button {
  margin-left: 8px;
  transition: all 0.3s ease;
}

.expand-icon {
  transition: transform 0.3s ease;
  margin-left: 4px;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.search-form ::v-deep(.el-form-item) {
  margin-bottom: 0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.selected-info {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.table-container {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .crud-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-form {
    padding: 12px;
  }

  .demo-form-inline {
    display: block;
  }

  .demo-form-inline .el-form-item {
    display: block;
    margin-bottom: 12px;
  }

  /* 移动端显示所有字段 */
  .demo-form-inline:not(.expanded) .el-form-item:nth-child(n + 4):not(:last-child) {
    display: block !important;
  }

  .demo-form-inline .el-input,
  .demo-form-inline .el-select,
  .demo-form-inline .el-date-picker {
    width: 100% !important;
  }

  .expand-button {
    margin-left: 0;
    margin-top: 8px;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }

  .pagination-container {
    justify-content: center;
  }
}

/* 响应式适配 - 固定宽度在移动端改为100% */
@media (max-width: 1200px) {
  .demo-form-inline .el-input {
    --el-input-width: 180px;
  }

  .demo-form-inline .el-select {
    --el-select-width: 180px;
  }
}
</style>
