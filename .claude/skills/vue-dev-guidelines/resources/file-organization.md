# Vue 项目文件组织

## 项目结构概览

```
src/
├── assets/                  # 静态资源
├── components/              # 公共组件
├── composables/             # 组合函数
├── constants/               # 常量定义
├── layouts/                 # 布局组件
├── router/                  # 路由配置 (如果需要额外配置)
├── stores/                  # Pinia 状态管理
├── styles/                  # 全局样式
├── types/                   # TypeScript 类型定义
├── utils/                   # 工具函数
├── views/                   # 页面组件 + API 接口
├── App.vue                  # 根组件
└── main.ts                  # 应用入口
```

## 详细目录说明

### 1. `/components/` - 公共组件

```
components/
├── common/                  # 通用组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── LoadingSpinner.vue
│   └── PageHeader.vue
├── form/                    # 表单组件
│   ├── BaseInput.vue
│   ├── BaseButton.vue
│   └── BaseSelect.vue
└── ui/                      # UI 组件
    ├── Card.vue
    ├── Modal.vue
    └── Table.vue
```

**命名规范：**
- 基础组件：`Base` 前缀（如 `BaseButton.vue`）
- 功能组件：功能名称（如 `UserCard.vue`）
- 页面组件：放在 `views/` 目录

### 3. `/composables/` - 组合函数

```
composables/
├── useAuth.ts               # 认证相关
├── useApi.ts                # API 请求
├── usePagination.ts         # 分页功能
├── useSearch.ts             # 搜索功能
├── useLocalStorage.ts       # 本地存储
└── useDebounce.ts           # 防抖
```

**示例：**
```typescript
// composables/usePagination.ts
import { ref, computed } from 'vue'

export function usePagination<T = any>(fetchFunction: (params: any) => Promise<T>) {
  const page = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const data = ref<T[]>([])
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const fetch = async (extraParams = {}) => {
    loading.value = true
    try {
      const result = await fetchFunction({
        page: page.value,
        pageSize: pageSize.value,
        ...extraParams,
      })
      data.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  const nextPage = () => {
    if (page.value < totalPages.value) {
      page.value++
      fetch()
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      page.value--
      fetch()
    }
  }

  return {
    page,
    pageSize,
    total,
    data,
    loading,
    totalPages,
    fetch,
    nextPage,
    prevPage,
  }
}
```

### 4. `/constants/` - 常量定义

```
constants/
├── api.ts                   # API 相关常量
├── routes.ts                # 路由名称常量
├── storage.ts               # 本地存储键名
└── index.ts                 # 统一导出
```

**示例：**
```typescript
// constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
  },
} as const

// constants/storage.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
} as const
```

### 5. `/stores/` - 状态管理

```
stores/
├── auth.ts                  # 用户认证状态
├── user.ts                  # 用户信息状态
├── app.ts                   # 应用全局状态
└── index.ts                 # 统一导出
```

### 6. `/styles/` - 样式文件

```
styles/
├── main.scss                # 主样式文件
├── variables.scss           # SCSS 变量
├── mixins.scss              # SCSS 混合
├── reset.scss               # 样式重置
└── components/              # 组件样式
    ├── button.scss
    └── form.scss
```

### 7. `/types/` - 类型定义

```
types/
├── api.ts                   # API 响应类型
├── user.ts                  # 用户相关类型
├── common.ts                # 通用类型
├── env.d.ts                 # 环境变量类型
└── index.ts                 # 统一导出
```

**示例：**
```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export interface PaginationResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// types/user.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
```

### 8. `/utils/` - 工具函数

```
utils/
├── apiClient.ts             # API 请求客户端
├── dateHelpers.ts           # 日期处理
├── formatHelpers.ts         # 格式化工具
├── validationHelpers.ts     # 验证工具
├── storageHelpers.ts        # 存储工具
└── index.ts                 # 统一导出
```

