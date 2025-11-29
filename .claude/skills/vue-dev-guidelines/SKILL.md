---
name: vue-dev-guidelines
description: Vue.js development guidelines for Vue 3 + Vite + Element Plus + TypeScript single instance applications. Modern patterns including script setup, lazy loading, composables, Pinia state management, unplugin-vue-router, Element Plus styling, performance optimization, and TypeScript best practices. Use when creating components, pages, features, fetching data, styling, routing, or working with Vue code.
---

# Vue.js Development Guidelines

## Purpose

Comprehensive guide for modern Vue.js single instance development, emphasizing Composition API, `<script setup>`, Element Plus UI library, unplugin-vue-router for routing, and proper file organization.

## 🧠 CRITICAL: Think-First Development Process

**⚠️ MANDATORY WORKFLOW**: Before writing ANY code, follow this structured thinking process:

### Required 5-Step Workflow

```
1. 🤔 THINK → 2. 🔍 QUERY DOCS → 3. 📋 PLAN → 4. 💻 IMPLEMENT → 5. ✅ VERIFY
```

---

## Step 1: 🤔 THINK - Analyze Requirements

**Before touching code, answer these questions:**

### A. User Input Analysis
- ❓ **What data does the user need to input?**
  - Text fields? Numbers? Dates? Files?
  - Required vs optional fields?
  - Validation rules?
  - Default values?

### B. API Requirements
- ❓ **What API calls are needed?**
  - GET: Fetch initial data?
  - POST: Create new records?
  - PUT/PATCH: Update existing data?
  - DELETE: Remove data?

### C. Layout & Structure
- ❓ **What's the best layout for this feature?**
  - Standard CRUD layout: Card container, title area, search form, operation buttons, data table
  - **[📖 Layout Guide: resources/layout-guide.md](resources/layout-guide.md)**

### D. Component Selection
- ❓ **Which Element Plus components fit best?**
- **[📖 Component Patterns: resources/component-patterns.md](resources/component-patterns.md)**

- ❓ **Need rich text editing?**
  - **wangEditor**: Modern Chinese-language WYSIWYG editor
  - **Tiptap**: Headless editor with enhanced table support

### E. State Management
- ❓ **What state needs to be managed?**
  - **[📖 Composables Guide: resources/composables-guide.md](resources/composables-guide.md)**

### F. User Experience
- ❓ **What's the user flow?**
  - Loading indicators during API calls?
  - Success/error messages?
  - **[📖 Loading & Error States: resources/loading-and-error-states.md](resources/loading-and-error-states.md)**

---

## Step 2: 🔍 QUERY DOCS - Get Latest Documentation

**After thinking, query Context7 MCP for official docs:**

### Context7 MCP Usage

**Step 1: Resolve Library ID**
```typescript
// Use mcp__context7__resolve-library-id
libraryName: "vue" | "element-plus" | "vite" | "pinia" | "vue-router" | "wangeditor" | "tiptap"
```

**Step 2: Get Documentation**
```typescript
// Use mcp__context7__get-library-docs
context7CompatibleLibraryID: "/vuejs/core" | "/element-plus/element-plus" | etc.
mode: "code"  // For API/components
mode: "info"  // For concepts/architecture
topic: "composables" | "el-form" | "reactivity" | etc.
```

### Library ID Quick Reference

| Library | Context7 ID | Topics |
|---------|------------|--------|
| **Vue 3** | `/vuejs/core` | composables, reactivity, lifecycle |
| **Element Plus** | `/element-plus/element-plus` | el-form, el-table, el-dialog |
| **wangEditor** | `/wangeditor/wangeditor` | editor, toolbar, upload |
| **Tiptap** | `/tiptap/editor` | editor, extensions, tables |
| **Vite** | `/vitejs/vite` | config, plugins, build |
| **Pinia** | `/vuejs/pinia` | stores, state, actions |
| **Vue Router** | `/vuejs/router` | routes, navigation, guards |

### When to Query (ALWAYS)

✅ **Before using ANY Element Plus component**
- ElForm, ElTable, ElDialog, ElUpload, ElButton, ElSelect, etc.

✅ **Before using rich text editors**
- wangEditor setup, Tiptap configuration, upload handling

✅ **Before implementing Vue 3 features**
- Composables, reactivity (ref/reactive), lifecycle hooks

✅ **When troubleshooting**
- Component behavior, API changes, TypeScript types

---

## Step 3: 📋 PLAN - Create Implementation Plan

**Document your plan before coding:**

### Implementation Checklist Template

```markdown
## Feature: [Feature Name]

### 1. User Inputs
- [ ] Field 1: [type] - [validation rules]
- [ ] Field 2: [type] - [validation rules]
- [ ] **[📖 Forms Guide: resources/form-patterns.md](resources/form-patterns.md)**

### 2. API Calls
- [ ] GET /api/[endpoint] - Fetch [data]
- [ ] POST /api/[endpoint] - Create [resource]
- [ ] **[📖 Data Fetching: resources/data-fetching.md](resources/data-fetching.md)**

### 3. Layout Structure
- [ ] Container: ElCard with standard CRUD layout
- [ ] Title area, search form, operation buttons, data table
- [ ] **[📖 Layout Guide: resources/layout-guide.md](resources/layout-guide.md)**

### 4. Components Needed
- [ ] **[📖 Component Patterns: resources/component-patterns.md](resources/component-patterns.md)**
- [ ] ElForm, ElInput, ElSelect, ElButton
- [ ] **[📖 Styling Guide: resources/styling-guide.md](resources/styling-guide.md)**

### 5. State Management
- [ ] **[📖 Composables Guide: resources/composables-guide.md](resources/composables-guide.md)**
- [ ] Form data: reactive({ ... })
- [ ] Loading: ref(false)
- [ ] Errors: ref(null)

### 6. User Feedback
- [ ] **[📖 Loading & Error States: resources/loading-and-error-states.md](resources/loading-and-error-states.md)**
- [ ] Loading spinner during API calls
- [ ] Success/error messages
```

