<template>
  <div class="crud-page">
    <el-card>
      <!-- 页面标题区域 -->
      <div class="page-header">
        <h2 class="page-title">角色管理</h2>
        <div class="page-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd"> 新增角色 </el-button>
        </div>
      </div>

      <!-- 查询表单区域 -->
      <div class="search-form" v-if="true">
        <el-form :model="searchForm" inline>
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="角色名称或描述"
              clearable
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>

          <el-form-item label="权限">
            <el-select
              v-model="searchForm.permission"
              placeholder="请选择权限"
              clearable
              style="width: 180px"
            >
              <el-option label="用户管理" value="user:manage" />
              <el-option label="角色管理" value="role:manage" />
              <el-option label="内容编辑" value="content:edit" />
              <el-option label="内容查看" value="content:view" />
              <el-option label="系统配置" value="system:config" />
              <el-option label="数据导出" value="data:export" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch"> 查询 </el-button>
            <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
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

          <el-table-column prop="name" label="角色名称" min-width="120" show-overflow-tooltip />

          <el-table-column
            prop="description"
            label="角色描述"
            min-width="180"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.description || '暂无描述' }}
            </template>
          </el-table-column>

          <el-table-column label="权限" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="permissionCode in row.permissions.slice(0, 3)"
                :key="permissionCode"
                size="small"
                class="permission-tag"
              >
                {{ PERMISSION_LABELS[permissionCode as keyof typeof PERMISSION_LABELS] }}
              </el-tag>
              <el-text v-if="row.permissions.length > 3" type="info" size="small">
                +{{ row.permissions.length - 3 }}
              </el-text>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="userCount" label="用户数量" width="100" align="center">
            <template #default="{ row }">
              {{ row.userCount || 0 }}
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="创建时间" width="180" show-overflow-tooltip />

          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleView(row)">
                查看
              </el-button>
              <el-button type="warning" link size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDelete(row)"
                :disabled="!canDelete(row)"
              >
                删除
              </el-button>
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

    <!-- 新增/编辑角色对话框 -->
    <RoleFormDialog
      v-model="dialogVisible"
      :role-data="currentRole"
      :is-edit="isEdit"
      :loading="dialogLoading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- 角色详情对话框 -->
    <RoleDetailDialog v-model="detailVisible" :role-data="currentRole" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Refresh, Search, Download } from '@element-plus/icons-vue'

// 导入组件
import RoleFormDialog from '@/components/role/RoleFormDialog.vue'
import RoleDetailDialog from '@/components/role/RoleDetailDialog.vue'

// 导入类型和API
import type { Role, RoleFormData } from '@/types/role'
import { PERMISSION_LABELS } from '@/types/role'
import type { ApiResponse, RoleListResponse } from '@/types/role'
import { getRoleList, createRole, updateRole, deleteRole, batchDeleteRoles } from '@/api/role'

// 响应式数据
const tableLoading = ref(false)
const dialogLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const tableData = ref<Role[]>([])
const selectedRows = ref<Role[]>([])
const currentRole = ref<Role | null>(null)

// 搜索表单数据
const searchForm = reactive({
  keyword: '',
  status: '',
  permission: '',
})

// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 计算请求参数
const fetchParams = computed(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  keyword: searchForm.keyword || undefined,
  status: searchForm.status || undefined,
  permission: searchForm.permission || undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
}))

// 获取角色列表
const fetchRoleList = async () => {
  tableLoading.value = true
  try {
    const response: ApiResponse<RoleListResponse> = await getRoleList(fetchParams.value)

    if (response.success) {
      tableData.value = response.data.roles
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取角色列表失败')
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    tableLoading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  fetchRoleList()
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    permission: '',
  })
  pagination.page = 1
  fetchRoleList()
}

// 处理刷新
const handleRefresh = () => {
  fetchRoleList()
}

// 处理新增
const handleAdd = () => {
  isEdit.value = false
  currentRole.value = null
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (role: Role) => {
  isEdit.value = true
  currentRole.value = role
  dialogVisible.value = true
}

// 处理查看详情
const handleView = (role: Role) => {
  currentRole.value = role
  detailVisible.value = true
}

// 处理删除
const handleDelete = async (role: Role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${role.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    tableLoading.value = true
    const response = await deleteRole(role.id)

    if (response.success) {
      ElMessage.success('删除成功')
      fetchRoleList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error('删除失败')
    }
  } finally {
    tableLoading.value = false
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的角色')
    return
  }

  try {
    const roleNames = selectedRows.value.map((role) => role.name).join('、')
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个角色（${roleNames}）吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    tableLoading.value = true
    const ids = selectedRows.value.map((role) => role.id)
    const response = await batchDeleteRoles(ids)

    if (response.success) {
      ElMessage.success(response.message || '批量删除成功')
      selectedRows.value = []
      fetchRoleList()
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量删除角色失败:', error)
      ElMessage.error('批量删除失败')
    }
  } finally {
    tableLoading.value = false
  }
}

// 处理表单提交
const handleSubmit = async (formData: RoleFormData) => {
  dialogLoading.value = true
  try {
    let response: ApiResponse<Role>

    if (isEdit.value && currentRole.value) {
      // 编辑角色
      response = await updateRole(currentRole.value.id, formData)
    } else {
      // 新增角色
      response = await createRole(formData)
    }

    if (response.success) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      fetchRoleList()
    } else {
      ElMessage.error(response.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    console.error('保存角色失败:', error)
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  } finally {
    dialogLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
  currentRole.value = null
}

// 处理选择变化
const handleSelectionChange = (selection: Role[]) => {
  selectedRows.value = selection
}

// 处理导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchRoleList()
}

// 处理每页数量变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  fetchRoleList()
}

// 判断是否可以删除
const canDelete = (role: Role) => {
  // 超级管理员角色不能删除
  if (role.name === '超级管理员') {
    return false
  }
  // 有关联用户的角色不能删除
  if (role.userCount && role.userCount > 0) {
    return false
  }
  return true
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRoleList()
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

.search-form :deep(.el-form-item) {
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

.permission-tag {
  margin-right: 4px;
  margin-bottom: 4px;
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

  .search-form :deep(.el-form) {
    display: block;
  }

  .search-form :deep(.el-form-item) {
    display: block;
    margin-bottom: 12px;
  }

  .search-form :deep(.el-input),
  .search-form :deep(.el-select) {
    width: 100% !important;
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
</style>