**示例：**
```typescript
// utils/dateHelpers.ts
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  // 格式化逻辑
  return d.toISOString().split('T')[0]
}

export const isDateValid = (date: string) => {
  return !isNaN(Date.parse(date))
}

// utils/formatHelpers.ts
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatCurrency = (amount: number, currency = 'CNY') => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

### 9. `/views/` - 页面组件 + API 接口

```
views/
├── index.vue                # 首页
├── about.vue                # 关于页面
├── auth/
│   ├── login.vue            # 登录页面
│   ├── register.vue         # 注册页面
│   ├── api.ts               # 认证相关接口
│   ├── types.ts             # 认证相关类型
│   ├── composables.ts       # 认证组合函数
│   └── constants.ts         # 认证常量
├── users/
│   ├── index.vue            # 用户列表页
│   ├── [id].vue             # 用户详情页
│   ├── create.vue           # 创建用户页
│   ├── api.ts               # 用户相关接口
│   ├── types.ts             # 用户相关类型
│   ├── constants.ts         # 用户常量
│   └── components/          # 用户模块组件
│       ├── UserCard.vue
│       └── UserForm.vue
├── products/
│   ├── index.vue            # 产品列表页
│   ├── [id].vue             # 产品详情页
│   ├── create.vue           # 创建产品页
│   ├── api.ts               # 产品相关接口
│   ├── types.ts             # 产品相关类型
│   └── components/          # 产品模块组件
│       ├── ProductCard.vue
│       └── ProductForm.vue
├── admin/
│   ├── index.vue            # 管理首页
│   ├── settings.vue         # 设置页面
│   ├── api.ts               # 管理相关接口
│   └── types.ts             # 管理相关类型
└── shared/
    ├── components/          # 共享页面组件
    │   ├── PageLayout.vue
    │   └── PageHeader.vue
    └── composables/         # 共享组合函数
        ├── usePageMeta.ts
        └── usePageLoading.ts
```

**页面模块 API 示例：**
```typescript
// views/users/api.ts
import { apiClient } from '@/utils/apiClient'

export const userApi = {
  // 获取用户列表
  getUsers: (params: {
    page?: number
    pageSize?: number
    keyword?: string
  }) => apiClient.get('/users', { params }),

  // 获取用户详情
  getUserById: (id: string) => apiClient.get(`/users/${id}`),

  // 创建用户
  createUser: (data: {
    name: string
    email: string
    role: string
  }) => apiClient.post('/users', data),

  // 更新用户
  updateUser: (id: string, data: Partial<{
    name: string
    email: string
    role: string
  }>) => apiClient.put(`/users/${id}`, data),

  // 删除用户
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),

  // 重置密码
  resetPassword: (id: string) => apiClient.post(`/users/${id}/reset-password`),
}

// views/products/api.ts
export const productApi = {
  getProducts: (params: {
    category?: string
    priceRange?: [number, number]
    page?: number
  }) => apiClient.get('/products', { params }),

  getProductById: (id: string) => apiClient.get(`/products/${id}`),

  createProduct: (data: {
    name: string
    price: number
    category: string
    description: string
  }) => apiClient.post('/products', data),

  updateProduct: (id: string, data: Partial<{
    name: string
    price: number
    category: string
    description: string
  }>) => apiClient.put(`/products/${id}`, data),

  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
}
```

**页面模块类型定义：**
```typescript
// views/users/types.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: 'admin' | 'user' | 'guest'
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: 'admin' | 'user' | 'guest'
  status?: 'active' | 'inactive'
}

export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: string
  status?: string
}

// views/products/types.ts
export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  images: string[]
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: string
  updatedAt: string
}
```

**页面模块常量定义：**
```typescript
// views/users/constants.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export const USER_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// views/products/constants.ts
export const PRODUCT_CATEGORIES = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' },
  { label: '图书', value: 'books' },
]

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
} as const
```

## 文件命名规范

### 组件文件

- **PascalCase**：组件文件名使用 PascalCase
  - `UserProfile.vue`
  - `DataTable.vue`
  - `BaseButton.vue`

### 组合函数文件

- **use 前缀 + camelCase**：组合函数以 `use` 开头，使用 camelCase
  - `useAuth.ts`
  - `useUserData.ts`
  - `useApiRequest.ts`

### 工具函数文件

- **camelCase**：工具函数使用 camelCase
  - `dateHelpers.ts`
  - `formatHelpers.ts`
  - `validationUtils.ts`

### 常量文件

- **camelCase**：常量文件使用 camelCase
  - `apiConstants.ts`
  - `routeNames.ts`
  - `storageKeys.ts`

### 类型文件

- **camelCase**：类型文件使用 camelCase
  - `userTypes.ts`
  - `apiTypes.ts`
  - `commonTypes.ts`

## 导入别名配置

在 `vite.config.ts` 中配置路径别名：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~composables': path.resolve(__dirname, 'src/composables'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~types': path.resolve(__dirname, 'src/types'),
      '~stores': path.resolve(__dirname, 'src/stores'),
      '~constants': path.resolve(__dirname, 'src/constants'),
      '~assets': path.resolve(__dirname, 'src/assets'),
    },
  },
})
```