---

## Step 4: 💻 IMPLEMENT - Write Code

**Now implement following the plan:**

1. **Query Context7 for each component** (from Step 2)
2. **Follow the implementation plan** (from Step 3)
3. **Apply project conventions** (from this skill)
4. **Write clean, typed TypeScript code**

### Key Implementation Resources

- **[📖 File Organization: resources/file-organization.md](resources/file-organization.md)** - Project structure
- **[📖 TypeScript Standards: resources/typescript-standards.md](resources/typescript-standards.md)** - Type safety
- **[📖 Performance Optimization: resources/performance-optimization.md](resources/performance-optimization.md)** - Optimization
- **[📖 Common Patterns: resources/common-patterns.md](resources/common-patterns.md)** - Reusable patterns

### Quick Start Implementation

```vue
<template>
  <!-- Standard CRUD Layout -->
  <el-card>
    <!-- Title Area -->
    <div class="page-header">
      <h2>{{ pageTitle }}</h2>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <!-- Search Form (One Row) -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <!-- Form fields -->
      </el-form>
    </div>

    <!-- Operation Buttons (One Row) -->
    <div class="operation-buttons">
      <!-- Batch operation buttons -->
    </div>

    <!-- Data Table (Below) -->
    <el-table :data="tableData">
      <!-- Table columns -->
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
// Use standard patterns
</script>
```

---

## Step 5: ✅ VERIFY - Check Implementation

**Before finishing, verify:**

- [ ] All user inputs are captured and validated
- [ ] All API calls are implemented and handled
- [ ] **[📖 Layout Guide: resources/layout-guide.md](resources/layout-guide.md)** - Layout matches requirements
- [ ] **[📖 Component Patterns: resources/component-patterns.md](resources/component-patterns.md)** - All components properly configured
- [ ] **[📖 Composables Guide: resources/composables-guide.md](resources/composables-guide.md)** - State management is correct
- [ ] **[📖 Loading & Error States: resources/loading-and-error-states.md](resources/loading-and-error-states.md)** - Error handling is complete
- [ ] **[📖 Forms Guide: resources/form-patterns.md](resources/form-patterns.md)** - Form validation works
- [ ] **[📖 TypeScript Standards: resources/typescript-standards.md](resources/typescript-standards.md)** - Types are correct
- [ ] **[📖 Common Patterns: resources/common-patterns.md](resources/common-patterns.md)** - Code follows conventions

---

## 📚 Complete Resource Guide

### Navigation Guide

| Need to... | Resource |
|------------|----------|
| **Design page layouts and structure** | **[📖 layout-guide.md](resources/layout-guide.md)** |
| Create components | **[📖 component-patterns.md](resources/component-patterns.md)** |
| Handle forms and validation | **[📖 form-patterns.md](resources/form-patterns.md)** |
| Style with Element Plus | **[📖 styling-guide.md](resources/styling-guide.md)** |
| Build composables | **[📖 composables-guide.md](resources/composables-guide.md)** |
| Configure routing | **[📖 routing-guide.md](resources/routing-guide.md)** |
| Fetch data from APIs | **[📖 data-fetching.md](resources/data-fetching.md)** |
| Handle loading and errors | **[📖 loading-and-error-states.md](resources/loading-and-error-states.md)** |
| Organize project files | **[📖 file-organization.md](resources/file-organization.md)** |
| Optimize performance | **[📖 performance-optimization.md](resources/performance-optimization.md)** |
| TypeScript standards | **[📖 typescript-standards.md](resources/typescript-standards.md)** |
| Use common patterns | **[📖 common-patterns.md](resources/common-patterns.md)** |

### Quick Reference Cheatsheet

```typescript
// Vue 3 Core
import { ref, reactive, computed, onMounted } from 'vue';

// Element Plus Components
import { ElButton, ElCard, ElForm, ElTable, ElMessage } from 'element-plus';

// Rich Text Editors
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { useEditor } from '@tiptap/vue-3';

// Router & Store
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

// Project Aliases
import { formatDate } from '~utils/dateHelpers';
import type { User } from '~types/user';
```

---

## Core Principles

1. **🧠 Think First**: Always analyze before coding (MANDATORY)
2. **🔍 Query Docs**: Get latest Context7 documentation (MANDATORY)
3. **📋 Plan Implementation**: Create structured plan before coding (MANDATORY)
4. **Composition API First**: Use `<script setup>` and Composition API
5. **Element Plus Consistency**: Use Element Plus components for UI consistency
6. **TypeScript Always**: Strong typing for props, emits, and data
7. **Standard Layouts**: Follow CRUD page layout patterns
8. **Composable Logic**: Extract reusable logic into composables
9. **Performance Conscious**: Lazy load, memoize, optimize renders

---

**Skill Status**: Vue 3 + Composition API + Element Plus + Vite single instance guidelines with Context7 MCP integration

**Never skip the thinking step!** It saves time in the long run.