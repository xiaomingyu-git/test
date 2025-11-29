<template>
  <div class="role-table">
    <el-table
      :data="data"
      v-loading="loading"
      :default-sort="{ prop: 'createdAt', order: 'descending' }"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" align="center" :selectable="isRowSelectable" />

      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" align="center" :index="getIndex" />

      <!-- 角色名称列 -->
      <el-table-column prop="name" label="角色名称" min-width="150" sortable show-overflow-tooltip>
        <template #default="{ row }">
          <div class="role-name-cell">
            <el-text class="role-name" tag="b">{{ row.name }}</el-text>
            <el-tag
              v-if="row.userCount !== undefined && row.userCount > 0"
              type="info"
              size="small"
              effect="light"
              class="user-count-tag"
            >
              {{ row.userCount }} 用户
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- 角色描述列 -->
      <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <el-text :type="row.description ? 'primary' : 'info'" size="small">
            {{ row.description || '暂无描述' }}
          </el-text>
        </template>
      </el-table-column>

      <!-- 权限列 -->
      <el-table-column label="权限" min-width="280" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="permissions-cell">
            <el-tag
              v-for="permission in displayPermissions(row.permissions)"
              :key="permission"
              :type="getPermissionTagType(permission)"
              size="small"
              effect="light"
              class="permission-tag"
            >
              {{ PERMISSION_LABELS[permission] || permission }}
            </el-tag>
            <el-tooltip
              v-if="row.permissions.length > 3"
              :content="getFullPermissions(row.permissions)"
              placement="top"
            >
              <el-tag type="info" size="small" effect="light" class="more-permissions-tag">
                +{{ row.permissions.length - 3 }} 更多
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <!-- 状态列 -->
      <el-table-column prop="status" label="状态" width="100" align="center" sortable>
        <template #default="{ row }">
          <el-tag
            :type="getStatusTagType(row.status)"
            :icon="getStatusIcon(row.status)"
            size="small"
            effect="light"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 用户数量列 -->
      <el-table-column
        v-if="showUserCount"
        prop="userCount"
        label="用户数量"
        width="100"
        align="center"
        sortable
      >
        <template #default="{ row }">
          <el-text :type="row.userCount && row.userCount > 0 ? 'primary' : 'info'" tag="b">
            {{ row.userCount || 0 }}
          </el-text>
        </template>
      </el-table-column>

      <!-- 创建时间列 -->
      <el-table-column prop="createdAt" label="创建时间" width="180" sortable show-overflow-tooltip>
        <template #default="{ row }">
          <el-text size="small">
            {{ formatDateTime(row.createdAt) }}
          </el-text>
        </template>
      </el-table-column>

      <!-- 更新时间列 -->
      <el-table-column prop="updatedAt" label="更新时间" width="180" sortable show-overflow-tooltip>
        <template #default="{ row }">
          <el-text size="small">
            {{ formatDateTime(row.updatedAt) }}
          </el-text>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <div class="table-actions">
            <el-button link type="primary" size="small" :icon="View" @click="handleView(row)">
              查看
            </el-button>
            <el-button link type="warning" size="small" :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除这个角色吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  link
                  type="danger"
                  size="small"
                  :icon="Delete"
                  :disabled="!canDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="showPagination" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!loading && data.length === 0" description="暂无角色数据" :image-size="120">
      <template #description>
        <p>还没有创建任何角色</p>
        <p class="empty-tip">点击"新增角色"按钮创建第一个角色</p>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { View, Edit, Delete, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
import type { Role, Permission } from '@/types/role'
import { RoleStatus, PERMISSION_LABELS } from '@/types/role'

interface Props {
  data: Role[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
  selectedRows?: Role[]
  showUserCount?: boolean
  showPagination?: boolean
}

interface Emits {
  (e: 'selection-change', selection: Role[]): void
  (e: 'page-change', page: number): void
  (e: 'page-size-change', pageSize: number): void
  (e: 'edit', role: Role): void
  (e: 'delete', role: Role): void
  (e: 'view', role: Role): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showUserCount: true,
  showPagination: true,
})

const emit = defineEmits<Emits>()

// 分页数据
const currentPage = computed({
  get: () => props.pagination?.page || 1,
  set: (value) => {
    if (props.pagination) {
      emit('page-change', value)
    }
  },
})

const pageSize = computed({
  get: () => props.pagination?.pageSize || 10,
  set: (value) => {
    if (props.pagination) {
      emit('page-size-change', value)
    }
  },
})

const total = computed(() => props.pagination?.total || 0)

// 获取序号
const getIndex = (index: number) => {
  const page = props.pagination?.page || 1
  const pageSize = props.pagination?.pageSize || 10
  return (page - 1) * pageSize + index + 1
}

// 判断行是否可选择
const isRowSelectable = (row: Role) => {
  return canDelete(row)
}

// 判断是否可以删除
const canDelete = (row: Role) => {
  // 超级管理员角色不能删除
  if (row.name === '超级管理员') {
    return false
  }
  // 有关联用户的角色不能删除
  if (row.userCount && row.userCount > 0) {
    return false
  }
  return true
}

// 处理选择变化
const handleSelectionChange = (selection: Role[]) => {
  emit('selection-change', selection)
}

// 处理排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  // 这里可以处理排序逻辑
  console.log('排序变化:', { prop, order })
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  emit('page-change', page)
}

