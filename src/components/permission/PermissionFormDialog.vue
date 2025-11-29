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
      label-width="100px"
      label-position="left"
      :disabled="loading"
    >
      <!-- 权限名称 -->
      <el-form-item label="权限名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入权限名称"
          maxlength="50"
          show-word-limit
          clearable
        >
          <template #prefix>
            <el-icon><Key /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 权限编码 -->
      <el-form-item label="权限编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入权限编码，格式：module:action"
          maxlength="50"
          show-word-limit
          clearable
        >
          <template #prefix>
            <el-icon><Position /></el-icon>
          </template>
        </el-input>
        <div class="form-tip">示例：user:view, role:manage, system:config</div>
      </el-form-item>

      <!-- 权限描述 -->
      <el-form-item label="权限描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入权限描述信息"
          maxlength="200"
          show-word-limit
          resize="vertical"
        />
      </el-form-item>

      <!-- 权限类型 -->
      <el-form-item label="权限类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio
            v-for="option in permissionTypeOptions"
            :key="option.value"
            :label="option.value"
          >
            <el-tag :type="option.type" size="small" effect="light">
              {{ option.label }}
            </el-tag>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 所属模块 -->
      <el-form-item label="所属模块" prop="module">
        <el-select v-model="formData.module" placeholder="请选择所属模块" style="width: 100%">
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

      <!-- 权限状态 -->
      <el-form-item label="权限状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="option in permissionStatusOptions"
            :key="option.value"
            :label="option.value"
          >
            <el-tag :type="option.type" size="small" effect="light">
              {{ option.label }}
            </el-tag>
          </el-radio>
        </el-radio-group>
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
import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Key, Position, User, Setting, Document, DataAnalysis, View } from '@element-plus/icons-vue'
import type { Permission, PermissionFormData } from '@/types/permission'
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
  isEdit: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: PermissionFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()

// 对话框显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 对话框标题
const dialogTitle = computed(() => {
  return props.isEdit ? '编辑权限' : '新增权限'
})

// 表单数据
const formData = reactive<PermissionFormData>({
  name: '',
  code: '',
  description: '',
  type: PermissionType.BUTTON,
  module: PermissionModule.USER_MANAGE,
  status: PermissionStatus.ACTIVE,
})

// 表单验证规则
const formRules = reactive<FormRules<PermissionFormData>>({
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 50, message: '权限名称长度在 2 到 50 个字符', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s]+$/,
      message: '权限名称只能包含中文、英文、数字、下划线、连字符和空格',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    { min: 3, max: 50, message: '权限编码长度在 3 到 50 个字符', trigger: 'blur' },
    {
      pattern: /^[a-z_]+:[a-z_]+$/,
      message: '权限编码格式错误，应为 module:action 格式，只能包含小写字母和下划线',
      trigger: 'blur',
    },
  ],
  description: [{ max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
  module: [{ required: true, message: '请选择所属模块', trigger: 'change' }],
  status: [{ required: true, message: '请选择权限状态', trigger: 'change' }],
})

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
    code: '',
    description: '',
    type: PermissionType.BUTTON,
    module: PermissionModule.USER_MANAGE,
    status: PermissionStatus.ACTIVE,
  })

  // 重置表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 初始化表单数据
const initFormData = () => {
  if (props.isEdit && props.permissionData) {
    Object.assign(formData, {
      name: props.permissionData.name,
      code: props.permissionData.code,
      description: props.permissionData.description || '',
      type: props.permissionData.type,
      module: props.permissionData.module,
      status: props.permissionData.status,
    })
  } else {
    Object.assign(formData, {
      name: '',
      code: '',
      description: '',
      type: PermissionType.BUTTON,
      module: PermissionModule.USER_MANAGE,
      status: PermissionStatus.ACTIVE,
    })
  }
}

// 监听权限数据变化
watch(
  () => props.permissionData,
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
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.form-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

/* 表单项间距调整 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
  resize: vertical;
}

/* 单选框组样式 */
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-radio) {
  margin-right: 0;
  margin-bottom: 8px;
}

/* 选择器样式 */
:deep(.el-select) {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  :deep(.el-radio-group) {
    flex-direction: column;
  }

  :deep(.el-radio) {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
