<template>
  <el-dialog v-model="visible" title="角色详情" width="600px" destroy-on-close>
    <div v-if="roleData" class="role-detail">
      <!-- 基本信息 -->
      <el-descriptions :column="1" border class="detail-section">
        <el-descriptions-item label="角色名称">
          <div class="role-name">
            <el-icon><User /></el-icon>
            <span class="name-text">{{ roleData.name }}</span>
            <el-tag
              :type="getStatusTagType(roleData.status)"
              size="small"
              effect="light"
              class="status-tag"
            >
              {{ getStatusText(roleData.status) }}
            </el-tag>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="角色描述">
          <el-text :type="roleData.description ? 'primary' : 'info'" class="description-text">
            {{ roleData.description || '暂无描述' }}
          </el-text>
        </el-descriptions-item>

        <el-descriptions-item label="用户数量">
          <div class="user-count">
            <el-icon><UserFilled /></el-icon>
            <el-text
              tag="b"
              :type="roleData.userCount && roleData.userCount > 0 ? 'primary' : 'info'"
            >
              {{ roleData.userCount || 0 }} 个用户
            </el-text>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
          <el-text type="info">
            {{ formatDateTime(roleData.createdAt) }}
          </el-text>
        </el-descriptions-item>

        <el-descriptions-item label="更新时间">
          <el-text type="info">
            {{ formatDateTime(roleData.updatedAt) }}
          </el-text>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 权限配置 -->
      <div class="permissions-section">
        <div class="section-title">
          <el-icon><Lock /></el-icon>
          <span>权限配置 ({{ roleData.permissions.length }} 项)</span>
        </div>

        <div class="permissions-groups">
          <div v-for="group in groupedPermissions" :key="group.category" class="permission-group">
            <div class="group-header">
              <el-icon :class="group.icon">
                <component :is="group.icon" />
              </el-icon>
              <span class="group-label">{{ group.label }}</span>
              <el-tag type="info" size="small" effect="light">
                {{ group.permissions.length }}
              </el-tag>
            </div>

            <div class="group-content">
              <el-tag
                v-for="permissionCode in group.permissions"
                :key="permissionCode"
                :type="getPermissionTagType(permissionCode)"
                size="small"
                effect="light"
                class="permission-tag"
              >
                {{ PERMISSION_LABELS[permissionCode as keyof typeof PERMISSION_LABELS] }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="statistics-section">
        <div class="section-title">
          <el-icon><TrendCharts /></el-icon>
          <span>统计信息</span>
        </div>

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-value">{{ roleData.permissions.length }}</div>
              <div class="stat-label">权限数量</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-value">{{ getPermissionCategoriesCount() }}</div>
              <div class="stat-label">权限类别</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-value">{{ roleData.userCount || 0 }}</div>
              <div class="stat-label">关联用户</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="角色数据不存在" :image-size="120" />

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="handleClose"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, UserFilled, Lock, Setting, Document, TrendCharts } from '@element-plus/icons-vue'
import type { Role } from '@/types/role'
import { RoleStatus, PERMISSION_LABELS } from '@/types/role'

interface Props {
  modelValue: boolean
  roleData: Role | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 对话框显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 分组权限
const groupedPermissions = computed(() => {
  if (!props.roleData) return []

  const groups = [
    {
      category: 'user',
      label: '用户管理',
      icon: UserFilled,
      permissions: [] as string[],
    },
    {
      category: 'role',
      label: '角色管理',
      icon: User,
      permissions: [] as string[],
    },
    {
      category: 'content',
      label: '内容管理',
      icon: Document,
      permissions: [] as string[],
    },
    {
      category: 'system',
      label: '系统管理',
      icon: Setting,
      permissions: [] as string[],
    },
  ]

  // 将权限按类别分组
  props.roleData.permissions.forEach((permission) => {
    const [category] = permission.split(':')
    const group = groups.find((g) => g.category === category)

    if (group) {
      group.permissions.push(permission)
    } else {
      // 如果没有对应的分组，添加到系统管理
      const systemGroup = groups.find((g) => g.category === 'system')
      if (systemGroup) {
        systemGroup.permissions.push(permission)
      }
    }
  })

  // 移除空分组
  return groups.filter((group) => group.permissions.length > 0)
})

// 获取权限类别数量
const getPermissionCategoriesCount = () => {
  return groupedPermissions.value.length
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
const getPermissionTagType = (permission: string) => {
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

// 格式化日期时间
const formatDateTime = (dateTime: string | undefined) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 处理关闭
const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.role-detail {
  padding: 0;
}

.detail-section {
  margin-bottom: 24px;
}

.role-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.status-tag {
  font-size: 12px;
}

.description-text {
  line-height: 1.5;
}

.user-count {
  display: flex;
  align-items: center;
  gap: 8px;
}

.permissions-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-title .el-icon {
  color: var(--el-color-primary);
}

.permissions-groups {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.permission-group {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.permission-group:last-child {
  border-bottom: none;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.group-header .el-icon {
  color: var(--el-color-primary);
  font-size: 16px;
}

.group-label {
  font-weight: 500;
  flex: 1;
}

.group-content {
  padding: 16px;
  background: var(--el-bg-color);
}

.permission-tag {
  margin: 0 8px 8px 0;
}

.statistics-section {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  .role-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .group-header {
    padding: 12px;
  }

  .group-content {
    padding: 12px;
  }

  .permission-tag {
    margin: 0 6px 6px 0;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 20px;
  }
}

/* 描述列表样式优化 */
:deep(.el-descriptions__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
  width: 100px;
}

:deep(.el-descriptions__content) {
  color: var(--el-text-color-regular);
}

:deep(.el-descriptions__body) {
  background: var(--el-bg-color-page);
}

:deep(.el-descriptions__header) {
  background: var(--el-fill-color-lighter);
}

/* 卡片悬浮效果 */
.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}
</style>
