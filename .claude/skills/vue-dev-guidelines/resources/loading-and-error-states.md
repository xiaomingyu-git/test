# 加载和错误状态处理

## 加载状态管理

### Element Plus 加载指令

#### 基础加载状态

```vue
<template>
  <div>
    <!-- 全局加载 -->
    <el-button @click="showGlobalLoading">显示全局加载</el-button>

    <!-- 局部加载 -->
    <el-card v-loading="loading" element-loading-text="数据加载中...">
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
      </el-table>
    </el-card>

    <!-- 自定义加载 -->
    <el-card v-loading="loading" :element-loading-text="loadingText">
      <div>卡片内容</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElLoading } from 'element-plus'

const loading = ref(false)
const loadingText = ref('数据加载中...')
const tableData = ref([])

const showGlobalLoading = () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在处理...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  setTimeout(() => {
    loadingInstance.close()
  }, 2000)
}

// 模拟数据加载
const loadData = async () => {
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    tableData.value = [
      { name: '张三', age: 25 },
      { name: '李四', age: 30 }
    ]
  } finally {
    loading.value = false
  }
}
</script>
```

#### 加载状态配置

```vue
<template>
  <el-card
    v-loading="loading"
    :element-loading-text="loadingOptions.text"
    :element-loading-spinner="loadingOptions.spinner"
    :element-loading-background="loadingOptions.background"
    :element-loading-svg="loadingOptions.svg"
    :element-loading-svg-view-box="loadingOptions.svgViewBox"
  >
    <div>自定义加载样式</div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const loadingOptions = ref({
  text: '正在加载数据...',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.8)',
  svg: '',
  svgViewBox: '-10, -10, 50, 50'
})
</script>
```

### 自定义加载组件

```vue
<!-- components/LoadingSpinner.vue -->
<template>
  <div class="loading-container" :class="{ 'full-screen': fullscreen }">
    <div class="loading-content">
      <el-icon :size="size" class="is-loading">
        <Loading />
      </el-icon>
      <p v-if="text" class="loading-text">{{ text }}</p>
      <div v-if="showProgress" class="progress-bar">
        <el-progress :percentage="progress" :show-text="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  text?: string
  size?: number
  fullscreen?: boolean
  showProgress?: boolean
  progress?: number
}

withDefaults(defineProps<Props>(), {
  text: '',
  size: 24,
  fullscreen: false,
  showProgress: false,
  progress: 0
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-container.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.is-loading {
  animation: rotating 2s linear infinite;
  color: var(--el-color-primary);
}

.loading-text {
  margin-top: 12px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.progress-bar {
  width: 200px;
  margin-top: 16px;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
```

---

## 错误状态处理

### Element Plus 错误组件

#### 错误提示

```vue
<template>
  <div class="error-handling-demo">
    <!-- Alert 错误提示 -->
    <el-alert
      v-if="error"
      :title="error.message"
      :type="error.type"
      :closable="false"
      show-icon
      class="mb-4"
    >
      <div>{{ error.details }}</div>
      <template #footer>
        <el-button size="small" @click="retry">重试</el-button>
      </template>
    </el-alert>

    <!-- Notification 错误通知 -->
    <el-button @click="showErrorNotification">显示错误通知</el-button>

    <!-- Message 错误消息 -->
    <el-button @click="showErrorMessage">显示错误消息</el-button>

    <!-- 空状态 -->
    <el-empty v-if="!data.length && !loading" description="暂无数据">
      <el-button type="primary" @click="loadData">重新加载</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

const loading = ref(false)
const error = ref<Error | null>(null)
const data = ref([])

const showErrorNotification = () => {
  ElNotification.error({
    title: '操作失败',
    message: '网络连接异常，请检查网络设置',
    duration: 5000
  })
}

const showErrorMessage = () => {
  ElMessage.error('操作失败，请稍后重试')
}

const retry = () => {
  error.value = null
  loadData()
}

const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    // 模拟 API 调用
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟 30% 的失败率
        if (Math.random() > 0.7) {
          reject(new Error('服务器响应超时'))
        } else {
          resolve([
            { id: 1, name: '数据1' },
            { id: 2, name: '数据2' }
          ])
        }
      }, 1000)
    })
    .then((result) => {
      data.value = result
    })
    .catch((err) => {
      error.value = {
        message: '数据加载失败',
        type: 'error',
        details: err.message
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
```

