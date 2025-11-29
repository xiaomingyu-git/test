# 数据获取指南

## HTTP 客户端配置

### 基于 Axios 的统一请求客户端

```typescript
// utils/request.ts
import router from "@/router"
import yujiaAxios from "@yujia/axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { ElMessage } from "element-plus"
import YUJIA_HEADERS from "./headers-config"

const axios = new yujiaAxios({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  message: ElMessage,
  getExtraHeader: () => YUJIA_HEADERS,
  getRouter: () => router,
})

// request 返回完整的 AxiosResponse 对象，需要通过 response.data 获取实际数据
const request = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
  axios.request(config)

export default request
```

### 环境变量配置

```typescript
// .env.development
VITE_APP_API_BASE_URL=http://localhost:3000/api

// .env.production
VITE_APP_API_BASE_URL=https://api.example.com
```

---

## 重要提示：请求响应处理

### request 方法返回值

**⚠️ 重要说明：项目中的 request 方法返回的是完整的 `AxiosResponse` 对象，而不是直接返回业务数据。**

```typescript
// request 方法返回类型
const request = <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>

// AxiosResponse 对象结构
interface AxiosResponse<T = any> {
  data: T           // 实际业务数据
  status: number     // HTTP状态码
  statusText: string  // 状态文本
  headers: any       // 响应头
  config: any       // 请求配置
}

// 正确的使用方式
const response = await getUserList()
const userData = response.data  // 获取实际数据
const httpStatus = response.status // 获取HTTP状态码
```

### 推荐的处理模式

#### 1. API层面返回完整响应
```typescript
// API 方法返回 AxiosResponse
export const getUserList = (params: QueryParams): Promise<AxiosResponse<QueryResult<User>>> => {
  return request({
    url: "/users",
    method: "get",
    params,
  })
}
```

#### 2. 组合函数层面提取数据
```typescript
const { data: userListData } = useApiRequest(
  async () => {
    const response = await getUserList(queryParams)
    return response.data  // 只返回业务数据
  }
)
```

#### 3. 组件层面使用处理过的数据
```vue
<script setup lang="ts">
import { useUsers } from './composables/useUsers'

const { userList } = useUsers()  // userList 已经是处理过的数据
</script>
```

---

## API 模块化设计

### 按功能模块组织 API

```typescript
// views/users/api.ts
import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface QueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

export interface QueryResult<T> {
  total: number
  success: boolean
  data: T[]
}

// 获取用户列表
export const getUserList = (params: QueryParams): Promise<AxiosResponse<QueryResult<User>>> => {
  return request({
    url: "/users",
    method: "get",
    params,
  })
}

// 获取用户详情
export const getUserDetail = (id: string): Promise<AxiosResponse<User>> => {
  return request({
    url: `/users/${id}`,
    method: "get",
  })
}

// 创建用户
export const createUser = (data: Partial<User>): Promise<AxiosResponse<User>> => {
  return request({
    url: "/users",
    method: "post",
    data,
  })
}

// 更新用户（使用统一保存方法）
export const saveUser = (user: User): Promise<AxiosResponse<User>> => {
  return request({
    method: user.id ? "PUT" : "POST",
    url: user.id ? `/users/${user.id}` : "/users",
    data: user,
  })
}

// 删除用户
export const deleteUser = (id: string): Promise<AxiosResponse<void>> => {
  return request({
    url: `/users/${id}`,
    method: "delete",
  })
}

// 批量操作
export const batchDeleteUsers = (ids: string[]): Promise<AxiosResponse<void>> => {
  return request({
    url: "/users/batch-delete",
    method: "post",
    data: { ids },
  })
}

// 导出用户数据
export const exportUsers = (params: QueryParams): Promise<AxiosResponse<Blob>> => {
  return request({
    url: "/users/export",
    method: "get",
    params,
    responseType: 'blob'
  })
}
```

### 统一的 CRUD 操作模式

```typescript
// views/products/api.ts
import request from '@/utils/request'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  stock: number
  status: 'active' | 'inactive'
}

export interface ProductQueryParams extends QueryParams {
  category?: string
  priceRange?: [number, number]
}

// 统一的查询接口
export const getProductList = (params: ProductQueryParams): Promise<AxiosResponse<QueryResult<Product>>> => {
  return request({
    url: "/products",
    method: "get",
    params,
  })
}

// 统一的保存接口（新增/编辑）
export const saveProduct = (product: Product): Promise<AxiosResponse<Product>> => {
  return request({
    method: product.id ? "PUT" : "POST",
    url: product.id ? `/products/${product.id}` : "/products",
    data: product,
  })
}

// 统一的删除接口
export const deleteProduct = (id: string): Promise<AxiosResponse<void>> => {
  return request({
    method: "DELETE",
    url: `/products/${id}`,
  })
}

// 统一详情接口
export const getProductDetail = (id: string): Promise<AxiosResponse<Product>> => {
  return request({
    url: `/products/${id}`,
    method: "get",
  })
}
```

---

## 组合函数模式

### 使用 useRequest Hook