## 使用示例

### 组件导入

```vue
<template>
  <div>
    <AppHeader />
    <UserCard :user="user" />
    <BaseButton @click="handleSave">保存</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~stores/user'
import { formatDate } from '~utils/dateHelpers'
import { userApi } from './api'
import type { User } from './types'
import { USER_ROLES } from './constants'

const userStore = useUserStore()
const user = ref<User>({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  roles: [USER_ROLES.ADMIN],
})

const handleSave = async () => {
  await userApi.updateUser(user.value.id, {
    name: user.value.name,
    email: user.value.email,
  })
}
</script>
```

### 页面模块组合函数

```typescript
// views/users/composables.ts
import { ref, computed } from 'vue'
import { userApi } from './api'
import type { User, UserListParams } from './types'
import { USER_STATUS, USER_PAGE_SIZE_OPTIONS } from './constants'

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const searchParams = ref<UserListParams>({})

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const fetchUsers = async (params?: Partial<UserListParams>) => {
    loading.value = true
    try {
      searchParams.value = { ...searchParams.value, ...params }
      const response = await userApi.getUsers({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...searchParams.value,
      })
      users.value = response.data
      total.value = response.total
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: {
    name: string
    email: string
    role: string
  }) => {
    return await userApi.createUser(userData)
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    return await userApi.updateUser(id, userData)
  }

  const deleteUser = async (id: string) => {
    return await userApi.deleteUser(id)
  }

  return {
    users,
    loading,
    total,
    currentPage,
    pageSize,
    totalPages,
    searchParams,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
```

### 独立模块 API 复制

**原则：每个页面模块都有自己完整的API、类型和常量，避免跨模块依赖。**

**错误示范 ❌ - 跨模块调用：**
```typescript
// views/admin/index.vue (不推荐)
import { userApi } from '../users/api'  // 跨模块依赖
import { productApi } from '../products/api'  // 跨模块依赖
```

**正确示范 ✅ - 复制到自己的模块：**
```typescript
// views/admin/api.ts
import { apiClient } from '@/utils/apiClient'

// 复制用户相关的API接口
export const userApi = {
  getUsers: (params: {
    page?: number
    pageSize?: number
    keyword?: string
  }) => apiClient.get('/users', { params }),

  getUserById: (id: string) => apiClient.get(`/users/${id}`),

  getUserStats: () => apiClient.get('/users/stats'),
}

// 复制产品相关的API接口
export const productApi = {
  getProducts: (params: {
    category?: string
    page?: number
  }) => apiClient.get('/products', { params }),

  getProductById: (id: string) => apiClient.get(`/products/${id}`),

  getProductStats: () => apiClient.get('/products/stats'),
}

// 管理页面特有的API接口
export const adminApi = {
  getDashboardData: () => apiClient.get('/admin/dashboard'),
  getSystemStats: () => apiClient.get('/admin/stats'),
  getOperationLogs: (params: {
    page?: number
    pageSize?: number
  }) => apiClient.get('/admin/logs', { params }),
}

// views/admin/index.vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { userApi, productApi, adminApi } from './api'

const fetchDashboardData = async () => {
  try {
    const [usersResponse, productsResponse, dashboardResponse] = await Promise.all([
      userApi.getUsers({ pageSize: 5 }),
      productApi.getProducts({ pageSize: 10 }),
      adminApi.getDashboardData()
    ])

    // 处理数据
    console.log('Recent users:', usersResponse.data)
    console.log('Recent products:', productsResponse.data)
    console.log('Dashboard data:', dashboardResponse.data)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
```