#### 网络错误处理

```vue
<!-- components/NetworkError.vue -->
<template>
  <div class="network-error">
    <el-result
      icon="warning"
      :title="title"
      :sub-title="subtitle"
    >
      <template #extra>
        <el-button type="primary" @click="handleRetry">
          {{ retryText }}
        </el-button>
        <el-button @click="handleRefresh">刷新页面</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  retryText?: string
  onRetry?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '网络错误',
  subtitle: '请检查网络连接，然后重试',
  retryText: '重试'
})

const emit = defineEmits<{
  retry: []
  refresh: []
}>()

const handleRetry = () => {
  emit('retry')
  props.onRetry?.()
}

const handleRefresh = () => {
  emit('refresh')
  window.location.reload()
}
</script>

<style scoped>
.network-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
}
</style>
```

---

## 组合函数模式

### 统一的状态管理组合函数

```typescript
// composables/useAsyncState.ts
import { ref, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  success: boolean
}

interface UseAsyncStateOptions {
  successMessage?: string
  errorMessage?: string
  showSuccessNotification?: boolean
  showErrorNotification?: boolean
  autoReset?: boolean
  resetDelay?: number
}

export function useAsyncState<T>(
  options: UseAsyncStateOptions = {}
) {
  const {
    successMessage,
    errorMessage,
    showSuccessNotification = false,
    showErrorNotification = true,
    autoReset = false,
    resetDelay = 3000
  } = options

  const state = ref<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false
  })

  const isLoading = computed(() => state.value.loading)
  const hasError = computed(() => !!state.value.error)
  const hasData = computed(() => !!state.value.data)
  const isSuccess = computed(() => state.value.success)

  const execute = async (asyncFn: () => Promise<T>): Promise<T | null> => {
    state.value.loading = true
    state.value.error = null
    state.value.success = false

    try {
      const result = await asyncFn()
      state.value.data = result
      state.value.success = true

      if (successMessage) {
        if (showSuccessNotification) {
          ElNotification.success({
            title: '操作成功',
            message: successMessage
          })
        } else {
          ElMessage.success(successMessage)
        }
      }

      if (autoReset) {
        setTimeout(reset, resetDelay)
      }

      return result
    } catch (error) {
      state.value.error = error as Error
      state.value.success = false

      const errorMsg = errorMessage || (error as Error).message

      if (showErrorNotification) {
        ElNotification.error({
          title: '操作失败',
          message: errorMsg
        })
      } else {
        ElMessage.error(errorMsg)
      }

      return null
    } finally {
      state.value.loading = false
    }
  }

  const reset = () => {
    state.value.data = null
    state.value.error = null
    state.value.success = false
    state.value.loading = false
  }

  const setLoading = (loading: boolean) => {
    state.value.loading = loading
  }

  const setData = (data: T) => {
    state.value.data = data
  }

  const setError = (error: Error | string) => {
    state.value.error = typeof error === 'string' ? new Error(error) : error
  }

  return {
    // 状态
    state: state.value,
    isLoading,
    hasError,
    hasData,
    isSuccess,

    // 方法
    execute,
    reset,
    setLoading,
    setData,
    setError
  }
}
```


---

## 页面级状态管理

### 完整的页面状态管理

