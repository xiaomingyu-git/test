# Element Plus 样式指南

## Element Plus 样式配置

### 基础设置

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 全局配置
app.use(ElementPlus, {
  size: 'default', // 'large' | 'default' | 'small'
  zIndex: 2000,
})

app.mount('#app')
```

---

## 主题定制

### CSS 变量覆盖

```scss
// styles/element-plus.scss
:root {
  /* 主要颜色 */
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;

  /* 成功颜色 */
  --el-color-success: #67c23a;
  --el-color-success-light-3: #95d475;
  --el-color-success-light-5: #b3e19d;
  --el-color-success-light-7: #d1edc4;
  --el-color-success-light-8: #e1f3d8;
  --el-color-success-light-9: #f0f9eb;
  --el-color-success-dark-2: #529b2e;

  /* 警告颜色 */
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #eebe77;
  --el-color-warning-light-5: #f3d19e;
  --el-color-warning-light-7: #f8e3c5;
  --el-color-warning-light-8: #faecd8;
  --el-color-warning-light-9: #fdf6ec;
  --el-color-warning-dark-2: #b88230;

  /* 危险颜色 */
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #f78989;
  --el-color-danger-light-5: #fbb6b6;
  --el-color-danger-light-7: #fccdcd;
  --el-color-danger-light-8: #fde2e2;
  --el-color-danger-light-9: #fef0f0;
  --el-color-danger-dark-2: #c45656;

  /* 信息颜色 */
  --el-color-info: #909399;
  --el-color-info-light-3: #b1b3b8;
  --el-color-info-light-5: #c8c9cc;
  --el-color-info-light-7: #dedfe0;
  --el-color-info-light-8: #e9e9eb;
  --el-color-info-light-9: #f4f4f5;
  --el-color-info-dark-2: #73767a;

  /* 中性色 */
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #c0c4cc;
  --el-text-color-disabled: #c0c4cc;

  /* 边框颜色 */
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
  --el-border-color-dark: #d3d4d6;
  --el-border-color-darker: #cdd0d6;

  /* 填充颜色 */
  --el-fill-color: #f0f2f5;
  --el-fill-color-light: #f5f7fa;
  --el-fill-color-lighter: #fafafa;
  --el-fill-color-extra-light: #fafcff;
  --el-fill-color-dark: #ebedf0;
  --el-fill-color-darker: #e6e8eb;
  --el-fill-color-blank: #ffffff;

  /* 背景颜色 */
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f2f3f5;
  --el-bg-color-overlay: #ffffff;

  /* 组件尺寸 */
  --el-component-size-large: 40px;
  --el-component-size-default: 32px;
  --el-component-size-small: 24px;

  /* 字体大小 */
  --el-font-size-extra-large: 20px;
  --el-font-size-large: 18px;
  --el-font-size-medium: 16px;
  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-extra-small: 12px;

  /* 边框圆角 */
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  --el-border-radius-circle: 100%;

  /* 阴影 */
  --el-box-shadow: 0 12px 12px rgba(0, 0, 0, 0.12);
  --el-box-shadow-light: 0 12px 12px rgba(0, 0, 0, 0.12);
  --el-box-shadow-lighter: 0 12px 12px rgba(0, 0, 0, 0.12);
  --el-box-shadow-dark: 0 12px 12px rgba(0, 0, 0, 0.12);

  /* 禁用颜色 */
  --el-disabled-bg-color: var(--el-fill-color-light);
  --el-disabled-text-color: var(--el-text-color-placeholder);
  --el-disabled-border-color: var(--el-border-color-light);
}
```

### 组件样式覆盖

```scss
// 按钮样式覆盖
.el-button {
  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }

    &:active {
      background: linear-gradient(135deg, #4c51bf 0%, #5a4b8c 100%);
    }
  }

  &--success {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    }
  }

  &--warning {
    background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
    }
  }

  &--danger {
    background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    }
  }

  &.is-round {
    border-radius: var(--el-border-radius-round);
  }
}

