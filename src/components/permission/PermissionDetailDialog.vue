<template>
  <el-dialog v-model="visible" title="权限详情" width="600px" destroy-on-close>
    <div v-if="permissionData" class="permission-detail">
      <!-- 基本信息 -->
      <el-descriptions :column="1" border class="detail-section">
        <el-descriptions-item label="权限名称">
          <div class="permission-name">
            <el-icon><Key /></el-icon>
            <span class="name-text">{{ permissionData.name }}</span>
            <el-tag
              :type="getPermissionTypeTagType(permissionData.type)"
              size="small"
              effect="light"
              class="type-tag"
            >
              {{ PERMISSION_TYPE_LABELS[permissionData.type] }}
            </el-tag>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="权限编码">
          <div class="permission-code">
            <el-icon><Position /></el-icon>
            <el-text type="primary" tag="code">{{ permissionData.code }}</el-text>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="权限描述">
          <el-text :type="permissionData.description ? 'primary' : 'info'" class="description-text">
            {{ permissionData.description || '暂无描述' }}
          </el-text>
        </el-descriptions-item>

        <el-descriptions-item label="所属模块">
          <div class="permission-module">
            <el-icon>
              <component :is="getModuleIcon(permissionData.module)" />
            </el-icon>
            <el-tag type="info" size="small" effect="light">
              {{ PERMISSION_MODULE_LABELS[permissionData.module] }}
            </el-tag>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="权限状态">
          <el-tag
            :type="permissionData.status === PermissionStatus.ACTIVE ? 'success' : 'danger'"
            :icon="getStatusIcon(permissionData.status)"
            size="small"
            effect="light"
          >
            {{ PERMISSION_STATUS_LABELS[permissionData.status] }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
          <el-text type="info">
            {{ formatDateTime(permissionData.createdAt) }}
          </el-text>
        </el-descriptions-item>

        <el-descriptions-item label="更新时间">
          <el-text type="info">
            {{ formatDateTime(permissionData.updatedAt) }}
          </el-text>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 权限特征 -->
      <div class="features-section">
        <div class="section-title">
          <el-icon><Collection /></el-icon>
          <span>权限特征</span>
        </div>

        <el-row :gutter="16">
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <component :is="getTypeIcon(permissionData.type)" />
                </el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">权限类型</div>
                <div class="feature-value">{{ PERMISSION_TYPE_LABELS[permissionData.type] }}</div>
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <component :is="getModuleIcon(permissionData.module)" />
                </el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">所属模块</div>
                <div class="feature-value">
                  {{ PERMISSION_MODULE_LABELS[permissionData.module] }}
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon>
                  <component :is="getStatusIcon(permissionData.status)" />
                </el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">权限状态</div>
                <div class="feature-value">
                  {{ PERMISSION_STATUS_LABELS[permissionData.status] }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 编码分析 -->
      <div class="analysis-section">
        <div class="section-title">
          <el-icon><DataAnalysis /></el-icon>
          <span>编码分析</span>
        </div>

        <div class="code-analysis">
          <div class="code-display">
            <el-text type="primary" tag="code">{{ permissionData.code }}</el-text>
          </div>
          <div class="code-breakdown">
            <div class="code-part">
              <span class="part-label">模块:</span>
              <span class="part-value module">{{ getCodeModule(permissionData.code) }}</span>
            </div>
            <div class="code-separator">:</div>
            <div class="code-part">
              <span class="part-label">操作:</span>
              <span class="part-value action">{{ getCodeAction(permissionData.code) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="权限数据不存在" :image-size="120" />

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="handleClose"> 关闭 </el-button>
        <el-button type="primary" size="large" @click="handleCopyCode" :disabled="!permissionData">
          复制编码
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Key,
  Position,
  Collection,
  DataAnalysis,
  User,
  Setting,
  Document,
  View,
  DataAnalysis as DataAnalysisIcon,
  Menu as MenuIcon,
  Operation as OperationIcon,
  Connection as ConnectionIcon,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import type { Permission } from '@/types/permission'
import {
  PERMISSION_TYPE_LABELS,
  PERMISSION_MODULE_LABELS,
  PERMISSION_STATUS_LABELS,
  PermissionType,
  PermissionModule,
  PermissionStatus,
} from '@/types/permission'

interface Props {
  modelValue: boolean
  permissionData: Permission | null
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

// 获取状态图标
const getStatusIcon = (status: PermissionStatus) => {
  switch (status) {
    case PermissionStatus.ACTIVE:
      return SuccessFilled
    case PermissionStatus.INACTIVE:
      return WarningFilled
    default:
      return undefined
  }
}

// 获取类型图标
const getTypeIcon = (type: PermissionType) => {
  switch (type) {
    case PermissionType.MENU:
      return MenuIcon
    case PermissionType.BUTTON:
      return OperationIcon
    case PermissionType.API:
      return ConnectionIcon
    default:
      return Key
  }
}

// 获取模块图标
const getModuleIcon = (module: PermissionModule) => {
  switch (module) {
    case PermissionModule.USER_MANAGE:
    case PermissionModule.ROLE_MANAGE:
      return User
    case PermissionModule.SYSTEM_CONFIG:
    case PermissionModule.CONTENT_MANAGE:
      return Setting
    case PermissionModule.DATA_EXPORT:
      return DataAnalysisIcon
    case PermissionModule.LOG_VIEW:
      return View
    default:
      return Document
  }
}

// 获取编码模块部分
const getCodeModule = (code: string) => {
  const [module] = code.split(':')
  return module || 'unknown'
}

// 获取编码操作部分
const getCodeAction = (code: string) => {
  const [, action] = code.split(':')
  return action || 'unknown'
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

// 处理复制编码
const handleCopyCode = async () => {
  if (!props.permissionData) return

  try {
    await navigator.clipboard.writeText(props.permissionData.code)
    ElMessage.success('权限编码已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.permission-detail {
  padding: 0;
}

.detail-section {
  margin-bottom: 24px;
}

.permission-name,
.permission-code,
.permission-module {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.type-tag {
  font-size: 12px;
}

.features-section {
  margin-bottom: 24px;
}

.analysis-section {
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

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--el-color-primary);
  color: white;
  font-size: 18px;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.feature-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.code-analysis {
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.code-display {
  text-align: center;
  margin-bottom: 16px;
}

.code-display code {
  font-size: 16px;
  padding: 8px 16px;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color);
}

.code-breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.code-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.part-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.part-value {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
}

.part-value.module {
  color: var(--el-color-primary);
}

.part-value.action {
  color: var(--el-color-success);
}

.code-separator {
  font-size: 20px;
  font-weight: bold;
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  .code-breakdown {
    flex-direction: column;
    gap: 12px;
  }

  .code-separator {
    transform: rotate(90deg);
  }

  .feature-card {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .feature-icon {
    margin-bottom: 4px;
  }
}

/* 卡片悬浮效果 */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-success));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px 8px 0 0;
}

.feature-card:hover::before {
  opacity: 1;
}
</style>
