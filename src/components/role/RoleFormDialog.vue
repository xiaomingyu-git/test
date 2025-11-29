<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="!loading"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="left"
      :disabled="loading"
    >
      <!-- 角色名称 -->
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入角色名称"
          maxlength="50"
          show-word-limit
          clearable
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 角色描述 -->
      <el-form-item label="角色描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述信息"
          maxlength="200"
          show-word-limit
          resize="vertical"
        />
      </el-form-item>

      <!-- 角色状态 -->
      <el-form-item label="角色状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="option in statusOptions" :key="option.value" :label="option.value">
            <el-tag :type="option.type" size="small" effect="light">
              {{ option.label }}
            </el-tag>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 权限配置 -->
      <el-form-item label="权限配置" prop="permissions">
        <div class="permissions-section">
          <!-- 全选/取消全选 -->
          <div class="permissions-header">
            <el-checkbox
              v-model="allPermissionsSelected"
              :indeterminate="isIndeterminate"
              @change="handleToggleAll"
            >
              全选权限
            </el-checkbox>
            <el-text type="info" size="small">
              已选择 {{ formData.permissions.length }} 项权限
            </el-text>
          </div>

          <!-- 权限分组 -->
          <div class="permissions-groups">
            <div v-for="group in permissionGroups" :key="group.category" class="permission-group">
              <!-- 分组标题 -->
              <div class="group-header">
                <el-checkbox
                  v-model="group.selected"
                  :indeterminate="group.indeterminate"
                  @change="handleGroupToggle(group)"
                >
                  <div class="group-title">
                    <el-icon :class="group.icon">
                      <component :is="group.icon" />
                    </el-icon>
                    <span>{{ group.label }}</span>
                    <el-text type="info" size="small" class="group-count">
                      ({{ group.permissions.length }})
                    </el-text>
                  </div>
                </el-checkbox>
              </div>

              <!-- 权限列表 -->
              <div class="group-content">
                <el-space :size="8" wrap>
                  <el-checkbox
                    v-for="permission in group.permissions"
                    :key="permission.value"
                    v-model="permission.selected"
                    @change="handlePermissionChange"
                  >
                    <div class="permission-item">
                      <span class="permission-name">{{ permission.label }}</span>
                      <el-text
                        v-if="permission.description"
                        type="info"
                        size="small"
                        class="permission-desc"
                      >
                        {{ permission.description }}
                      </el-text>
                    </div>
                  </el-checkbox>
                </el-space>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="handleCancel" :disabled="loading"> 取消 </el-button>
        <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, UserFilled, Document, Setting } from '@element-plus/icons-vue'
import type { Role, RoleFormData, Permission } from '@/types/role'
import { RoleStatus } from '@/types/role'
import { getPermissionOptions } from '@/api/role'

interface Props {
  modelValue: boolean
  roleData: Role | null
  isEdit: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: RoleFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const permissionOptions = ref<Array<{ label: string; value: string }>>([])

// 对话框显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 对话框标题
const dialogTitle = computed(() => {
  return props.isEdit ? '编辑角色' : '新增角色'
})

// 表单数据
const formData = reactive<RoleFormData>({
  name: '',
  description: '',
  permissions: [],
  status: RoleStatus.ACTIVE,
})

// 表单验证规则
const formRules = reactive<FormRules<RoleFormData>>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '角色名称长度在 2 到 50 个字符', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/,
      message: '角色名称只能包含中文、英文、数字、下划线、连字符和空格',
      trigger: 'blur',
    },
  ],
  description: [{ max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }],
  permissions: [
    { required: true, type: 'array', min: 1, message: '请至少选择一个权限', trigger: 'change' },
  ],
  status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
})

// 状态选项
const statusOptions = [
  {
    label: '启用',
    value: RoleStatus.ACTIVE,
    type: 'success',
  },
  {
    label: '禁用',
    value: RoleStatus.INACTIVE,
    type: 'danger',
  },
]

// 权限分组
const permissionGroups = computed(() => {
  const groups = [
    {
      category: 'user',
      label: '用户管理',
      icon: UserFilled,
      permissions: [] as Array<{
        value: string
        label: string
        description?: string
        selected: boolean
      }>,
      selected: false,
      indeterminate: false,
    },
    {
      category: 'role',
      label: '角色管理',
      icon: User,
      permissions: [] as Array<{
        value: string
        label: string
        description?: string
        selected: boolean
      }>,
      selected: false,
      indeterminate: false,
    },
    {
      category: 'content',
      label: '内容管理',
      icon: Document,
      permissions: [] as Array<{
        value: string
        label: string
        description?: string
        selected: boolean
      }>,
      selected: false,
      indeterminate: false,
    },
    {
      category: 'system',
      label: '系统管理',
      icon: Setting,
      permissions: [] as Array<{
        value: string
        label: string
        description?: string
        selected: boolean
      }>,
      selected: false,
      indeterminate: false,
    },
  ]

  // 将权限按类别分组
  permissionOptions.value.forEach((permission) => {
    const [category] = permission.value.split(':')
    const group = groups.find((g) => g.category === category)

    const permissionItem = {
      value: permission.value,
      label: permission.label,
      description: getPermissionDescription(permission.value),
      selected: formData.permissions.includes(permission.value as Permission),
    }

    if (group) {
      group.permissions.push(permissionItem)
    } else {
      // 如果没有对应的分组，添加到系统管理
      const systemGroup = groups.find((g) => g.category === 'system')
      if (systemGroup) {
        systemGroup.permissions.push(permissionItem)
      }
    }
  })

  // 计算每个分组的选择状态
  groups.forEach((group) => {
    const selectedCount = group.permissions.filter((p) => p.selected).length
    group.selected = selectedCount === group.permissions.length && selectedCount > 0
    group.indeterminate = selectedCount > 0 && selectedCount < group.permissions.length
  })

  return groups
})