```typescript
// composables/useApiRequest.ts
import { ref } from 'vue'
import { useRequest } from 'vue-hooks-plus'
import { ElMessage } from 'element-plus'

export interface UseApiRequestOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  showSuccessMessage?: string
  showErrorMessage?: boolean
}

export function useApiRequest<T>(
  requestFn: () => Promise<T>,
  options: UseApiRequestOptions<T> = {}
) {
  const {
    onSuccess,
    onError,
    showSuccessMessage,
    showErrorMessage = true
  } = options

  const { data, loading, run, refresh, error } = useRequest<T>(requestFn, {
    onSuccess: (data) => {
      if (showSuccessMessage) {
        ElMessage.success(showSuccessMessage || '操作成功')
      }
      onSuccess?.(data)
    },
    onError: (error) => {
      if (showErrorMessage) {
        ElMessage.error(error.message || '操作失败')
      }
      onError?.(error)
    }
  })

  return {
    data,
    loading,
    error,
    run,
    refresh
  }
}
```

### 页面级数据获取组合函数

```typescript
// views/users/composables/useUsers.ts
import { ref, reactive } from 'vue'
import { useApiRequest } from '@/composables/useApiRequest'
import { getUserList, deleteUser, type User, type QueryParams } from './api'

export function useUsers() {
  // 查询参数
  const queryParams = reactive<QueryParams>({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: ''
  })

  // 用户列表数据获取
  const { data: userListData, loading, run: fetchUsers } = useApiRequest(
    async () => {
      const response = await getUserList(queryParams)
      return response.data // 返回实际数据而不是response对象
    },
    {
      onError: (error) => {
        console.error('用户列表加载失败:', error)
      }
    }
  )

  // 删除用户
  const { run: deleteUserRun } = useApiRequest(
    async (id: string) => {
      const response = await deleteUser(id)
      return response.data
    },
    {
      showSuccessMessage: '删除成功',
      showErrorMessage: true
    }
  )

  // 方法
  const handleSearch = (params: Partial<QueryParams> = {}) => {
    Object.assign(queryParams, params)
    queryParams.page = 1
    fetchUsers()
  }

  const changePage = (page: number, pageSize?: number) => {
    queryParams.page = page
    if (pageSize) {
      queryParams.pageSize = pageSize
    }
    fetchUsers()
  }

  const handleDelete = (id: string) => {
    deleteUserRun(id).then(() => {
      fetchUsers()
    })
  }

  const refresh = () => {
    fetchUsers()
  }

  return {
    // 数据
    userList: userListData,
    queryParams,
    loading,

    // 方法
    fetchUsers,
    handleSearch,
    changePage,
    handleDelete,
    refresh
  }
}
```

### 通用 CRUD 组合函数

```typescript
// composables/useCrud.ts
import { ref, reactive } from 'vue'
import { useApiRequest } from './useApiRequest'

export interface UseCrudOptions<T> {
  getListFn: (params: any) => Promise<any>
  saveFn: (data: T) => Promise<T>
  deleteFn: (id: string) => Promise<void>
  detailFn?: (id: string) => Promise<T>
}

export function useCrud<T extends { id?: string }>(options: UseCrudOptions<T>) {
  const { getListFn, saveFn, deleteFn, detailFn } = options

  // 列表数据
  const listData = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)

  // 查询参数
  const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: ''
  })

  // 编辑表单数据
  const formData = ref<Partial<T>>({})
  const isEditing = ref(false)
  const isModalVisible = ref(false)

  // 获取列表
  const { run: fetchList } = useApiRequest(
    () => getListFn(queryParams),
    {
      onSuccess: (result) => {
        listData.value = result.data || []
        total.value = result.total || 0
      }
    }
  )

  // 保存数据
  const { run: saveData } = useApiRequest(
    () => saveFn(formData.value as T),
    {
      showSuccessMessage: isEditing.value ? '更新成功' : '创建成功',
      onSuccess: () => {
        isModalVisible.value = false
        resetForm()
        fetchList()
      }
    }
  )

  // 删除数据
  const { run: deleteData } = useApiRequest(
    (id: string) => deleteFn(id),
    {
      showSuccessMessage: '删除成功',
      onSuccess: () => {
        fetchList()
      }
    }
  )

  // 获取详情
  const { run: fetchDetail } = useApiRequest(
    (id: string) => detailFn!(id),
    {
      onSuccess: (data) => {
        formData.value = { ...data }
        isEditing.value = true
        isModalVisible.value = true
      }
    }
  )

  // 新增
  const handleAdd = () => {
    formData.value = {}
    isEditing.value = false
    isModalVisible.value = true
  }

  // 编辑
  const handleEdit = (record: T) => {
    if (detailFn) {
      fetchDetail(record.id!)
    } else {
      formData.value = { ...record }
      isEditing.value = true
      isModalVisible.value = true
    }
  }

  // 删除
  const handleDelete = (record: T) => {
    deleteData(record.id!)
  }

  // 提交表单
  const handleSubmit = () => {
    saveData()
  }

  // 搜索
  const handleSearch = (params: any) => {
    Object.assign(queryParams, params)
    queryParams.page = 1
    fetchList()
  }

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    queryParams.page = page
    queryParams.pageSize = pageSize
    fetchList()
  }

  // 重置表单
  const resetForm = () => {
    formData.value = {}
  }

  // 取消编辑
  const handleCancel = () => {
    isModalVisible.value = false
    resetForm()
  }

  return {
    // 数据
    listData,
    total,
    loading,
    queryParams,
    formData,
    isEditing,
    isModalVisible,

    // 方法
    fetchList,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleSearch,
    handlePageChange,
    handleCancel,
    resetForm
  }
}
```

