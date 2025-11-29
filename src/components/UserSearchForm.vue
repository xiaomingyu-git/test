<!--
  用户搜索表单组件
  遵循 Element Plus 内联表单布局
-->
<template>
  <div class="search-form">
    <el-form
      ref="formRef"
      :model="modelValue"
      :inline="!isMobile"
      :label-position="isMobile ? 'top' : 'right'"
      @submit.prevent="handleSubmit"
    >
      <el-row :gutter="16">
        <!-- 固定宽度布局 -->
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="关键词">
            <el-input
              v-model="localModel.keyword"
              placeholder="用户名/邮箱/手机号"
              clearable
              style="width: 200px"
              @clear="handleSubmit"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="角色">
            <el-select
              v-model="localModel.role"
              placeholder="全部角色"
              clearable
              style="width: 200px"
              @change="handleSubmit"
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

        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="状态">
            <el-select
              v-model="localModel.status"
              placeholder="全部状态"
              clearable
              style="width: 200px"
              @change="handleSubmit"
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

        <!-- 操作按钮 -->
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading" :icon="Search">
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { SearchForm, RoleOption, StatusOption } from '@/types/user'

interface Props {
  modelValue: SearchForm
  loading?: boolean
  roleOptions: RoleOption[]
  statusOptions: StatusOption[]
}

interface Emits {
  (e: 'update:modelValue', value: SearchForm): void
  (e: 'search'): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// 响应式断点
const screenWidth = ref(window.innerWidth)
const formRef = ref<FormInstance>()

const isMobile = computed(() => screenWidth.value < 768)

// 使用计算属性避免深度响应和循环更新
const localModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 窗口大小变化监听
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 提交搜索
const handleSubmit = () => {
  emit('search')
}

// 重置表单
const handleReset = () => {
  emit('update:modelValue', {
    keyword: '',
    role: '',
    status: '',
  })
  emit('reset')
}

// 暴露表单引用
defineExpose({
  formRef,
})
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

/* 移动端适配 - 固定宽度在移动端改为100% */
@media (max-width: 768px) {
  .search-form {
    padding: 12px;
  }

  .search-form :deep(.el-input),
  .search-form :deep(.el-select) {
    width: 100% !important;
  }
}
</style>
