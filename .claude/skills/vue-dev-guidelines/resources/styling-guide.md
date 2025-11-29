# Element Plus 样式指南

> **核心原则：优先使用 Element Plus 原生样式，减少自定义定制**
> 只有非 Element Plus 组件才需要样式覆盖。充分利用框架提供的设计系统和组件样式。

## Element Plus 样式配置

### 基础设置

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗色模式支持

const app = createApp(App)

// 全局配置 - 使用 Element Plus 原生配置
app.use(ElementPlus, {
  size: 'default', // 'large' | 'default' | 'small'
  zIndex: 2000,
})

app.mount('#app')
```

### 🎯 样式使用原则

**1. 优先使用原生样式**
- Element Plus 组件默认样式已经经过设计优化
- 避免不必要的样式覆盖
- 优先使用组件的 props 和内置属性

**2. 最小化自定义**
- 只在必要时覆盖样式
- 使用 CSS 变量进行微调，而不是完全重写
- 保持与 Element Plus 设计语言的一致性

**3. 工具类补充**
- 工具类主要用于布局和非 Element Plus 组件
- 不要用工具类覆盖 Element Plus 组件的核心样式

---

## 主题定制

### ⚠️ 最小化主题定制

> **重要提醒：Element Plus 的默认主题已经经过专业设计优化，建议尽量保持原样**
> 只有品牌色调整等必要情况才进行主题定制

```scss
// styles/theme-variables.scss - 仅在必要时使用
:root {
  /* 品牌色定制 - 只修改必要的颜色 */
  --el-color-primary: #1890ff; /* 根据品牌调整 */

  /* 其他颜色保持 Element Plus 默认值，不要随意修改 */
}

/* 避免过度定制，不要完全重写所有变量 */
```

### 组件样式覆盖原则

**❌ 不推荐的做法：**
- 完全重写 Element Plus 组件样式
- 使用渐变背景等破坏设计一致性的样式
- 覆盖组件的核心交互样式

**✅ 推荐的做法：**
- 使用组件提供的 props 和属性
- 仅微调必要的样式（如间距、边距）
- 保持与 Element Plus 设计语言的一致性

```vue
<!-- ✅ 正确：使用组件属性 -->
<el-button type="primary" size="large" round>
  主要按钮
</el-button>

<el-card shadow="hover" class="custom-margin">
  卡片内容
</el-card>

<!-- ❌ 错误：过度自定义样式 -->
<el-button class="custom-gradient-button">
  按钮内容
</el-button>
```

### 必要时的样式覆盖

如果确实需要覆盖样式，请遵循以下原则：

```scss
// 仅在必要时进行最小化覆盖
.custom-component {
  /* 只调整布局相关的样式 */
  margin: var(--el-margin-medium) 0;

  /* 避免覆盖核心样式如颜色、阴影等 */
  /* 不要这样做： */
  /* background: linear-gradient(...); */
  /* border: none; */
}

/* 如果必须覆盖，使用 CSS 变量而不是固定值 */
.custom-dialog {
  /* ✅ 好的做法：使用变量 */
  border-radius: var(--el-border-radius-base);

  /* ❌ 避免的做法：固定值 */
  /* border-radius: 16px; */
}
```

---

## 暗色模式

### 暗色模式主题变量

```scss
// 暗色模式变量覆盖
.dark {
  /* 文字颜色 */
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-text-color-disabled: #6c6e72;

  /* 边框颜色 */
  --el-border-color: #4c4d4f;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-border-color-extra-light: #2b2b2c;
  --el-border-color-dark: #58585b;
  --el-border-color-darker: #636466;

  /* 填充颜色 */
  --el-fill-color: #303133;
  --el-fill-color-light: #262727;
  --el-fill-color-lighter: #1d1e1f;
  --el-fill-color-extra-light: #191a1a;
  --el-fill-color-dark: #39393a;
  --el-fill-color-darker: #424243;
  --el-fill-color-blank: #1a1a1a;

  /* 背景颜色 */
  --el-bg-color: #141414;
  --el-bg-color-page: #0a0a0a;
  --el-bg-color-overlay: #1d1e1f;

  /* 背景透明度 */
  --el-bg-color-overlay: rgba(0, 0, 0, 0.8);

  /* 禁用颜色 */
  --el-disabled-bg-color: #262727;
  --el-disabled-text-color: #6c6e72;
  --el-disabled-border-color: #4c4d4f;
}
```

### 暗色模式切换工具

```typescript
// utils/theme.ts
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const theme = ref<ThemeMode>('light')

  const toggleTheme = () => {
    const root = document.documentElement

    if (theme.value === 'light') {
      theme.value = 'dark'
      root.classList.add('dark')
    } else {
      theme.value = 'light'
      root.classList.remove('dark')
    }
  }

  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
  }

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
```

---

## 响应式设计

### 断点变量

```scss
// 响应式断点
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// 响应式混合器
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

