# Vue 3 项目重构方案

## 目录结构设计

```
src/
├── components/                    # 通用组件
│   ├── common/                   # 基础通用组件
│   │   ├── AppHeader.vue        # 应用头部
│   │   ├── AppSidebar.vue       # 侧边栏
│   │   ├── AppFooter.vue        # 应用底部
│   │   ├── ThemeToggle.vue      # 主题切换
│   │   └── LoadingSpinner.vue   # 加载组件
│   ├── editor/                   # 编辑器相关组件
│   │   ├── TiptapEditor.vue     # Tiptap编辑器
│   │   ├── TiptapToolbar.vue    # Tiptap工具栏
│   │   ├── TiptapContainer.vue  # Tiptap容器
│   │   ├── WangEditor.vue       # Wang编辑器
│   │   ├── WangToolbar.vue      # Wang工具栏
│   │   └── ImageUploadDialog.vue # 图片上传对话框
│   ├── layout/                   # 布局组件
│   │   ├── DefaultLayout.vue    # 默认布局
│   │   ├── EditorLayout.vue     # 编辑器布局
│   │   └── SimpleLayout.vue     # 简单布局
│   └── ui/                       # UI组件
│       ├── PageHeader.vue       # 页面头部
│       ├── PageContainer.vue    # 页面容器
│       └── FeatureCard.vue      # 功能卡片
├── views/                        # 页面视图
│   ├── home/                    # 首页相关
│   │   └── HomeView.vue
│   ├── editor/                  # 编辑器页面
│   │   ├── TiptapView.vue       # Tiptap编辑器页面
│   │   ├── WangEditorView.vue   # Wang编辑器页面
│   │   └── EditorComparison.vue # 编辑器对比
│   ├── demo/                    # 演示页面
│   │   ├── TableView.vue        # 表格演示
│   │   ├── CardView.vue         # 卡片演示
│   │   └── IntegrationView.vue  # 集成演示
│   └── about/                   # 关于页面
│       └── AboutView.vue
├── layouts/                      # 布局模板
│   ├── DefaultLayout.vue
│   ├── EditorLayout.vue
│   └── SimpleLayout.vue
├── router/                       # 路由配置
│   ├── index.ts                 # 路由主文件
│   ├── guards.ts                # 路由守卫
│   └── routes/                  # 路由模块
│       ├── home.ts
│       ├── editor.ts
│       ├── demo.ts
│       └── about.ts
├── stores/                       # 状态管理
│   ├── theme.ts                 # 主题状态
│   ├── editor.ts                # 编辑器状态
│   └── app.ts                   # 应用状态
├── composables/                  # 组合式函数
│   ├── useTheme.ts              # 主题相关
│   ├── useEditor.ts             # 编辑器相关
│   └── useResponsive.ts         # 响应式相关
├── types/                        # TypeScript类型定义
│   ├── editor.ts                # 编辑器类型
│   ├── theme.ts                 # 主题类型
│   └── common.ts                # 通用类型
├── styles/                       # 样式文件
│   ├── index.scss               # 主样式文件
│   ├── variables.scss           # 变量定义
│   ├── mixins.scss              # 混入
│   ├── layouts/                 # 布局样式
│   ├── components/              # 组件样式
│   └── themes/                  # 主题样式
│       ├── light.scss
│       └── dark.scss
├── utils/                        # 工具函数
│   ├── format.ts                # 格式化工具
│   ├── validation.ts            # 验证工具
│   └── storage.ts               # 存储工具
└── assets/                       # 静态资源
    ├── images/
    ├── icons/
    └── fonts/
```

## 组件命名规范

### 1. 文件命名
- 组件文件使用 PascalCase：`TiptapEditor.vue`
- 页面文件以 `View` 结尾：`TiptapView.vue`
- 布局文件以 `Layout` 结尾：`DefaultLayout.vue`
- 组合式函数以 `use` 开头：`useTheme.ts`

### 2. 组件注册规范
```typescript
// 组件自动注册，遵循以下规范：
// components/common/AppHeader.vue -> <AppHeader />
// components/editor/TiptapEditor.vue -> <TiptapEditor />
```

## 布局系统设计

### 1. 默认布局 (DefaultLayout)
```vue
<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <AppSidebar v-if="showSidebar" />
      <div class="content-area">
        <router-view />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
```

### 2. 编辑器布局 (EditorLayout)
```vue
<template>
  <div class="editor-layout">
    <AppHeader :compact="true" />
    <main class="editor-main">
      <PageHeader :title="title" :subtitle="subtitle" />
      <div class="editor-container">
        <router-view />
      </div>
    </main>
  </div>
</template>
```

### 3. 简单布局 (SimpleLayout)
```vue
<template>
  <div class="simple-layout">
    <main class="simple-main">
      <router-view />
    </main>
  </div>
</template>
```

## 路由结构优化

### 路由分组
```typescript
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: HomeView },
      { path: 'about', component: AboutView }
    ]
  },
  {
    path: '/editor',
    component: EditorLayout,
    children: [
      { path: 'tiptap', component: TiptapView },
      { path: 'wang', component: WangEditorView }
    ]
  },
  {
    path: '/demo',
    component: DefaultLayout,
    children: [
      { path: 'table', component: TableView },
      { path: 'card', component: CardView }
    ]
  }
]
```

## 响应式设计规范

### 断点定义
```scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### 响应式混入
```scss
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

## TypeScript 类型定义

### 编辑器类型
```typescript
export interface EditorConfig {
  placeholder?: string
  height?: string | number
  editable?: boolean
  autofocus?: boolean
  theme?: 'light' | 'dark'
}

export interface EditorEvents {
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'ready': [editor: any]
}
```

## 性能优化策略

1. **组件懒加载**：路由级别的代码分割
2. **组件异步加载**：大型组件使用 `defineAsyncComponent`
3. **图片懒加载**：使用 Intersection Observer
4. **虚拟滚动**：长列表使用虚拟滚动
5. **Tree Shaking**：按需导入 Element Plus 组件

## 开发规范

### 1. Vue 3 Composition API
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'

// 推荐的变量命名
const isLoading: Ref<boolean> = ref(false)
const editorConfig = ref<EditorConfig>({})

// 推荐的计算属性
const hasContent = computed(() => Boolean(content.value))
</script>
```

### 2. Element Plus 使用规范
```typescript
// 按需导入组件
import { ElButton, ElCard, ElMessage } from 'element-plus'
import type { ButtonProps } from 'element-plus'

// 类型安全的事件处理
const handleButtonClick: ButtonProps['onClick'] = () => {
  ElMessage.success('操作成功')
}
```

## 重构实施计划

### 阶段1：目录结构调整
- 创建新的目录结构
- 移动现有文件到对应目录
- 更新导入路径

### 阶段2：布局系统实现
- 创建布局组件
- 更新路由配置
- 实现响应式导航

### 阶段3：组件重构
- 重构编辑器组件
- 提取通用组件
- 优化组件接口

### 阶段4：样式系统优化
- 统一样式变量
- 实现主题系统
- 优化响应式设计

### 阶段5：类型安全和性能优化
- 完善 TypeScript 类型
- 实现代码分割
- 添加错误处理

这个重构方案将显著提高项目的可维护性、可扩展性和开发效率。