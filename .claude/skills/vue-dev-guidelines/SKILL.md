---
name: vue-dev-guidelines
description: Vue.js development guidelines for Vue 3 + Vite + Element Plus + TypeScript single instance applications. Modern patterns including script setup, lazy loading, composables, Pinia state management, unplugin-vue-router, Element Plus styling, performance optimization, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, routing, or working with Vue code.
---

# Vue.js Development Guidelines

## Purpose

Comprehensive guide for modern Vue.js single instance development, emphasizing Composition API, `<script setup>`, Element Plus UI library, unplugin-vue-router for routing, and proper file organization.

## When to Use This Skill

- Creating new Vue components or pages
- Building new features with Element Plus
- Fetching data with composables
- Setting up routing with unplugin-vue-router
- Styling components with Element Plus
- Performance optimization in Vite
- Organizing Vue project code
- TypeScript best practices

---

## Quick Start

### New Component Checklist

Creating a Vue component? Follow this checklist:

- [ ] Use `<script setup lang="ts">` syntax
- [ ] Lazy load if heavy component: `defineAsyncComponent(() => import())`
- [ ] Wrap in `<Suspense>` for loading states
- [ ] Use composables for data fetching
- [ ] Import aliases: `@/`, `~components`, `~utils`, `~types`
- [ ] Styles: Element Plus components + custom CSS if needed
- [ ] Use `computed` for expensive computations
- [ ] Default export component definition
- [ ] Proper error handling with try-catch
- [ ] Use Element Plus `ElMessage` for user notifications

### New Feature Checklist

Creating a feature? Set up this structure:

- [ ] Create `src/views/{feature-name}/` directory
- [ ] Create subdirectories: `components/`, `composables/`, `utils/`, `types/`
- [ ] Create API service file: `api/{feature}Api.ts`
- [ ] Set up TypeScript types in `types/`
- [ ] Create route in `src/views/{feature-name}/index.vue`
- [ ] Lazy load feature components
- [ ] Use Suspense boundaries for async components
- [ ] Export public API from feature `index.ts`

---

## Import Aliases Quick Reference

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | `src/` | `import { apiClient } from '@/utils/apiClient'` |
| `~components` | `src/components` | `import { LoadingSpinner } from '~components/LoadingSpinner.vue'` |
| `~utils` | `src/utils` | `import { formatDate } from '~utils/dateHelpers'` |
| `~types` | `src/types` | `import type { User } from '~types/user'` |
| `~api` | `src/api` | `import { userApi } from '~api/user'` |

Defined in: [vite.config.ts](../../vite.config.ts) path aliases configuration

---

## Common Imports Cheatsheet

```typescript
// Vue 3 Core & Composition API
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { defineAsyncComponent } from 'vue';

// Element Plus Components
import { ElButton, ElCard, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus';

// Router (unplugin-vue-router)
import { useRouter, useRoute } from 'vue-router';

// Pinia Store
import { useUserStore } from '@/stores/user';

// Project Components
import { LoadingSpinner } from '~components/LoadingSpinner.vue';

// Composables
import { useFetch } from '~composables/useFetch';
import { useAuth } from '~composables/useAuth';

// Utils
import { formatDate } from '~utils/dateHelpers';

// Types
import type { User } from '~types/user';
```

---

## Topic Guides

### 🏗️ Component Patterns

**Vue 3 + Element Plus Best Practices:**
- Use `<script setup lang="ts">` syntax (default)
- `defineProps` and `defineEmits` with TypeScript
- Element Plus components for UI consistency
- Composition API over Options API
- Single File Components (.vue)

**Key Concepts:**
- Props down, emits up pattern
- Provide/inject for deep prop drilling
- Slots for flexible component composition
- Teleport for modal/portal content
- Element Plus component integration

**[📖 Complete Guide: resources/component-patterns.md](resources/component-patterns.md)**

---

### 📁 File Organization

**Project Structure Best Practices:**
- Logical directory organization for maintainability
- Consistent naming conventions across files
- Proper separation of concerns
- Scalable folder structure
- Clear import/export patterns

**[📖 Complete Guide: resources/file-organization.md](resources/file-organization.md)**

---

### 🔗 Composables (Custom Hooks)

**Standard Pattern:**
- Use `use` prefix naming convention
- Accept refs as arguments for reactivity
- Return reactive refs and computed values
- Handle cleanup properly
- Integration with Element Plus

**[📖 Complete Guide: resources/composables-guide.md](resources/composables-guide.md)**

---

### 🛣️ unplugin-vue-router

**Route Configuration:**
- File-based routing with unplugin-vue-router
- Page-level component organization
- Route meta information
- Lazy loading route components
- TypeScript route definitions
- Navigation guards

**[📖 Complete Guide: resources/routing-guide.md](resources/routing-guide.md)**

---

### 🎨 Element Plus Styling

**Element Plus Integration:**
- Element Plus component usage patterns
- Theme customization
- SCSS variable overrides
- Custom utility classes
- Responsive design patterns
- Accessibility considerations

**[📖 Complete Guide: resources/styling-guide.md](resources/styling-guide.md)**

---

### 📝 Forms and Validation

**Form Patterns:**
- `v-model` for two-way binding
- Element Plus form components
- Error handling and display
- Form submission patterns

---

### ⚡ Performance Optimization