```typescript
// views/products/composables/useProductList.ts
import { ref, reactive, computed } from 'vue'
import { useAsyncState } from '@/composables/useAsyncState'
import { ElMessage } from 'element-plus'
import { getProductList, deleteProduct } from './api'

export function useProductList() {
  // 查询参数
  const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: '',
    category: ''
  })

  // 产品列表状态
  const { state, execute: fetchProducts, reset, setLoading } = useAsyncState({
    successMessage: '产品列表加载成功',
    errorMessage: '产品列表加载失败',
    showSuccessNotification: false,
    showErrorNotification: true
  })

  // 计算属性
  const productList = computed(() => state.data?.data || [])
  const total = computed(() => state.data?.total || 0)
  const isLoading = computed(() => state.loading)
  const hasError = computed(() => !!state.error)

  // 搜索处理
  const handleSearch = (params: Partial<typeof queryParams>) => {
    Object.assign(queryParams, params)
    queryParams.page = 1
    fetchProducts(() => getProductList(queryParams))
  }

  // 分页处理
  const handlePageChange = (page: number, pageSize: number) => {
    queryParams.page = page
    queryParams.pageSize = pageSize
    fetchProducts(() => getProductList(queryParams))
  }

  // 删除产品
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      ElMessage.success('删除成功')
      await fetchProducts(() => getProductList(queryParams))
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  // 刷新数据
  const refresh = () => {
    fetchProducts(() => getProductList(queryParams))
  }

  // 重置状态
  const resetState = () => {
    reset()
    Object.assign(queryParams, {
      page: 1,
      pageSize: 10,
      keyword: '',
      category: ''
    })
  }

  // 手动设置加载状态
  const setCustomLoading = (loading: boolean) => {
    setLoading(loading)
  }

  return {
    // 状态
    productList,
    total,
    isLoading,
    hasError,
    queryParams,
    error: computed(() => state.error),

    // 方法
    handleSearch,
    handlePageChange,
    handleDelete,
    refresh,
    resetState,
    setCustomLoading
  }
}
```

### 页面组件使用示例

```vue
<!-- views/products/index.vue -->
<template>
  <div class="product-list">
    <!-- 搜索区域 -->
    <el-card class="mb-4">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键词"
            clearable
            @clear="handleSearch({ keyword: '' })"
            @input="handleSearch({ keyword: $event })"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="queryParams.category"
            placeholder="选择分类"
            clearable
            @change="handleSearch({ category: $event })"
          >
            <el-option label="电子产品" value="electronics" />
            <el-option label="服装" value="clothing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 产品列表 -->
    <el-card v-loading="isLoading" element-loading-text="加载产品列表...">
      <!-- 错误状态 -->
      <el-alert
        v-if="hasError"
        :title="error?.message || '加载失败'"
        type="error"
        show-icon
        :closable="false"
        class="mb-4"
      >
        <el-button size="small" @click="refresh">重试</el-button>
      </el-alert>

      <!-- 表格 -->
      <el-table :data="productList" border stripe>
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-if="!isLoading && !productList.length && !hasError"
        description="暂无产品数据"
      >
        <el-button type="primary" @click="refresh">刷新</el-button>
      </el-empty>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductList } from './composables/useProductList'

const {
  productList,
  total,
  isLoading,
  hasError,
  queryParams,
  error,
  handleSearch,
  handlePageChange,
  handleDelete,
  refresh
} = useProductList()

const handleEdit = (product: any) => {
  // 编辑逻辑
  console.log('编辑产品:', product)
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
```


---

## 总结

**加载和错误状态最佳实践：**

✅ **组件级状态管理** - 每个组件管理自己的加载和错误状态
✅ **Element Plus 组件** - 充分利用内置的加载和错误组件
✅ **简洁明了** - 避免复杂的状态管理，保持代码简洁
✅ **独立自治** - 各组件独立管理状态，不依赖全局状态
✅ **用户友好** - 提供清晰的状态反馈和操作选项
✅ **类型安全** - 完整的 TypeScript 类型定义

**相关文档：**
- [data-fetching.md](data-fetching.md) - 数据获取模式
- [component-patterns.md](component-patterns.md) - 组件使用模式
- [typescript-standards.md](typescript-standards.md) - TypeScript 使用规范