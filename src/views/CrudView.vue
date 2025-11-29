<template>
  <div class="crud-page">
    <el-card>
      <!-- 页面标题区域 -->
      <div class="page-header">
        <h2 class="page-title">用户管理</h2>
        <div class="page-actions">
          <el-button type="primary" :icon="Plus" @click="handleCreate"> 新增用户 </el-button>
        </div>
      </div>

      <!-- 查询表单区域 -->
      <UserSearchForm
        v-model="searchForm"
        :loading="loading"
        :role-options="USER_ROLE_OPTIONS"
        :status-options="USER_STATUS_OPTIONS"
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- 数据表格区域 -->
      <UserTable
        :data="tableData"
        :loading="loading"
        :processing="isProcessing"
        :selected-rows="selectedRows"
        :pagination="pagination"
        :page-sizes="PAGE_SIZE_OPTIONS"
        :format-date="formatDate"
        :get-role-text="getRoleText"
        :get-role-tag-type="getRoleTagType"
        :get-status-text="getStatusText"
        :get-status-tag-type="getStatusTagType"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @edit="handleEdit"
        @delete="handleDelete"
        @batch-delete="handleBatchDelete"
        @clear-selection="clearSelection"
        @refresh="fetchData"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @command="handleCommand"
      />

      <!-- 用户表单弹窗 -->
      <UserForm
        v-model="formData"
        v-model:visible="dialogVisible"
        :mode="editMode"
        :submitting="submitting"
        :role-options="USER_ROLE_OPTIONS"
        :status-options="USER_STATUS_OPTIONS"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useUserManagement } from '@/composables/useUserManagement'
import type { User } from '@/types/user'
import UserSearchForm from '@/components/UserSearchForm.vue'
import UserTable from '@/components/UserTable.vue'
import UserForm from '@/components/UserForm.vue'

// 使用用户管理 composable
const {
  loading,
  submitting,
  isProcessing,
  tableData,
  selectedRows,
  dialogVisible,
  editMode,
  searchForm,
  pagination,
  formData,
  PAGE_SIZE_OPTIONS,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  formatDate,
  getRoleText,
  getRoleTagType,
  getStatusText,
  getStatusTagType,
  fetchData,
  handleSearch,
  handleReset,
  handleSortChange,
  handleSelectionChange,
  clearSelection,
  handleSizeChange,
  handleCurrentChange,
  handleCreate,
  handleEdit,
  handleDelete,
  handleBatchDelete,
  handleSubmit,
  handleCancel,
} = useUserManagement()

// 处理表格下拉菜单命令
const handleCommand = (command: string, row: User) => {
  switch (command) {
    case 'view':
      // TODO: 实现查看详情功能
      console.log('查看详情:', row)
      break
    case 'reset':
      // TODO: 实现重置密码功能
      console.log('重置密码:', row)
      break
    case 'logs':
      // TODO: 实现操作日志功能
      console.log('操作日志:', row)
      break
    default:
      break
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* CRUD 页面容器 - 遵循标准布局规范 */
.crud-page {
  padding: 16px;
  background-color: var(--el-bg-color-page);
  min-height: calc(100vh - 60px);
}

/* 页面标题区域 - 标准布局 */
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

/* 响应式适配 */
@media (max-width: 768px) {
  .crud-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .page-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 576px) {
  .page-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .page-title {
    font-size: 16px;
  }
}
</style>
