<!--
  用户表格组件
  包含数据展示、分页、操作按钮
-->
<template>
  <div class="table-container">
    <!-- 操作工具栏 -->
    <div class="table-toolbar" v-if="hasSelectedRows">
      <div class="toolbar-left">
        <span class="selected-info"> 已选择 {{ selectedRows.length }} 项 </span>
        <el-button
          type="danger"
          size="small"
          :loading="processing"
          :icon="Delete"
          @click="$emit('batch-delete')"
        >
          批量删除
        </el-button>
        <el-button size="small" @click="$emit('clear-selection')"> 取消选择 </el-button>
      </div>

      <div class="toolbar-right">
        <el-button size="small" :icon="Refresh" @click="$emit('refresh')"> 刷新 </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      stripe
      border
      style="width: 100%"
      empty-text="暂无数据"
    >
      <!-- 选择列 -->
      <el-table-column type="selection" width="55" align="center" />

      <!-- ID列 -->
      <el-table-column prop="id" label="ID" width="80" align="center" sortable />

      <!-- 用户名列 -->
      <el-table-column
        prop="username"
        label="用户名"
        min-width="120"
        show-overflow-tooltip
        sortable
      />

      <!-- 邮箱列 -->
      <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />

      <!-- 手机号列 -->
      <el-table-column prop="phone" label="手机号" width="130" align="center" />

      <!-- 角色列 -->
      <el-table-column prop="role" label="角色" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getRoleTagType(row.role)" size="small">
            {{ getRoleText(row.role) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 创建时间列 -->
      <el-table-column prop="createdAt" label="创建时间" width="160" align="center" sortable>
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="primary" size="small" link :icon="Edit" @click="$emit('edit', row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              :icon="Delete"
              :loading="processing"
              @click="$emit('delete', row)"
            >
              删除
            </el-button>
            <el-dropdown
              trigger="click"
              @command="(command: string) => handleCommand(command, row)"
            >
              <el-button type="primary" link size="small">
                更多
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">查看详情</el-dropdown-item>
                  <el-dropdown-item command="reset">重置密码</el-dropdown-item>
                  <el-dropdown-item command="logs">操作日志</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="pagination.current"
        :page-size="pagination.size"
        :page-sizes="pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="$emit('size-change', $event)"
        @current-change="$emit('current-change', $event)"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Edit, Delete, ArrowDown, Refresh } from '@element-plus/icons-vue'
import type { User, UserRole, UserStatus, TagType } from '@/types/user'

interface Props {
  data: User[]
  loading?: boolean
  processing?: boolean
  selectedRows: User[]
  pagination: {
    current: number
    size: number
    total: number
  }
  pageSizes?: number[]
  // 工具函数
  formatDate: (dateStr: string) => string
  getRoleText: (role: UserRole) => string
  getRoleTagType: (role: UserRole) => TagType
  getStatusText: (status: UserStatus) => string
  getStatusTagType: (status: UserStatus) => TagType
}

interface Emits {
  (e: 'selection-change', rows: User[]): void
  (e: 'sort-change', payload: { prop: string; order: string | null }): void
  (e: 'edit', row: User): void
  (e: 'delete', row: User): void
  (e: 'batch-delete'): void
  (e: 'clear-selection'): void
  (e: 'refresh'): void
  (e: 'size-change', size: number): void
  (e: 'current-change', current: number): void
  (e: 'command', command: string, row: User): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  processing: false,
  pageSizes: () => [10, 20, 50, 100],
})

const emit = defineEmits<Emits>()

const hasSelectedRows = computed(() => props.selectedRows.length > 0)

// 处理选择变化
const handleSelectionChange = (rows: User[]) => {
  emit('selection-change', rows)
}

// 处理排序变化
const handleSortChange = (payload: { prop: string; order: string | null }) => {
  emit('sort-change', payload)
}

// 处理下拉菜单命令
const handleCommand = (command: string, row: User) => {
  emit('command', command, row)
}
</script>

<style scoped>
.table-container {
  margin-bottom: 16px;
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
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .selected-info {
    text-align: center;
    display: block;
    margin-bottom: 8px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .pagination-container {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .action-buttons :deep(.el-button) {
    font-size: 12px;
    padding: 4px 8px;
  }

  .table-toolbar {
    padding: 8px 12px;
  }
}
</style>