**复制类型定义：**
```typescript
// views/admin/types.ts
// 复制用户相关的类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 复制产品相关的类型
export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: string
  updatedAt: string
}

// 管理页面特有的类型
export interface DashboardData {
  userCount: number
  productCount: number
  orderCount: number
  revenue: number
}

export interface SystemStats {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
}

export interface OperationLog {
  id: string
  userId: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}
```

**复制常量定义：**
```typescript
// views/admin/constants.ts
// 复制用户相关的常量
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// 复制产品相关的常量
export const PRODUCT_CATEGORIES = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' },
  { label: '图书', value: 'books' },
]

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  OUT_OF_STOCK: 'out_of_stock',
} as const

// 管理页面特有的常量
export const DASHBOARD_REFRESH_INTERVAL = 30000 // 30秒
export const LOG_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
export const ADMIN_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
} as const
```

## 最佳实践

### 1. 按功能组织

将相关文件放在同一个功能模块下：

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   └── index.ts
│   └── users/
│       ├── components/
│       │   ├── UserCard.vue
│       │   └── UserList.vue
│       ├── composables/
│       │   └── useUsers.ts
│       ├── types/
│       │   └── user.ts
│       └── index.ts
```

### 2. 独立模块统一导出

每个页面模块都应该完全独立，包含自己需要的所有资源：

```typescript
// views/auth/index.ts
export * from './api'
export * from './types'
export * from './constants'
export * from './composables'

// views/users/index.ts
export * from './api'
export * from './types'
export * from './constants'

// views/products/index.ts
export * from './api'
export * from './types'
export * from './constants'

// views/admin/index.ts - 包含从其他模块复制的资源
export * from './api'        // 包含 userApi, productApi, adminApi
export * from './types'      // 包含 User, Product, DashboardData 等
export * from './constants'  // 包含 USER_ROLES, PRODUCT_CATEGORIES 等

// 全局共享资源导出（仅限真正全局使用的）
// composables/index.ts
export * from './useAuth'
export * from './usePagination'
export * from './useLocalStorage'

// types/index.ts
export * from './common'
export * from './global'
export * from './env'

// constants/index.ts
export * from './api'
export * from './storage'
export * from './routes'
export * from './env'
```

### 3. 模块独立性原则

**完全独立的模块：**
```typescript
// views/users/index.ts
// 用户模块只导出用户相关的资源
export * from './api'
export * from './types'
export * from './constants'

// views/products/index.ts
// 产品模块只导出产品相关的资源
export * from './api'
export * from './types'
export * from './constants'

// views/admin/index.ts
// 管理模块导出所有需要的资源（包括复制的）
export * from './api'        // userApi + productApi + adminApi
export * from './types'      // User + Product + DashboardData
export * from './constants'  // 所有相关常量
```

**避免跨模块依赖的好处：**
1. **零依赖风险** - 修改一个模块不会影响其他模块
2. **独立开发** - 团队可以并行开发不同模块
3. **快速构建** - 减少依赖分析时间
4. **易于测试** - 每个模块都可以独立测试
5. **简化部署** - 可以独立部署特定功能模块

### 3. 组件大小控制

- 单个组件文件不超过 300 行
- 复杂组件拆分为多个子组件
- 提取逻辑到 composables

### 4. 索引文件优化

```typescript
// composables/index.ts
export { default as useAuth } from './useAuth'
export { default as useApi } from './useApi'
export { default as usePagination } from './usePagination'

// 或者使用 re-export
export * from './useAuth'
export * from './useApi'
export * from './usePagination'
```

### 5. 环境变量管理

```
src/
├── env.d.ts                 # 环境变量类型定义
└── constants/
    └── env.ts               # 环境常量
```

```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 模块独立性架构详解

### 架构原则

**零依赖架构 (Zero-Dependency Architecture)** 是一种严格的模块化设计方法，每个页面模块都应该是完全独立的。

### 实施策略

#### 1. 模块设计清单