// 处理每页数量变化
const handlePageSizeChange = (pageSize: number) => {
  emit('page-size-change', pageSize)
}

// 处理查看
const handleView = (role: Role) => {
  emit('view', role)
}

// 处理编辑
const handleEdit = (role: Role) => {
  emit('edit', role)
}

// 处理删除
const handleDelete = (role: Role) => {
  emit('delete', role)
}

// 获取状态标签类型
const getStatusTagType = (status: RoleStatus) => {
  switch (status) {
    case RoleStatus.ACTIVE:
      return 'success'
    case RoleStatus.INACTIVE:
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态图标
const getStatusIcon = (status: RoleStatus) => {
  switch (status) {
    case RoleStatus.ACTIVE:
      return SuccessFilled
    case RoleStatus.INACTIVE:
      return WarningFilled
    default:
      return undefined
  }
}

// 获取状态文本
const getStatusText = (status: RoleStatus) => {
  switch (status) {
    case RoleStatus.ACTIVE:
      return '启用'
    case RoleStatus.INACTIVE:
      return '禁用'
    default:
      return '未知'
  }
}

// 获取权限标签类型
const getPermissionTagType = (permission: Permission) => {
  const typeMap: Record<string, string> = {
    'user:manage': 'danger',
    'user:view': 'info',
    'role:manage': 'warning',
    'content:edit': 'primary',
    'content:view': 'success',
    'system:config': 'danger',
    'data:export': 'warning',
  }
  return typeMap[permission] || ''
}

// 显示权限（最多显示3个）
const displayPermissions = (permissions: Permission[]) => {
  return permissions.slice(0, 3)
}

// 获取完整权限列表
const getFullPermissions = (permissions: Permission[]) => {
  return permissions.map((permission) => PERMISSION_LABELS[permission] || permission).join('、')
}

// 格式化日期时间
const formatDateTime = (dateTime: string | undefined) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.role-table {
  width: 100%;
}

.role-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-name {
  color: var(--el-color-primary);
}

.user-count-tag {
  font-size: 11px;
}

.permissions-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.permission-tag {
  font-size: 11px;
}

.more-permissions-tag {
  font-size: 11px;
  cursor: help;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--el-border-color-lighter);
}

.empty-tip {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-actions {
    flex-direction: column;
    gap: 4px;
  }

  .permissions-cell {
    max-width: 150px;
  }

  .permission-tag,
  .more-permissions-tag {
    font-size: 10px;
    padding: 0 4px;
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table__header) {
  background-color: var(--el-fill-color-lighter);
}

:deep(.el-table__header th) {
  background-color: var(--el-fill-color-lighter);
  color: var(--el-text-color-primary);
  font-weight: 600;
}

:deep(.el-table__body tr:hover > td) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-table__body tr.selected > td) {
  background-color: var(--el-color-primary-light-8);
}

/* 标签样式优化 */
:deep(.el-tag) {
  border: none;
  border-radius: 4px;
  font-weight: 500;
}

:deep(.el-tag--small) {
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
}

/* 分页样式优化 */
:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  border-radius: 4px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: var(--el-color-primary);
}
</style>
