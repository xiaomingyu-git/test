# Vue Router with unplugin-vue-router

## unplugin-vue-router Overview

unplugin-vue-router 是一个基于文件系统的路由插件，它会自动根据 Vue 组件文件生成路由配置。无需手动定义路由，创建页面文件即可自动生成对应的路由。

## 文件路由约定

### 基本路由结构

```
src/views/
├── index.vue                 # 首页 (/)
├── about.vue                 # 关于页面 (/about)
├── login.vue                 # 登录页面 (/login)
├── users/
│   ├── index.vue            # 用户列表页 (/users)
│   ├── [id].vue             # 用户详情页 (/users/:id)
│   └── profile.vue          # 用户资料页 (/users/profile)
├── admin/
│   ├── index.vue            # 管理后台首页 (/admin)
│   ├── dashboard.vue        # 仪表板 (/admin/dashboard)
│   └── settings.vue         # 设置页面 (/admin/settings)
└── [...all].vue             # 404页面 (/*)
```

### 路由命名规则

| 文件路径 | 路由路径 | 路由名称 |
|---------|---------|---------|
| `index.vue` | `/` | `index` |
| `about.vue` | `/about` | `about` |
| `users/index.vue` | `/users` | `users` |
| `users/[id].vue` | `/users/:id` | `users-id` |
| `users/[...all].vue` | `/users/*` | `users-all` |
| `admin/[...settings].vue` | `/admin/*settings` | `admin-settings` |

## 路由元数据

### Frontmatter 配置

```vue
<template>
  <div>
    <h1>关于我们</h1>
    <p>这是关于页面</p>
  </div>
</template>

<script setup lang="ts">
// 无需导入，unplugin-vue-router 自动提供
</script>

<route lang="yaml">
meta:
  title: 关于我们
  description: 公司介绍页面
  requiresAuth: false
  layout: default
  breadcrumb: 关于
  transition: fade
</route>
```

### TypeScript Frontmatter

```vue
<route lang="yaml">
meta:
  title: 用户详情
  requiresAuth: true
  roles: [admin, user]
  layout: dashboard
</route>
```

## 动态路由

### 参数路由

```vue
<!-- src/views/users/[id].vue -->
<template>
  <div>
    <h1>用户 {{ $route.params.id }}</h1>
    <p>用户详细信息</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = computed(() => route.params.id as string)
</script>
```

### 可选参数路由

```vue
<!-- src/views/posts/[slug]/[version].vue -->
<template>
  <div>
    <h1>文章: {{ $route.params.slug }}</h1>
    <p v-if="$route.params.version">版本: {{ $route.params.version }}</p>
  </div>
</template>
```

### 捕获所有路由

```vue
<!-- src/views/[...all].vue - 404页面 -->
<template>
  <div>
    <h1>404 - 页面未找到</h1>
    <p>路径: {{ $route.path }}</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>
```

## 路由导航

### 程序化导航

```vue
<template>
  <div>
    <button @click="goHome">返回首页</button>
    <button @click="goToUser(123)">查看用户123</button>
    <router-link to="/about">关于我们</router-link>
    <router-link :to="{ name: 'users-id', params: { id: 123 } }">
      用户123
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 基本导航
const goHome = () => {
  router.push('/')
}

// 带参数导航
const goToUser = (userId: number) => {
  router.push({
    name: 'users-id',
    params: { id: userId }
  })
}

// 查询参数导航
const searchProducts = (query: string) => {
  router.push({
    path: '/search',
    query: { q: query, page: 1 }
  })
}

// 替换当前路由
const replaceRoute = () => {
  router.replace('/new-route')
}

// 历史导航
const goBack = () => {
  router.back()
}

// 访问当前路由信息
const currentPath = computed(() => route.path)
const currentParams = computed(() => route.params)
const currentQuery = computed(() => route.query)
</script>
```

### 路由守卫

```vue
<template>
  <div>
    <h2>编辑产品</h2>
    <div v-if="isLoading">加载中...</div>
    <ProductForm v-else :product="product" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const isLoading = ref(true)
const hasUnsavedChanges = ref(false)

// 加载产品数据
const loadProduct = async (productId: string) => {
  // 加载逻辑
}

onMounted(() => {
  loadProduct(route.params.id as string)
})

// 离开路由守卫
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const confirmed = confirm('有未保存的更改，确定要离开吗？')
    next(confirmed)
  } else {
    next()
  }
})

const handleSave = async (formData: any) => {
  await saveProduct(formData)
  hasUnsavedChanges.value = false
  router.push({ name: 'users-id', params: { id: product.value.id } })
}
</script>
```

## 高级模式

### 路由组合函数