每个页面模块都必须包含：
- ✅ **API接口** (`api.ts`) - 本模块需要的所有接口
- ✅ **类型定义** (`types.ts`) - 本模块需要的所有类型
- ✅ **常量定义** (`constants.ts`) - 本模块需要的所有常量
- ✅ **页面组件** - 本模块的Vue组件
- ✅ **私有组件** (`components/`) - 仅本模块使用的组件
- ✅ **组合函数** (`composables.ts`) - 本模块的业务逻辑

#### 2. 复制策略

**何时复制：**
- 需要使用其他模块的API接口
- 需要使用其他模块的类型定义
- 需要使用其他模块的常量

**如何复制：**
```typescript
// 原模块：views/users/api.ts
export const userApi = {
  getUsers: (params) => apiClient.get('/users', { params }),
  createUser: (data) => apiClient.post('/users', data),
}

// 目标模块：views/admin/api.ts
import { apiClient } from '@/utils/apiClient'

// 复制需要的用户API（可以简化）
export const userApi = {
  // 只复制管理页面需要的方法
  getUsers: (params) => apiClient.get('/users', { params }),
  getUserStats: () => apiClient.get('/users/stats'), // 管理特有方法
}
```

#### 3. 维护策略

**API接口变更时：**
- 修改原模块的API接口
- 检查哪些模块复制了这个接口
- 同步更新所有复制的接口

**类型定义变更时：**
- 修改原模块的类型定义
- 查找所有复制的类型
- 批量更新复制的类型

### 优势与权衡

#### 优势 ✅

1. **零耦合风险**
   - 修改用户模块不会影响管理模块
   - 可以安全地重构或删除任何模块

2. **并行开发**
   - 5个团队可以同时开发5个不同模块
   - 无需协调接口变更

3. **快速构建**
   - 编译器无需分析模块间依赖
   - 热重载更快

4. **独立部署**
   - 可以单独部署某个功能模块
   - 减少部署风险

5. **简单测试**
   - 每个模块可以独立测试
   - Mock更容易实现

#### 权衡 ⚖️

1. **代码重复**
   - 某些接口或类型会被复制多次
   - 增加了一点代码体积

2. **维护成本**
   - 修改公共接口需要更新多个地方
   - 需要建立良好的变更管理流程

3. **学习成本**
   - 开发人员需要理解零依赖原则
   - 需要建立复制而非引用的思维

### 最佳实践建议

#### 1. 建立复制模板

为常用的复制操作建立模板：
```typescript
// templates/api-copy-template.ts
import { apiClient } from '@/utils/apiClient'

// 复制用户API模板
export const userApi = {
  // 基础CRUD
  getUsers: (params) => apiClient.get('/users', { params }),
  getUserById: (id) => apiClient.get(`/users/${id}`),

  // 根据需要添加其他方法
  // getUserStats: () => apiClient.get('/users/stats'),
  // updateUserStatus: (id, status) => apiClient.put(`/users/${id}/status`, { status }),
}
```

#### 2. 文档化复制关系

在模块注释中说明复制关系：
```typescript
// views/admin/api.ts
/*
 * 管理页面API接口
 *
 * 复制的模块：
 * - users: userApi (基础用户操作)
 * - products: productApi (产品基础操作)
 *
 * 原始模块位置：
 * - views/users/api.ts
 * - views/products/api.ts
 */
```

#### 3. 自动化检查

建立自动化工具检查跨模块依赖：
```typescript
// scripts/check-cross-dependencies.js
// 检查是否有跨模块的import语句
// 如果发现，报错并要求复制到目标模块
```

## 注意事项

1. **完全避免跨模块依赖** - 严格禁止模块间的直接导入，需要时复制到自己的模块
2. **保持一致性** - 整个项目使用相同的命名和组织规范
3. **文档更新** - 及时更新文档以反映文件结构变化
4. **代码分割** - 合理进行代码分割，提高加载性能
5. **类型安全** - 充分利用 TypeScript 的类型系统
6. **模块完全独立** - 每个页面模块都必须包含自己需要的所有API、类型和常量
7. **复制而非引用** - 需要其他模块的资源时，复制到自己的模块中
8. **零依赖原则** - 修改一个模块不应该影响其他任何模块
9. **独立测试** - 每个模块都应该可以独立进行单元测试和集成测试
10. **团队协作** - 不同团队成员可以同时开发不同模块，不会产生冲突