---

## 并发请求处理

### 并行请求

```typescript
// views/dashboard/composables/useDashboard.ts
import { useApiRequest } from '@/composables/useApiRequest'

export function useDashboard() {
  // 并行获取多个数据源
  const { run: fetchDashboardData } = useApiRequest(
    async () => {
      const [userStats, orderStats, productStats] = await Promise.all([
        getUserStats(),
        getOrderStats(),
        getProductStats()
      ])

      return {
        userStats,
        orderStats,
        productStats
      }
    },
    {
      onError: (error) => {
        console.error('仪表板数据加载失败:', error)
      }
    }
  )

  return {
    fetchDashboardData
  }
}
```

### 请求依赖和顺序

```typescript
// views/orders/composables/useOrders.ts
export function useOrders() {
  // 先获取用户信息，再获取订单列表
  const { run: fetchOrdersWithUser } = useApiRequest(
    async (userId: string) => {
      // 先获取用户详情
      const user = await getUserDetail(userId)

      // 再获取该用户的订单
      const orders = await getUserOrders(userId)

      return {
        user,
        orders
      }
    }
  )

  return {
    fetchOrdersWithUser
  }
}
```

---

## 请求取消

### 组件卸载时取消请求

```typescript
// composables/useRequestWithCancel.ts
import { ref, onUnmounted } from 'vue'
import type { AxiosRequestConfig, Canceler } from 'axios'
import request from '@/utils/request'

export function useRequestWithCancel<T>() {
  const loading = ref(false)
  const data = ref<T>()
  const error = ref<any>()
  let canceler: Canceler | null = null

  const execute = async (config: AxiosRequestConfig) => {
    // 取消之前的请求
    if (canceler) {
      canceler('请求被取消')
    }

    loading.value = true
    error.value = null

    try {
      const result = await request<T>({
        ...config,
        cancelToken: new axios.CancelToken((c) => {
          canceler = c
        })
      })

      data.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
      canceler = null
    }
  }

  // 组件卸载时取消请求
  onUnmounted(() => {
    if (canceler) {
      canceler('组件卸载，请求被取消')
    }
  })

  const cancel = () => {
    if (canceler) {
      canceler('手动取消请求')
      canceler = null
    }
    loading.value = false
  }

  return {
    data,
    loading,
    error,
    execute,
    cancel
  }
}
```

---

## 缓存策略

### 内存缓存

```typescript
// utils/cache.ts
interface CacheItem<T> {
  data: T
  timestamp: number
  expire: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, expire: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expire
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.expire) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const memoryCache = new MemoryCache()

// 使用缓存的请求 hook
export function useCachedRequest<T>(
  key: string,
  requestFn: () => Promise<T>,
  expire: number = 5 * 60 * 1000
) {
  const { data, loading, run, refresh } = useRequest<T>(requestFn)

  const cachedRun = () => {
    // 先检查缓存
    const cachedData = memoryCache.get<T>(key)
    if (cachedData) {
      return Promise.resolve(cachedData)
    }

    // 没有缓存则发起请求
    return run().then(result => {
      memoryCache.set(key, result, expire)
      return result
    })
  }

  return {
    data,
    loading,
    run: cachedRun,
    refresh
  }
}
```

### 请求去重

```typescript
// utils/requestDeduplication.ts
class RequestDeduplication {
  private pendingRequests = new Map<string, Promise<any>>()

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = requestFn()
    this.pendingRequests.set(key, promise)

    try {
      const result = await promise
      return result
    } finally {
      this.pendingRequests.delete(key)
    }
  }
}

export const requestDeduplication = new RequestDeduplication()
```

---

## 总结

**数据获取最佳实践：**

✅ **统一 HTTP 客户端** - 使用配置好的 axios 实例
✅ **模块化 API 设计** - 按功能模块组织 API 接口
✅ **组合函数模式** - 使用可复用的数据获取逻辑
✅ **错误处理** - 全局和组件级双重错误处理
✅ **加载状态管理** - 自动和手动加载状态控制
✅ **并发请求** - 合理使用 Promise.all 处理并行请求
✅ **请求取消** - 避免无效请求和内存泄漏
✅ **缓存策略** - 提升用户体验和应用性能
✅ **类型安全** - 完整的 TypeScript 类型定义

**相关文档：**
- [loading-and-error-states.md](loading-and-error-states.md) - 加载和错误状态处理
- [file-organization.md](file-organization.md) - 文件组织结构
- [typescript-standards.md](typescript-standards.md) - TypeScript 使用规范