// 全选状态
const allPermissionsSelected = computed(() => {
  const allPermissions = permissionGroups.value.flatMap((g) => g.permissions)
  return allPermissions.length > 0 && allPermissions.every((p) => p.selected)
})

// 半选状态
const isIndeterminate = computed(() => {
  const allPermissions = permissionGroups.value.flatMap((g) => g.permissions)
  const selectedCount = allPermissions.filter((p) => p.selected).length
  return selectedCount > 0 && selectedCount < allPermissions.length
})

// 获取权限描述
const getPermissionDescription = (value: string): string => {
  const descriptions: Record<string, string> = {
    'user:manage': '管理用户账户信息',
    'user:view': '查看用户信息',
    'role:manage': '管理角色权限配置',
    'content:edit': '编辑和发布内容',
    'content:view': '查看内容信息',
    'system:config': '管理系统配置',
    'data:export': '导出系统数据',
  }
  return descriptions[value] || ''
}

// 处理全选/取消全选
const handleToggleAll = (checked: boolean) => {
  permissionGroups.value.forEach((group) => {
    group.permissions.forEach((permission) => {
      permission.selected = checked
    })
  })
  updatePermissions()
}

// 处理分组选择
const handleGroupToggle = (group: any) => {
  group.permissions.forEach((permission: any) => {
    permission.selected = group.selected
  })
  updatePermissions()
}

// 处理权限变化
const handlePermissionChange = () => {
  updatePermissions()
}

// 更新表单权限数据
const updatePermissions = () => {
  const selectedPermissions = permissionGroups.value
    .flatMap((g) => g.permissions)
    .filter((p) => p.selected)
    .map((p) => p.value as Permission)

  formData.permissions = selectedPermissions
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...formData })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 处理对话框关闭
const handleClosed = () => {
  // 重置表单
  Object.assign(formData, {
    name: '',
    description: '',
    permissions: [],
    status: RoleStatus.ACTIVE,
  })

  // 重置表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 初始化表单数据
const initFormData = () => {
  if (props.isEdit && props.roleData) {
    Object.assign(formData, {
      name: props.roleData.name,
      description: props.roleData.description || '',
      permissions: [...props.roleData.permissions],
      status: props.roleData.status,
    })
  } else {
    Object.assign(formData, {
      name: '',
      description: '',
      permissions: [],
      status: RoleStatus.ACTIVE,
    })
  }
}

// 监听角色数据变化
watch(
  () => props.roleData,
  () => {
    initFormData()
  },
  { immediate: true },
)

// 监听对话框显示状态
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      initFormData()
    }
  },
)

// 获取权限选项数据
const fetchPermissionOptions = async () => {
  try {
    const response = await getPermissionOptions()
    if (response.success) {
      permissionOptions.value = response.data
    }
  } catch (error) {
    console.error('获取权限选项失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPermissionOptions()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.permissions-section {
  width: 100%;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.permissions-groups {
  max-height: 400px;
  overflow-y: auto;
}

.permission-group {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.permission-group:last-child {
  border-bottom: none;
}

.group-header {
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.group-title .el-icon {
  color: var(--el-color-primary);
}

.group-count {
  color: var(--el-text-color-secondary);
  font-weight: normal;
}

.group-content {
  padding: 16px;
  background: var(--el-bg-color);
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.permission-name {
  font-size: 14px;
  font-weight: 500;
}

.permission-desc {
  font-size: 12px;
  line-height: 1.4;
}

/* 滚动条样式 */
.permissions-groups::-webkit-scrollbar {
  width: 6px;
}

.permissions-groups::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}

.permissions-groups::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 3px;
}

.permissions-groups::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-dark);
}

/* 表单项间距调整 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 复选框样式调整 */
:deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
}

:deep(.el-checkbox-group .el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
  margin-left: 0;
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  resize: vertical;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  .permissions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .group-content {
    padding: 12px;
  }

  :deep(.el-space) {
    display: block;
  }

  :deep(.el-checkbox) {
    display: block;
    margin-bottom: 12px;
  }
}
</style>