**Key Patterns:**
- `v-memo` for expensive list items
- Lazy loading components with `defineAsyncComponent`
- Computed properties for caching
- Virtual scrolling for large lists
- Memory management and cleanup
- Vite build optimization

**[📖 Complete Guide: resources/performance-optimization.md](resources/performance-optimization.md)**

---

### 💻 TypeScript Standards

**TypeScript Best Practices:**
- Strict mode and type safety
- Component and composable typing
- Vue-specific TypeScript patterns
- Type guards and utility types
- Pinia store typing
- Router and event typing

**[📖 Complete Guide: resources/typescript-standards.md](resources/typescript-standards.md)**

---

### 🔄 Common Patterns

**Frequently Used Patterns:**
- Authentication with useAuth
- Form handling and validation
- Element Plus dialog patterns
- Table wrapper contracts
- State management patterns
- API call and mutation patterns
- Element Plus message/notification patterns

**[📖 Complete Guide: resources/common-patterns.md](resources/common-patterns.md)**

---

### 🔄 Data Fetching

**HTTP Client and API Management:**
- Unified Axios configuration with authentication
- Modular API design by feature
- CRUD operation patterns
- Concurrent request handling
- Request cancellation
- Caching strategies

**[📖 Complete Guide: resources/data-fetching.md](resources/data-fetching.md)**

---

### ⏳ Loading and Error States

**State Management Best Practices:**
- Element Plus loading components
- Custom loading spinners and skeletons
- Error handling and retry mechanisms
- Debounce and throttle patterns
- Global state management
- User-friendly error messages

**[📖 Complete Guide: resources/loading-and-error-states.md](resources/loading-and-error-states.md)**

---

---

## Navigation Guide

| Need to... | Read this resource |
|------------|-------------------|
| Organize project files | [file-organization.md](resources/file-organization.md) |
| Create a component | [component-patterns.md](resources/component-patterns.md) |
| Use Element Plus styling | [styling-guide.md](resources/styling-guide.md) |
| Build a composable | [composables-guide.md](resources/composables-guide.md) |
| Configure routing | [routing-guide.md](resources/routing-guide.md) |
| Fetch data from APIs | [data-fetching.md](resources/data-fetching.md) |
| Handle loading and errors | [loading-and-error-states.md](resources/loading-and-error-states.md) |
| Optimize performance | [performance-optimization.md](resources/performance-optimization.md) |
| TypeScript standards | [typescript-standards.md](resources/typescript-standards.md) |
| Common patterns | [common-patterns.md](resources/common-patterns.md) |

---

## Core Principles

1. **Composition API First**: Use `<script setup>` and Composition API
2. **Element Plus Consistency**: Use Element Plus components for UI consistency
3. **TypeScript Always**: Strong typing for props, emits, and data
4. **Reactivity Awareness**: Use `ref`, `reactive`, `computed` appropriately
5. **Composable Logic**: Extract reusable logic into composables
6. **Performance Conscious**: Lazy load, memoize, optimize renders
7. **Component Design**: Single responsibility, props down/events up

---

## Quick Reference: Element Plus Cheatsheet

### Basic Components

```vue
<template>
  <!-- Button -->
  <el-button type="primary" @click="handleClick">Primary Button</el-button>

  <!-- Card -->
  <el-card>
    <template #header>Card Title</template>
    Card content
  </el-card>

  <!-- Form -->
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">Submit</el-button>
    </el-form-item>
  </el-form>

  <!-- Table -->
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="date" label="Date" />
  </el-table>
</template>
```

### Message & Notification

```typescript
import { ElMessage, ElNotification } from 'element-plus';

// Success message
ElMessage.success('Operation successful!');

// Error notification
ElNotification.error({
  title: 'Error',
  message: 'Something went wrong',
});
```

### Confirm Dialog

```typescript
import { ElMessageBox } from 'element-plus';

try {
  await ElMessageBox.confirm(
    'Are you sure to delete this item?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  );
  // User confirmed
} catch {
  // User cancelled
}
```

---

## Quick Reference: Vue 3 Cheatsheet

### Reactivity
```typescript
import { ref, reactive, computed, readonly } from 'vue';

// Refs - for primitive values and objects
const count = ref(0);
const user = ref({ name: 'John' });

// Reactive - for objects
const state = reactive({ count: 0, user: { name: 'John' } });

// Computed - derived state
const doubled = computed(() => count.value * 2);

// Readonly - prevent mutations
const readonlyCount = readonly(count);
```

### Lifecycle Hooks
```typescript
import {
  onMounted,
  onUnmounted,
  onUpdated,
  onBeforeMount,
  onBeforeUnmount
} from 'vue';

onMounted(() => {
  // Component mounted
});

onUnmounted(() => {
  // Cleanup
});
```

### Watchers
```typescript
import { watch, watchEffect } from 'vue';

// Watch specific source
watch(count, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
});

// Watch multiple sources
watch([count, name], ([newCount, newName]) => {
  console.log({ newCount, newName });
});

// Watch effect (immediate, tracks dependencies)
watchEffect(() => {
  console.log(`Count is: ${count.value}`);
});
```

---

## Related Skills

- **frontend-dev-guidelines**: React/TypeScript patterns (for comparison)
- **error-tracking**: Error tracking with Sentry (applies to Vue too)

---

**Skill Status**: Vue 3 + Composition API + Element Plus + Vite single instance guidelines