// 卡片样式覆盖
.el-card {
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 6px 6px rgba(0, 0, 0, 0.16);
  }

  .el-card__header {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-bottom: 1px solid var(--el-border-color-light);
    font-weight: 600;
  }

  &.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  &.is-hover-shadow:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

// 输入框样式覆盖
.el-input {
  .el-input__inner {
    border-radius: var(--el-border-radius-base);
    transition: all 0.3s ease;

    &:focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  &.is-disabled .el-input__inner {
    background-color: var(--el-disabled-bg-color);
    color: var(--el-disabled-text-color);
    cursor: not-allowed;
  }
}

// 表格样式覆盖
.el-table {
  .el-table__header {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    font-weight: 600;
  }

  .el-table__row {
    &:hover {
      background-color: var(--el-fill-color-extra-light);
    }
  }

  &.el-table--striped {
    .el-table__body tr.el-table__row--striped {
      background-color: var(--el-fill-color-blank);
    }
  }
}

// 分页样式覆盖
.el-pagination {
  .el-pager li.active {
    background-color: var(--el-color-primary);
    color: #fff;
  }

  .btn-prev,
  .btn-next {
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

// 消息提示样式覆盖
.el-message {
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &.el-message--success {
    background: linear-gradient(135deg, #f0f9eb 0%, #e8f5e8 100%);
    border-color: var(--el-color-success-light-7);
  }

  &.el-message--warning {
    background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
    border-color: var(--el-color-warning-light-7);
  }

  &.el-message--error {
    background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
    border-color: var(--el-color-danger-light-7);
  }

  &.el-message--info {
    background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
    border-color: var(--el-color-info-light-7);
  }
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

## 工具类

### 常用工具类

```scss
// 布局工具类
.u-flex { display: flex !important; }
.u-flex-column { flex-direction: column !important; }
.u-flex-wrap { flex-wrap: wrap !important; }
.u-flex-nowrap { flex-wrap: nowrap !important; }
.u-flex-1 { flex: 1 1 0% !important; }
.u-flex-auto { flex: 1 1 auto !important; }
.u-flex-none { flex: none !important; }

.u-justify-start { justify-content: flex-start !important; }
.u-justify-center { justify-content: center !important; }
.u-justify-end { justify-content: flex-end !important; }
.u-justify-between { justify-content: space-between !important; }
.u-justify-around { justify-content: space-around !important; }
.u-justify-evenly { justify-content: space-evenly !important; }

.u-items-start { align-items: flex-start !important; }
.u-items-center { align-items: center !important; }
.u-items-end { align-items: flex-end !important; }
.u-items-stretch { align-items: stretch !important; }

// 间距工具类
.u-m-0 { margin: 0 !important; }
.u-m-1 { margin: 4px !important; }
.u-m-2 { margin: 8px !important; }
.u-m-3 { margin: 12px !important; }
.u-m-4 { margin: 16px !important; }
.u-m-5 { margin: 20px !important; }
.u-m-6 { margin: 24px !important; }

.u-mt-0 { margin-top: 0 !important; }
.u-mt-1 { margin-top: 4px !important; }
.u-mt-2 { margin-top: 8px !important; }
.u-mt-3 { margin-top: 12px !important; }
.u-mt-4 { margin-top: 16px !important; }
.u-mt-5 { margin-top: 20px !important; }
.u-mt-6 { margin-top: 24px !important; }

.u-mb-0 { margin-bottom: 0 !important; }
.u-mb-1 { margin-bottom: 4px !important; }
.u-mb-2 { margin-bottom: 8px !important; }
.u-mb-3 { margin-bottom: 12px !important; }
.u-mb-4 { margin-bottom: 16px !important; }
.u-mb-5 { margin-bottom: 20px !important; }
.u-mb-6 { margin-bottom: 24px !important; }

.u-ml-0 { margin-left: 0 !important; }
.u-ml-1 { margin-left: 4px !important; }
.u-ml-2 { margin-left: 8px !important; }
.u-ml-3 { margin-left: 12px !important; }
.u-ml-4 { margin-left: 16px !important; }
.u-ml-5 { margin-left: 20px !important; }
.u-ml-6 { margin-left: 24px !important; }

.u-mr-0 { margin-right: 0 !important; }
.u-mr-1 { margin-right: 4px !important; }
.u-mr-2 { margin-right: 8px !important; }
.u-mr-3 { margin-right: 12px !important; }
.u-mr-4 { margin-right: 16px !important; }
.u-mr-5 { margin-right: 20px !important; }
.u-mr-6 { margin-right: 24px !important; }

.u-p-0 { padding: 0 !important; }
.u-p-1 { padding: 4px !important; }
.u-p-2 { padding: 8px !important; }
.u-p-3 { padding: 12px !important; }
.u-p-4 { padding: 16px !important; }
.u-p-5 { padding: 20px !important; }
.u-p-6 { padding: 24px !important; }

// 文本工具类
.u-text-left { text-align: left !important; }
.u-text-center { text-align: center !important; }
.u-text-right { text-align: right !important; }

.u-text-xs { font-size: 12px !important; }
.u-text-sm { font-size: 13px !important; }
.u-text-base { font-size: 14px !important; }
.u-text-lg { font-size: 16px !important; }
.u-text-xl { font-size: 18px !important; }
.u-text-2xl { font-size: 20px !important; }

.u-font-light { font-weight: 300 !important; }
.u-font-normal { font-weight: 400 !important; }
.u-font-medium { font-weight: 500 !important; }
.u-font-semibold { font-weight: 600 !important; }
.u-font-bold { font-weight: 700 !important; }

// 显示工具类
.u-block { display: block !important; }
.u-inline-block { display: inline-block !important; }
.u-inline { display: inline !important; }
.u-hidden { display: none !important; }

// 位置工具类
.u-relative { position: relative !important; }
.u-absolute { position: absolute !important; }
.u-fixed { position: fixed !important; }
.u-static { position: static !important; }

// 宽度工具类
.u-w-full { width: 100% !important; }
.u-w-auto { width: auto !important; }

// 高度工具类
.u-h-full { height: 100% !important; }
.u-h-auto { height: auto !important; }

// 溢出工具类
.u-overflow-hidden { overflow: hidden !important; }
.u-overflow-auto { overflow: auto !important; }
.u-overflow-scroll { overflow: scroll !important; }
.u-overflow-visible { overflow: visible !important; }

// 圆角工具类
.u-rounded-none { border-radius: 0 !important; }
.u-rounded-sm { border-radius: 2px !important; }
.u-rounded { border-radius: 4px !important; }
.u-rounded-lg { border-radius: 8px !important; }
.u-rounded-xl { border-radius: 12px !important; }
.u-rounded-2xl { border-radius: 16px !important; }
.u-rounded-full { border-radius: 50% !important; }

// 阴影工具类
.u-shadow { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important; }
.u-shadow-lg { box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23) !important; }
.u-shadow-xl { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04) !important; }
.u-shadow-none { box-shadow: none !important; }
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

## 总结

**Element Plus 样式最佳实践：**

✅ **使用 CSS 变量** - 利用 Element Plus 的内置变量进行主题定制
✅ **响应式设计** - 使用 Element Plus 的响应式组件和工具类
✅ **组件样式覆盖** - 合理覆盖组件样式，保持一致性
✅ **暗色模式** - 通过 CSS 变量实现主题切换
✅ **工具类** - 使用简洁的工具类提高开发效率
✅ **性能优化** - 按需导入组件和样式，减少包体积
✅ **保持简洁** - 避免过度自定义，充分利用原生功能

**相关文档：**
- [component-patterns.md](component-patterns.md) - 组件使用模式
- [file-organization.md](file-organization.md) - 样式文件组织