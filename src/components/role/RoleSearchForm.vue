<template>
  <div class="role-search-form">
    <el-form :model="form" :inline="true" class="search-form">
      <el-form-item label="关键词">
        <el-input
          v-model="form.keyword"
          placeholder="角色名称或描述"
          clearable
          :prefix-icon="Search"
          style="width: 240px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择状态" clearable style="width: 150px">
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
            <el-tag :type="option.type" size="small" effect="light">
              {{ option.label }}
            </el-tag>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限">
        <el-select
          v-model="form.permission"
          placeholder="请选择权限"
          clearable
          style="width: 200px"
          filterable
        >
          <el-option-group
            v-for="group in permissionGroups"
            :key="group.category"
            :label="group.label"
          >
            <el-option
              v-for="permission in group.permissions"
              :key="permission.value"
              :label="permission.label"
              :value="permission.value"
            >
              <span>{{ permission.label }}</span>
              <span v-if="permission.description" class="permission-description">
                - {{ permission.description }}
              </span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
        <el-button :icon="RefreshLeft" @click="handleReset"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <!-- 高级搜索折叠面板 -->
    <el-collapse-transition>
      <div v-show="showAdvanced" class="advanced-search">
        <el-divider content-position="left">
          <span class="advanced-title">高级搜索</span>
        </el-divider>
        <el-form :model="form" :inline="true" class="search-form">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
              @change="handleDateChange"
            />
          </el-form-item>

          <el-form-item label="用户数量">
            <el-input-number
              v-model="form.minUserCount"
              :min="0"
              placeholder="最小数量"
              controls-position="right"
              style="width: 120px"
            />
            <span class="range-separator">-</span>
            <el-input-number
              v-model="form.maxUserCount"
              :min="0"
              placeholder="最大数量"
              controls-position="right"
              style="width: 120px"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <!-- 展开/收起高级搜索按钮 -->
    <div class="advanced-toggle">
      <el-button
        text
        type="primary"
        :icon="showAdvanced ? ArrowUp : ArrowDown"
        @click="toggleAdvanced"
      >
        {{ showAdvanced ? '收起' : '展开' }}高级搜索
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Search, RefreshLeft, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { RoleSearchForm } from '@/types/role'
import { RoleStatus } from '@/types/role'
import { getPermissionOptions } from '@/api/role'

interface Props {
  modelValue: RoleSearchForm
}

interface Emits {
  (e: 'update:modelValue', value: RoleSearchForm): void
  (e: 'search'): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const showAdvanced = ref(false)
const dateRange = ref<[string, string] | null>(null)
const permissionOptions = ref<Array<{ label: string; value: string }>>([])

// 表单数据
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 状态选项
const statusOptions = [
  {
    label: '全部',
    value: '',
    type: '',
  },
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
  const groups: Array<{
    category: string
    label: string
    permissions: Array<{
      label: string
      value: string
      description?: string
    }>
  }> = [
    {
      category: 'user',
      label: '用户管理',
      permissions: [],
    },
    {
      category: 'role',
      label: '角色管理',
      permissions: [],
    },
    {
      category: 'content',
      label: '内容管理',
      permissions: [],
    },
    {
      category: 'system',
      label: '系统管理',
      permissions: [],
    },
  ]

  // 将权限按类别分组
  permissionOptions.value.forEach((permission) => {
    const [category] = permission.value.split(':')

    const group = groups.find((g) => g.category === category)
    if (group) {
      group.permissions.push({
        label: permission.label,
        value: permission.value,
        description: getPermissionDescription(permission.value),
      })
    } else {
      // 如果没有对应的分组，添加到系统管理
      const systemGroup = groups.find((g) => g.category === 'system')
      if (systemGroup) {
        systemGroup.permissions.push({
          label: permission.label,
          value: permission.value,
          description: getPermissionDescription(permission.value),
        })
      }
    }
  })

  // 移除空分组
  return groups.filter((group) => group.permissions.length > 0)
})

// 获取权限描述
const getPermissionDescription = (value: string): string => {
  const descriptions: Record<string, string> = {
    'user:manage': '管理用户账户',
    'user:view': '查看用户信息',
    'role:manage': '管理角色权限',
    'content:edit': '编辑内容',
    'content:view': '查看内容',
    'system:config': '系统配置管理',
    'data:export': '导出数据',
  }
  return descriptions[value] || ''
}

// 切换高级搜索显示状态
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// 处理搜索
const handleSearch = () => {
  emit('search')
}

// 处理重置
const handleReset = () => {
  // 重置表单数据
  Object.assign(form.value, {
    keyword: '',
    status: '',
    permission: '',
    startDate: undefined,
    endDate: undefined,
    minUserCount: undefined,
    maxUserCount: undefined,
  })

  // 重置日期范围
  dateRange.value = null

  emit('reset')
}

// 处理日期范围变化
const handleDateChange = (dates: [string, string] | null) => {
  if (dates) {
    form.value.startDate = dates[0]
    form.value.endDate = dates[1]
  } else {
    form.value.startDate = undefined
    form.value.endDate = undefined
  }
}

// 监听表单数据变化
watch(
  () => props.modelValue,
  (newValue) => {
    // 同步日期范围选择器
    if (newValue.startDate && newValue.endDate) {
      dateRange.value = [newValue.startDate, newValue.endDate]
    } else {
      dateRange.value = null
    }
  },
  { immediate: true },
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
.role-search-form {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 20px;
}

.search-form :deep(.el-form-item:last-child) {
  margin-right: 0;
}

.permission-description {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.advanced-search {
  margin-top: 20px;
  padding-top: 20px;
}

.advanced-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.range-separator {
  margin: 0 8px;
  color: var(--el-text-color-regular);
}

.advanced-toggle {
  margin-top: 16px;
  text-align: center;
}

.advanced-toggle :deep(.el-button) {
  padding: 8px 16px;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-form :deep(.el-form-item) {
    margin-right: 16px;
  }
}

@media (max-width: 768px) {
  .role-search-form {
    padding: 16px;
  }

  .search-form {
    display: block;
  }

  .search-form :deep(.el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .search-form :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }

  .search-form :deep(.el-input),
  .search-form :deep(.el-select) {
    width: 100% !important;
  }

  .range-separator {
    display: block;
    text-align: center;
    margin: 8px 0;
  }
}
</style>
