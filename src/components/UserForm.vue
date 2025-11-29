<!--
  用户表单组件
  支持新增和编辑模式
-->
<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form
      ref="formRef"
      :model="modelValue"
      :rules="rules"
      label-width="80px"
      @submit.prevent="handleSubmit"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="localModel.username"
              placeholder="请输入用户名"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="localModel.email"
              type="email"
              placeholder="请输入邮箱"
              maxlength="50"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="localModel.phone"
              placeholder="请输入手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="localModel.role"
              placeholder="请选择角色"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="option in roleOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="localModel.status"
              placeholder="请选择状态"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 新增时显示密码字段 -->
      <template v-if="isCreateMode">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="localModel.password"
                type="password"
                placeholder="请输入密码"
                maxlength="20"
                show-password
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="localModel.confirmPassword"
                type="password"
                placeholder="请确认密码"
                maxlength="20"
                show-password
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit" native-type="submit">
          {{ isCreateMode ? '创 建' : '保 存' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormData, RoleOption, StatusOption, EditMode } from '@/types/user'

interface Props {
  modelValue: FormData
  visible: boolean
  mode: EditMode
  submitting?: boolean
  roleOptions: RoleOption[]
  statusOptions: StatusOption[]
}

interface Emits {
  (e: 'update:modelValue', value: FormData): void
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

// 计算属性
const title = computed(() => (props.mode === 'create' ? '新增用户' : '编辑用户'))
const isCreateMode = computed(() => props.mode === 'create')

// 使用计算属性避免深度响应和循环更新
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 监听弹窗显示状态，重置表单验证
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
)

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== localModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit')
  } catch (error) {
    console.warn('表单验证失败:', error)
  }
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
}

// 关闭弹窗
const handleClose = (done: () => void) => {
  if (props.submitting) {
    return
  }
  done()
}

// 暴露表单引用
defineExpose({
  formRef,
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

/* 响应式适配 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  :deep(.el-row) {
    margin: 0 !important;
  }

  :deep(.el-col) {
    padding: 0 !important;
    margin-bottom: 16px;
  }

  :deep(.el-col:last-child) {
    margin-bottom: 0;
  }
}
</style>
