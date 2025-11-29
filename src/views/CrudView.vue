<template>
  <div class="crud-container">
    <!-- 页面容器 -->
    <el-card class="crud-card">
      <!-- 头部操作区域 -->
      <template #header>
        <div class="crud-header">
          <div class="header-left">
            <h2 class="page-title">用户管理</h2>
          </div>
          <div class="header-right">
            <el-button
              type="primary"
              :icon="Plus"
              @click="handleCreate"
            >
              新增用户
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="用户名/邮箱/手机号"
              clearable
              style="width: 250px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="角色">
            <el-select
              v-model="searchForm.role"
              placeholder="全部角色"
              clearable
              style="width: 120px"
            >
              <el-option label="管理员" value="admin" />
              <el-option label="编辑者" value="editor" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="全部状态"
              clearable
              style="width: 120px"
            >
              <el-option label="正常" value="active" />
              <el-option label="禁用" value="inactive" />
              <el-option label="封禁" value="banned" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 批量操作区域 -->
      <div v-if="selectedRows.length > 0" class="batch-actions">
        <el-alert
          :title="`已选择 ${selectedRows.length} 项`"
          type="info"
          :closable="false"
        >
          <template #default>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
            <el-button
              size="small"
              @click="selectedRows = []"
            >
              取消选择
            </el-button>
          </template>
        </el-alert>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- 选择列 -->
          <el-table-column type="selection" width="55" align="center" />

          <!-- ID列 -->
          <el-table-column prop="id" label="ID" width="80" align="center" />

          <!-- 用户名列 -->
          <el-table-column prop="username" label="用户名" min-width="120" show-overflow-tooltip />

          <!-- 邮箱列 -->
          <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />

          <!-- 手机号列 -->
          <el-table-column prop="phone" label="手机号" width="130" align="center" />

          <!-- 角色列 -->
          <el-table-column prop="role" label="角色" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getRoleTag(row.role).type" size="small">
                {{ getRoleTag(row.role).text }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 状态列 -->
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTag(row.status).type" size="small">
                {{ getStatusTag(row.status).text }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 创建时间列 -->
          <el-table-column prop="createdAt" label="创建时间" width="160" align="center" />

          <!-- 操作列 -->
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                :icon="Edit"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editMode === 'create' ? '新增用户' : '编辑用户'"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="editForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="editForm.username"
                placeholder="请输入用户名"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="editForm.email"
                placeholder="请输入邮箱"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="editForm.phone"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="editForm.role"
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option label="管理员" value="admin" />
                <el-option label="编辑者" value="editor" />
                <el-option label="普通用户" value="user" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="editForm.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="正常" value="active" />
                <el-option label="禁用" value="inactive" />
                <el-option label="封禁" value="banned" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 新增时显示密码字段 -->
        <template v-if="editMode === 'create'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="editForm.password"
                  type="password"
                  placeholder="请输入密码"
                  maxlength="20"
                  show-password
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="editForm.confirmPassword"
                  type="password"
                  placeholder="请确认密码"
                  maxlength="20"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSave"
          >
            {{ editMode === 'create' ? '创 建' : '保 存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/composables/useCrud'

// 使用 CRUD composable
const {
  tableData,
  loading,
  searchForm,
  pagination,
  selectedRows,
  dialogVisible,
  editMode,
  editForm,
  formRef,
  formRules,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleCreate,
  handleEdit,
  handleDelete,
  handleBatchDelete,
  handleSave,
  handleCancel,
  getStatusTag,
  getRoleTag,
  init
} = useCrud()

// 弹窗关闭前的处理
const handleClose = (done: () => void) => {
  if (loading.value) {
    return
  }
  done()
}

// 组件挂载时初始化数据
onMounted(() => {
  init()
})
</script>

<style scoped>
.crud-container {
  padding: 20px;
}

.crud-card {
  min-height: calc(100vh - 120px);
}

.crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-right {
  display: flex;
  gap: 12px;
}

.search-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--el-fill-color-extra-light);
  border-radius: 8px;
}

.search-form {
  margin: 0;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 16px;
}

.search-form .el-form-item:last-child {
  margin-right: 0;
}

.batch-actions {
  margin-bottom: 16px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .crud-container {
    padding: 10px;
  }

  .crud-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-form {
    flex-direction: column;
  }

  .search-form .el-form-item {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .search-form .el-form-item:last-child {
    margin-bottom: 0;
  }

  .el-table {
    font-size: 12px;
  }
}
</style>