@mixin respond-below($breakpoint) {
  @media (max-width: map-get($breakpoints, $breakpoint) - 1px) {
    @content;
  }
}

// 使用示例
.responsive-container {
  padding: 16px;

  @include respond-to(md) {
    padding: 24px;
  }

  @include respond-to(lg) {
    padding: 32px;
  }
}

// Element Plus 响应式增强
.el-table {
  @include respond-below(sm) {
    .el-table__body-wrapper {
      overflow-x: auto;
    }
  }
}

.el-form {
  @include respond-below(md) {
    .el-form-item__label {
      float: none;
      display: block;
      text-align: left;
      padding: 0 0 10px 0;
    }

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
```

---

## 工具类使用指南

### 🎯 工具类使用原则

**1. 主要用途**
- **布局辅助**: 用于页面布局、间距调整
- **非Element Plus组件**: 自定义组件的快速样式
- **响应式设计**: 断点相关的样式调整

**2. 使用限制**
- **❌ 不要用于覆盖Element Plus组件核心样式**
- **❌ 不要破坏组件的原生交互和外观**
- **✅ 主要用于布局间距、位置等辅助样式**

### 基础布局工具类

```scss
/* 布局相关 - 主要用于容器和布局结构 */
.u-flex { display: flex !important; }
.u-flex-column { flex-direction: column !important; }
.u-flex-wrap { flex-wrap: wrap !important; }
.u-flex-1 { flex: 1 1 0% !important; }

.u-justify-center { justify-content: center !important; }
.u-justify-between { justify-content: space-between !important; }
.u-justify-end { justify-content: flex-end !important; }

.u-items-center { align-items: center !important; }
.u-items-start { align-items: flex-start !important; }
.u-items-end { align-items: flex-end !important; }

/* Element Plus 间距变量 - 推荐使用 */
.u-gap-xs { gap: var(--el-spacing-extra-small) !important; }
.u-gap-sm { gap: var(--el-spacing-small) !important; }
.u-gap-md { gap: var(--el-spacing-medium) !important; }
.u-gap-lg { gap: var(--el-spacing-large) !important; }
```

### Element Plus 变量工具类

```scss
/* 基于 Element Plus 变量的工具类 */
.u-p-xs { padding: var(--el-padding-extra-small) !important; }
.u-p-sm { padding: var(--el-padding-small) !important; }
.u-p-md { padding: var(--el-padding-medium) !important; }
.u-p-lg { padding: var(--el-padding-large) !important; }

.u-m-xs { margin: var(--el-margin-extra-small) !important; }
.u-m-sm { margin: var(--el-margin-small) !important; }
.u-m-md { margin: var(--el-margin-medium) !important; }
.u-m-lg { margin: var(--el-margin-large) !important; }

/* 文本相关 */
.u-text-primary { color: var(--el-text-color-primary) !important; }
.u-text-regular { color: var(--el-text-color-regular) !important; }
.u-text-secondary { color: var(--el-text-color-secondary) !important; }

.u-font-base { font-size: var(--el-font-size-base) !important; }
.u-font-small { font-size: var(--el-font-size-small) !important; }
.u-font-large { font-size: var(--el-font-size-large) !important; }
```

### 使用示例

```vue
<template>
  <!-- ✅ 正确使用：用于布局和间距 -->
  <div class="u-flex u-justify-between u-items-center u-p-lg">
    <h1 class="u-text-primary u-font-large">标题</h1>
    <el-button type="primary">按钮</el-button>
  </div>

  <!-- ✅ 正确使用：自定义容器样式 -->
  <div class="custom-container u-p-md u-bg-fill-lighter u-rounded">
    <el-form>
      <!-- Element Plus 组件保持原样 -->
    </el-form>
  </div>

  <!-- ❌ 错误使用：覆盖 Element Plus 组件核心样式 -->
  <el-button class="u-flex u-justify-center u-bg-primary">
    不要这样做
  </el-button>
</template>

<style scoped>
/* ✅ 正确：自定义容器的样式 */
.custom-container {
  /* 使用 Element Plus 变量保持一致性 */
  border: 1px solid var(--el-border-color-lighter);
}

/* ❌ 错误：覆盖 Element Plus 组件样式 */
.el-button {
  /* 不要覆盖组件的核心样式 */
  /* background: linear-gradient(...); */
  /* border: none; */
}
</style>
```

---

## 性能优化

### 按需导入样式

```typescript
// 按需导入组件和样式
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem
} from 'element-plus'

// 按需导入样式
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'

const app = createApp(App)

// 只注册需要的组件
app.use(ElButton)
app.use(ElInput)
app.use(ElForm)
app.use(ElFormItem)
```

### CSS 优化

```scss
// 避免重复的样式重置
.element-component {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

// 使用 CSS 变量提高复用性
.custom-container {
  --padding-x: 16px;
  --padding-y: 12px;
  --border-radius: 8px;

  padding: var(--padding-y) var(--padding-x);
  border-radius: var(--border-radius);
}

// 避免深层嵌套
.optimized-structure {
  // 避免超过 3 层嵌套
  .header { }
  .content { }
  .footer { }
}
```

---

## 最佳实践总结

### 🎯 **核心原则：优先使用 Element Plus 原生样式**

**✅ 推荐的做法：**
- **充分利用 Element Plus 设计系统** - 组件默认样式已经过专业优化
- **最小化自定义** - 只在必要时进行样式调整，避免过度定制
- **使用组件属性** - 优先使用组件提供的 props 和内置属性
- **保持设计一致性** - 遵循 Element Plus 的设计语言和交互模式
- **CSS 变量微调** - 使用 Element Plus 内置变量进行细微调整

**❌ 避免的做法：**
- **完全重写组件样式** - 破坏组件的原生设计和交互
- **过度自定义主题** - 随意修改所有颜色变量
- **用工具类覆盖组件** - 破坏组件的核心功能和样式
- **固定值替代变量** - 使用硬编码值而非 CSS 变量
- **渐变等花哨效果** - 破坏设计系统的一致性

### 📋 **使用优先级**

1. **Element Plus 原生组件和属性** (最高优先级)
2. **Element Plus CSS 变量微调**
3. **工具类用于布局和间距**
4. **自定义样式仅用于非 Element Plus 组件**

### 🛠️ **开发指南**

```vue
<!-- ✅ 优先使用组件属性 -->
<el-button
  type="primary"
  size="large"
  round
  :loading="loading"
>
  提交
</el-button>

<!-- ✅ 工具类用于布局 -->
<div class="u-flex u-justify-between u-items-center u-p-lg">
  <el-card>卡片内容</el-card>
  <el-table>表格内容</el-table>
</div>

<!-- ❌ 避免过度自定义 -->
<el-button class="custom-gradient-button custom-round">
  不要这样做
</el-button>
```

### 🔧 **主题定制建议**

```scss
// ✅ 仅在必要时进行品牌化调整
:root {
  --el-color-primary: #1890ff; /* 品牌主色 */
}

// ❌ 避免完全重写主题
:root {
  --el-button-bg-color: linear-gradient(...); /* 不要这样做 */
}
```

### 📚 **相关文档**
- [Element Plus 官方文档](https://element-plus.org/) - 组件属性和用法
- [component-patterns.md](component-patterns.md) - 组件使用模式
- [file-organization.md](file-organization.md) - 样式文件组织