```typescript
// src/composables/useNavigation.ts
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export function useNavigation() {
  const route = useRoute()
  const router = useRouter()

  const isActive = (path: string) => {
    return route.path === path
  }

  const isPartialActive = (path: string) => {
    return route.path.startsWith(path)
  }

  const navigateWithLoading = async (to: any) => {
    // 显示加载状态
    try {
      await router.push(to)
    } finally {
      // 隐藏加载状态
    }
  }

  return {
    route,
    router,
    isActive,
    isPartialActive,
    navigateWithLoading,
  }
}
```

### 面包屑导航

```vue
<template>
  <nav class="breadcrumb">
    <router-link to="/">首页</router-link>
    <span v-for="(item, index) in breadcrumbs" :key="index">
      <span class="separator">/</span>
      <router-link v-if="item.to" :to="item.to">
        {{ item.name }}
      </router-link>
      <span v-else>{{ item.name }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  name: string
  to?: string
}

const route = useRoute()

const breadcrumbs = computed((): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = []

  // 根据路由生成面包屑
  if (route.path.startsWith('/users')) {
    crumbs.push({ name: '用户', to: '/users' })

    if (route.params.id) {
      crumbs.push({ name: '用户详情' })
    }
  }

  if (route.path.startsWith('/admin')) {
    crumbs.push({ name: '管理后台', to: '/admin' })
  }

  return crumbs
})
</script>
```

## 布局系统

### 布局组件

```vue
<!-- src/layouts/default.vue -->
<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 布局组件逻辑
</script>
```

```vue
<!-- src/layouts/auth.vue -->
<template>
  <div class="auth-layout">
    <div class="auth-container">
      <RouterView />
    </div>
  </div>
</template>
```

### 布局切换

```vue
<!-- src/App.vue -->
<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/default.vue'
import AuthLayout from './layouts/auth.vue'
import AdminLayout from './layouts/admin.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta.layout || 'default'

  const layouts = {
    default: DefaultLayout,
    auth: AuthLayout,
    admin: AdminLayout,
  }

  return layouts[layoutName as keyof typeof layouts] || DefaultLayout
})
</script>
```

## 路由配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    vue(),
    VueRouter({
      routesFolder: 'src/views',
      extensions: ['.vue'],
      importMode: 'async',
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### 路由类型定义

```typescript
// src/types/router.d.ts
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    description?: string
    requiresAuth?: boolean
    roles?: string[]
    layout?: string
    breadcrumb?: string
    transition?: string
  }
}
```

## 最佳实践

### 1. 文件组织

```
src/views/
├── [feature]/
│   ├── index.vue          # 列表页
│   ├── [id].vue          # 详情页
│   ├── create.vue        # 创建页
│   ├── [id]/edit.vue     # 编辑页
│   └── components/       # 功能相关组件
│       ├── ItemCard.vue
│       └── SearchForm.vue
└── shared/
    ├── components/       # 共享组件
    │   ├── PageHeader.vue
    │   └── LoadingSpinner.vue
    └── composables/      # 共享组合函数
        ├── usePagination.ts
        └── useSearch.ts
```

### 2. 路由常量

```typescript
// src/constants/routes.ts
export const ROUTE_NAMES = {
  HOME: 'index',
  ABOUT: 'about',
  USERS: 'users',
  USER_DETAIL: 'users-id',
  USER_CREATE: 'users-create',
  USER_EDIT: 'users-id-edit',
} as const
```

### 3. 路由守卫设置

```typescript
// src/router/guards.ts
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: any) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - My App`
    }

    // 认证检查
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // 角色权限检查
    if (to.meta.roles && authStore.user) {
      const hasRole = to.meta.roles.some(role =>
        authStore.user.roles.includes(role)
      )
      if (!hasRole) {
        next({ name: 'index' })
        return
      }
    }

    next()
  })
}
```

### 4. 错误处理

```vue
<!-- src/views/error/[...error].vue -->
<template>
  <div class="error-page">
    <h1>{{ errorTitle }}</h1>
    <p>{{ errorMessage }}</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const errorTitle = computed(() => {
  const errorCode = route.params.error as string
  switch (errorCode) {
    case '404': return '页面未找到'
    case '403': return '访问被拒绝'
    case '500': return '服务器错误'
    default: return '发生错误'
  }
})

const errorMessage = computed(() => {
  const errorCode = route.params.error as string
  switch (errorCode) {
    case '404': return '请求的页面不存在'
    case '403': return '您没有权限访问此页面'
    case '500': return '服务器遇到了问题'
    default: return '发生了未知错误'
  }
})
</script>
```

## 注意事项

1. **自动导入**: unplugin-vue-router 会自动导入 `useRouter` 和 `useRoute`，无需手动导入
2. **类型支持**: 启用 `dts: true` 会自动生成类型定义文件
3. **热重载**: 修改路由文件会自动更新路由配置
4. **命名约定**: 文件名直接对应路由名称，遵循 kebab-case 规则
5. **性能优化**: 使用异步加载，按需分割代码