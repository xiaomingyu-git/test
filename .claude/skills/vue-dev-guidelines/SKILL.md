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
  - Query parameters? Request body structure?

### C. Layout & Structure
- ❓ **What's the best layout for this feature?**
  - Single column? Multi-column? Grid?
  - Card-based? List-based? Table-based?
  - Modal/Dialog? Full page? Sidebar?
  - Responsive considerations?

### D. Component Selection
- ❓ **Which Element Plus components fit best?**
  - Forms: `ElForm`, `ElInput`, `ElSelect`, `ElDatePicker`, `ElUpload`
  - Display: `ElTable`, `ElCard`, `ElDescriptions`, `ElTag`
  - Feedback: `ElMessage`, `ElNotification`, `ElMessageBox`
  - Navigation: `ElTabs`, `ElSteps`, `ElBreadcrumb`
  - Layout: `ElRow`, `ElCol`, `ElContainer`, `ElAside`

- ❓ **Need rich text editing?**
  - **wangEditor**: Modern Chinese-language WYSIWYG editor for Vue 3
  - Built on slate.js kernel with vdom technology
  - Built-in 50+ menus (bold, italic, image, video, table, code block, etc.)
  - Full Vue 3 Composition API support with shallowRef
  - Element Plus styling integration
  - Custom upload handling and Chinese documentation

### E. State Management
- ❓ **What state needs to be managed?**
  - Form data? Loading states? Error states?
  - Local component state or Pinia store?
  - Computed values? Watchers?

### F. User Experience
- ❓ **What's the user flow?**
  - Loading indicators during API calls?
  - Success/error messages?
  - Validation feedback?
  - Confirmation dialogs for destructive actions?

---

## Step 2: 🔍 QUERY DOCS - Get Latest Documentation

**After thinking, query Context7 MCP for official docs:**

### Context7 MCP Usage

**Step 1: Resolve Library ID**
```typescript
// Use mcp__context7__resolve-library-id
libraryName: "vue" | "element-plus" | "vite" | "pinia" | "vue-router"
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

| Library | Context7 ID | Example Topics |
|---------|------------|----------------|
| **Vue 3** | `/vuejs/core` | composables, reactivity, lifecycle, defineProps, ref, computed |
| **Element Plus** | `/element-plus/element-plus` | el-form, el-table, el-dialog, el-upload, el-button, theme |
| **wangEditor** | `/wangeditor/wangeditor` | editor, toolbar, upload, configuration, plugins |
| **Vite** | `/vitejs/vite` | config, plugins, build, optimization, env |
| **Pinia** | `/vuejs/pinia` | stores, state, actions, getters, setup stores |
| **Vue Router** | `/vuejs/router` | routes, navigation, guards, dynamic routes |

### When to Query (ALWAYS)

✅ **Before using ANY Element Plus component**
- ElForm, ElTable, ElDialog, ElUpload, ElButton, ElSelect, etc.

✅ **Before using wangEditor**
- Editor setup, toolbar configuration, upload handling

✅ **Before implementing Vue 3 features**
- Composables, reactivity (ref/reactive), lifecycle hooks, provide/inject

✅ **Before configuring libraries**
- Pinia stores, Vue Router setup, Vite plugins, wangEditor configuration

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
- [ ] ...

### 2. API Calls
- [ ] GET /api/[endpoint] - Fetch [data]
- [ ] POST /api/[endpoint] - Create [resource]
- [ ] ...

### 3. Layout Structure
- [ ] Container: [ElCard / ElContainer / etc]
- [ ] Grid: [ElRow/ElCol layout]
- [ ] Sections: [Header / Body / Footer]

### 4. Components Needed
- [ ] ElForm - Main form container
- [ ] ElInput - [field names]
- [ ] ElSelect - [dropdown fields]
- [ ] ElButton - [action buttons]
- [ ] ...

### 5. State Management
- [ ] Form data: reactive({ ... })
- [ ] Loading: ref(false)
- [ ] Errors: ref(null)
- [ ] ...

### 6. User Feedback
- [ ] Loading spinner during API calls
- [ ] Success message on completion
- [ ] Error handling and display
- [ ] Validation feedback
```

---

## Step 4: 💻 IMPLEMENT - Write Code

**Now implement following the plan:**

1. **Query Context7 for each component** (from Step 2)
2. **Follow the implementation plan** (from Step 3)
3. **Apply project conventions** (from this skill)
4. **Write clean, typed TypeScript code**

---

## Step 5: ✅ VERIFY - Check Implementation

**Before finishing, verify:**

- [ ] All user inputs are captured
- [ ] All API calls are implemented
- [ ] Layout matches requirements
- [ ] All components are properly configured
- [ ] State management is correct
- [ ] Error handling is complete
- [ ] Loading states are shown
- [ ] Success/error messages are displayed
- [ ] TypeScript types are correct
- [ ] Code follows project conventions

---

## Complete Example Workflow

```
User: "Create a user registration form with email, password, and profile picture upload"

Assistant Process:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: 🤔 THINK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. User Inputs:
   - Email (text, required, email validation)
   - Password (password, required, min 8 chars)
   - Confirm Password (password, required, must match)
   - Profile Picture (file upload, optional, image only)

B. API Calls:
   - POST /api/auth/register
   - Body: { email, password, profilePicture }
   - Response: { user, token }

C. Layout:
   - Centered card on page
   - Single column form
   - Responsive (mobile-friendly)

D. Components:
   - ElCard (container)
   - ElForm (form wrapper)
   - ElFormItem (field wrappers)
   - ElInput (email, password fields)
   - ElUpload (profile picture)
   - ElButton (submit button)

   Note: If rich text input needed, consider wangEditor

E. State:
   - Form data: { email, password, confirmPassword, profilePicture }
   - Loading: boolean
   - Errors: string | null

F. UX:
   - Show loading spinner on submit
   - Disable form during submission
   - Show success message → redirect to dashboard
   - Show error message if registration fails
   - Real-time password match validation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: 🔍 QUERY DOCS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Query ElForm documentation
2. Query ElUpload documentation
3. Query ElInput documentation
4. Review validation patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: 📋 PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Create detailed implementation checklist]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: 💻 IMPLEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Write the actual code following the plan]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: ✅ VERIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Check all requirements are met]
```

### Why This Matters

- ✅ Ensures latest API usage (no deprecated patterns)
- ✅ Correct prop names and types
- ✅ Official best practices
- ✅ Avoids breaking changes
- ✅ TypeScript accuracy

---

## 🔧 TypeScript Error Auto-Resolution System

### Overview

The Vue development environment includes an intelligent TypeScript error auto-resolution system that automatically detects and fixes common TypeScript errors during development. This system is integrated into the development workflow and runs automatically when you stop editing or when TypeScript errors are detected.

### How It Works

#### Automatic Detection
- **Real-time Monitoring**: The system monitors file changes and detects TypeScript files that have been modified
- **Error Classification**: Errors are automatically classified by type (unused variables, type mismatches, implicit any, etc.)
- **Smart Filtering**: Ignores certain file types and patterns (tests, node_modules, build artifacts)

#### Auto-Fix Strategies

1. **Unused Variables (TS6133)**
   - Prefix unused function parameters with underscore: `_param`
   - Remove unused imports while preserving other imports
   - Comment out unused variable declarations

2. **Implicit Any Types (TS7005)**
   - Infer common types based on parameter names
   - Add type annotations for function parameters
   - Use `unknown` for ambiguous cases

3. **Duplicate Declarations (TS2580)**
   - Auto-rename conflicting variables with timestamp suffixes
   - Preserve original functionality while resolving conflicts

4. **Type Mismatches (TS2322)**
   - Manual intervention required (auto-fix disabled by default)
   - Provides detailed error messages for manual resolution

### Configuration

The auto-fix behavior is controlled by `.claude/auto-fix-config.json`:

```json
{
  "autoFixEnabled": true,
  "runOnStop": true,
  "maxFixAttempts": 3,
  "fixStrategies": {
    "unusedVariables": {
      "enabled": true,
      "prefixUnusedParams": true,
      "removeUnusedImports": true
    },
    "implicitAny": {
      "enabled": true,
      "inferCommonTypes": true
    }
  },
  "excludedFiles": [
    "*.d.ts",
    "node_modules/**",
    "dist/**",
    "**/*.test.ts"
  ]
}
```

### Integration Hooks

The system uses several hooks to integrate with your development workflow:

1. **Post-Tool-Use Tracker**: Monitors file changes during editing
2. **Auto-Error-Resolver**: Executes the actual fixing logic
3. **Stop Hook**: Runs auto-fix when development session ends

### Best Practices

#### During Development
- ✅ **Focus on Features**: Write code naturally, the system will handle common TypeScript errors
- ✅ **Review Auto-Fixes**: Check the auto-fix report to understand what was changed
- ✅ **Commit Fixes**: Review and commit the auto-applied fixes

#### Error Handling
- ⚠️ **Manual Review Required**: Some errors (type mismatches) require manual intervention
- ⚠️ **Verify Functionality**: Always test functionality after auto-fixes are applied
- ⚠️ **Check Imports**: Ensure auto-removed imports don't break functionality

#### Configuration Management
- ✅ **Customize Rules**: Adjust `auto-fix-config.json` based on project needs
- ✅ **Exclude Test Files**: Keep test files from being auto-modified
- ✅ **Review Fix Strategies**: Enable/disable specific fix strategies as needed

### Troubleshooting

#### Common Issues

1. **Auto-fix not running**
   - Check if `autoFixEnabled` is true in config
   - Verify TypeScript files were modified
   - Check console for error messages

2. **Unexpected fixes**
   - Review excluded patterns in config
   - Check fix strategy settings
   - Manually revert unwanted changes

3. **Performance issues**
   - Reduce `maxFixAttempts` in config
   - Add more exclude patterns for large projects
   - Disable specific fix strategies if not needed

### Reporting

The system generates detailed reports after each auto-fix session:

```
🚀 开发会话结束 - 自动错误修复报告
============================================================
📁 项目: vue-project
⏰ 时间: 2025-11-29 15:30:45
✅ 自动修复成功: 修复了 5 个 TypeScript 错误
⚠️ 仍有 2 个错误需要手动处理
💡 建议运行 `npm run type-check` 查看详细错误信息

📋 下一步建议:
  ✨ 验证修复后的代码功能是否正常
  🔍 运行测试确保修复没有破坏现有功能
  📝 提交修复后的代码更改
  🔧 手动处理剩余的 TypeScript 错误
============================================================
```

### Integration with Development Workflow

This auto-fix system seamlessly integrates with your Vue development workflow:

1. **Code Editing**: Focus on writing code, common TypeScript errors are handled automatically
2. **Stop Hook**: When you finish editing, the system runs auto-fix and generates a report
3. **Build & Test**: Automated build process followed by Playwright end-to-end testing
4. **Verification**: Review test results and confirm everything is working
5. **Process Cleanup**: Automatic shutdown of all development processes after confirmation

The system is designed to be non-intrusive while significantly reducing TypeScript-related friction during development and ensuring deployment-ready code through automated testing.

---

## When to Use This Skill

- Creating new Vue components or pages
- Building new features with Element Plus
- Fetching data with composables
- Setting up routing with unplugin-vue-router
- Styling components with Element Plus
- Performance optimization in Vite
- Organizing Vue project code
- TypeScript best practices
- **Automated error resolution**: Leveraging the built-in TypeScript auto-fix system

**Note**: This skill provides project-specific patterns. **Always combine with Context7 MCP docs** for accurate API usage.

---

## Quick Start

### New Component Checklist

Creating a Vue component? Follow this checklist:

- [ ] **🤔 THINK**: Analyze requirements (inputs, APIs, layout, components, state, UX)
- [ ] **🔍 QUERY**: Get Context7 docs for components you'll use
- [ ] **📋 PLAN**: Create implementation checklist
- [ ] **💻 IMPLEMENT**: Write code following the plan
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
- [ ] **✅ VERIFY**: Check all requirements are met

### New Feature Checklist

Creating a feature? Set up this structure:

- [ ] **🔍 Query Context7 for relevant library docs** (Vue Router, Pinia, Element Plus)
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

// wangEditor (Rich Text Editing)
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor';

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
- wangEditor rich text editor integration

**[📖 Complete Guide: resources/common-patterns.md](resources/common-patterns.md)**

---

### ✏️ wangEditor Rich Text Editor

**wangEditor Integration Best Practices:**
- Modern Chinese-language WYSIWYG editor built on slate.js
- Full Vue 3 Composition API support with shallowRef
- Built-in 50+ menus and tools
- Native TypeScript support
- Seamless Element Plus styling integration
- Chinese documentation and community support

**Key Concepts:**
- Editor instance management with `shallowRef`
- Toolbar configuration with custom menus
- Image and video upload handling
- Content synchronization with v-model
- Event-driven architecture (onCreated, onChange, onFocus, etc.)

**Common Use Cases:**
- Blog post editors
- Comment systems with rich formatting
- Documentation editors
- Email composers
- Content management systems
- Chinese language content editing

**Built-in Features:**
- Text formatting (bold, italic, underline, strikethrough, etc.)
- Headings (H1-H6)
- Lists (ordered, unordered, todo)
- Image upload and management
- Video upload and embedding
- Table editing
- Code blocks with syntax highlighting
- Links and anchors
- Text alignment
- Colors and backgrounds
- Font sizes and families
- Line height control

**Performance Tips:**
- Use `shallowRef` for editor instance (required)
- Destroy editor instance on component unmount
- Use custom upload handlers for large files
- Configure toolbar keys to show only necessary menus
- Use v-model for efficient content updates

---

### 📊 Tiptap Rich Text Editor with Enhanced Table Support

**Tiptap Integration Best Practices:**
- Modern headless rich text editor built on ProseMirror
- Framework-agnostic with excellent Vue 3 integration
- Highly extensible with custom extensions and nodes
- Enhanced table components with visual manipulation UI
- Element Plus styling integration
- TypeScript-first design with full type safety

**Key Concepts:**
- Editor instance management with `useEditor` composable
- Extension-based architecture for modular functionality
- Enhanced table operations with visual extend buttons
- Table manipulation toolbar for advanced operations
- Seamless integration with Element Plus design system

**Common Use Cases:**
- Content management systems with advanced tables
- Documentation platforms with rich formatting
- Blog platforms with embedded data tables
- Report generation systems
- Project management tools
- Educational content creation

**Enhanced Table Features (2025-11-29 Upgrade):**
- **Visual Extend Buttons**: Mouse-hover positioned + buttons for adding rows/columns
- **Smart Positioning**: Automatic calculation of button positions based on table dimensions
- **Table Operation Toolbar**: Dedicated toolbar when table is selected
- **Element Plus Integration**: Consistent styling with the overall design system
- **Responsive Design**: Mobile-friendly table controls
- **Error Handling**: Graceful error handling for table operations

**Core Tiptap Extensions Used:**
- `@tiptap/starter-kit` - Base editor functionality
- `@tiptap/extension-table` - Core table support
- `@tiptap/extension-text-align` - Text alignment controls
- `@tiptap/extension-code-block-lowlight` - Syntax highlighting
- `@tiptap/extension-image` - Image insertion and management

**Table Operation Components:**
- `TiptapTableExtendButtons` - Visual row/column extension buttons
- `TiptapTableEnhanced` - Enhanced table wrapper with toolbar
- Row/Column manipulation (add, delete, move, duplicate)
- Table header toggles
- Responsive table controls

**Enhanced Features:**
- Smart button positioning that adapts to table size
- Confirmation dialogs for destructive actions
- Success/error feedback with Element Plus messages
- ResizeObserver integration for dynamic table sizing
- Keyboard shortcuts for table navigation

**Performance Tips:**
- Use ResizeObserver for dynamic table size tracking
- Lazy load enhanced table components
- Optimize table operations with proper state management
- Use `nextTick` for DOM updates after table changes
- Implement proper cleanup for ResizeObserver

**File Structure for Enhanced Tables:**
```
src/components/
├── TiptapEditor.vue              # Main editor component
├── TiptapToolbar.vue             # Editor toolbar
├── TiptapTableExtendButtons.vue  # Visual extend buttons
└── TiptapTableEnhanced.vue       # Enhanced table wrapper
```

**Testing Routes:**
- `/table-enhanced-test` - Comprehensive table functionality testing
- `/tiptap-integration-test` - General Tiptap editor testing

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

1. **🧠 Think First**: Always analyze before coding (MANDATORY)
2. **🔍 Query Docs**: Get latest Context7 documentation (MANDATORY)
3. **📋 Plan Implementation**: Create structured plan before coding (MANDATORY)
4. **Composition API First**: Use `<script setup>` and Composition API
5. **Element Plus Consistency**: Use Element Plus components for UI consistency
6. **TypeScript Always**: Strong typing for props, emits, and data
7. **Reactivity Awareness**: Use `ref`, `reactive`, `computed` appropriately
8. **Composable Logic**: Extract reusable logic into composables
9. **Performance Conscious**: Lazy load, memoize, optimize renders
10. **Component Design**: Single responsibility, props down/events up

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

---

## Quick Reference: wangEditor Cheatsheet

### Basic wangEditor Setup

```vue
<template>
  <div class="wang-editor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor-next/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { ref, shallowRef, onBeforeUnmount } from 'vue'

interface Props {
  modelValue?: string
  height?: string | number
  editable?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  editable: true,
  placeholder: '请输入内容...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref(props.modelValue || '<p></p>')

// 工具栏配置
const toolbarConfig = ref<Partial<IToolbarConfig>>({})

// 编辑器配置
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: props.placeholder,
  MENU_CONF: {
    uploadImage: {
      customUpload: (file: File, insertFn: Function) => {
        // 自定义图片上传逻辑
        const url = URL.createObjectURL(file)
        insertFn(url, file.name, url)
      }
    }
  }
})

// 编辑器创建完成
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 编辑器内容变化
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml()
  valueHtml.value = html
  emit('update:modelValue', html)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.wang-editor {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
}
</style>
```

### Common wangEditor API

```typescript
// 获取编辑器实例
const editor = editorRef.value

// 插入文本
editor.insertText('Hello World')

// 插入HTML
editor.dangerouslyInsertHtml('<p>Some HTML content</p>')

// 设置HTML内容
editor.setHtml('<p>New content</p>')

// 获取内容
const html = editor.getHtml()
const text = editor.getText()
const json = editor.getJson()

// 清空内容
editor.clear()

// 撤销/重做
editor.undo()
editor.redo()

// 焦点控制
editor.focus()
editor.blur()

// 判断是否可以撤销/重做
editor.isEditable
editor.isDisabled

// 获取选中的内容
const selectedText = editor.getSelectionText()
```

### wangEditor + Element Plus Integration

```vue
<template>
  <el-card>
    <template #header>
      <span>富文本编辑器</span>
    </template>

    <div class="editor-container">
      <!-- wangEditor Toolbar with Element Plus styling -->
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />

      <!-- Editor -->
      <Editor
        :defaultConfig="editorConfig"
        mode="default"
        v-model="valueHtml"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
      />
    </div>

    <!-- Action buttons -->
    <div class="editor-actions">
      <el-space>
        <el-button @click="clearContent">清空内容</el-button>
        <el-button @click="insertSample">插入示例</el-button>
        <el-button type="primary" @click="saveContent">保存内容</el-button>
      </el-space>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import '@wangeditor-next/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': [content: string]
}>()

const editorRef = shallowRef<IDomEditor>()
const valueHtml = ref('<p>开始编辑...</p>')

// 工具栏配置
const toolbarConfig = ref<Partial<IToolbarConfig>>({
  toolbarKeys: [
    'headerSelect', 'bold', 'italic', 'underline', 'through',
    'justifyLeft', 'justifyCenter', 'justifyRight',
    'bulletedList', 'numberedList',
    'color', 'bgColor',
    'insertLink', 'uploadImage', 'insertTable', 'codeBlock',
    'divider', 'undo', 'redo'
  ]
})

// 编辑器配置
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      customUpload: (file: File, insertFn: Function) => {
        // 使用 Element Plus 的 ElUpload 处理上传
        ElMessage.info(`上传图片: ${file.name}`)
        const url = URL.createObjectURL(file)
        insertFn(url, file.name, url)
      }
    },
    insertLink: {
      checkLink: (link: string) => {
        return /^https?:\/\//.test(link)
      }
    }
  }
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml()
  valueHtml.value = html
  emit('update:modelValue', html)
}

const handleFocus = (editor: IDomEditor) => {
  ElMessage.info('编辑器获得焦点')
}

const handleBlur = (editor: IDomEditor) => {
  ElMessage.info('编辑器失去焦点')
}

const clearContent = async () => {
  try {
    await ElMessageBox.confirm('确定要清空内容吗？', '确认', {
      type: 'warning'
    })
    editorRef.value?.clear()
    ElMessage.success('内容已清空')
  } catch {
    // 用户取消
  }
}

const insertSample = () => {
  const sampleHtml = `
    <h2>示例内容</h2>
    <p>这是一个 <strong>示例段落</strong>，包含了 <em>斜体</em> 和 <u>下划线</u> 文本。</p>
    <ul>
      <li>列表项 1</li>
      <li>列表项 2</li>
      <li>列表项 3</li>
    </ul>
    <blockquote>这是一个引用块</blockquote>
  `
  editorRef.value?.dangerouslyInsertHtml(sampleHtml)
  ElMessage.success('已插入示例内容')
}

const saveContent = () => {
  const content = editorRef.value?.getHtml()
  if (content) {
    emit('save', content)
    ElMessage.success('内容已保存')
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.editor-container {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  margin-bottom: 16px;
}

.editor-actions {
  margin-top: 16px;
  text-align: right;
}
</style>
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

**Skill Status**: Vue 3 + Composition API + Element Plus + Vite single instance guidelines with Context7 MCP integration

---

## 📚 Think-First Development Summary

This skill enforces a **structured thinking process** before coding:

### The 5-Step Process

1. **🤔 THINK**: Analyze requirements systematically
   - User inputs, API calls, layout, components, state, UX

2. **🔍 QUERY**: Get latest documentation
   - Context7 MCP for official API docs

3. **📋 PLAN**: Create implementation checklist
   - Document what you'll build before building it

4. **💻 IMPLEMENT**: Write code following the plan
   - Apply project conventions from this skill

5. **✅ VERIFY**: Check all requirements are met
   - Ensure nothing is missed

### Why This Matters

- ✅ **Prevents mistakes**: Think through requirements first
- ✅ **Better architecture**: Plan before coding
- ✅ **Complete features**: Checklist ensures nothing is missed
- ✅ **Faster development**: Clear plan = less refactoring
- ✅ **Better UX**: Consider user flow upfront

**Never skip the thinking step!** It saves time in the long run.

---

## 🔄 Enhanced Development Workflow with Automated Testing

### New 6-Step Implementation Process

**After completing the 5-step development process**, follow this enhanced workflow:

```
💻 IMPLEMENT → 🏗️ BUILD → 🎭 TEST → ✅ VERIFY → 🔄 CONFIRM → 🛑 CLEANUP
```

### Automated Workflow Visualization

```
🚀 DEVELOPMENT SESSION END (Stop Hook Triggered)
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│ 1️⃣ vsc-check.cjs → Auto TypeScript error detection & fix        │
│ 2️⃣ trigger-build-resolver.cjs → Build verification             │
│ 3️⃣ playwright-test-runner.cjs → E2E testing                   │
│    ├─ Check Playwright installation                             │
│    ├─ Verify test files exist                                   │
│    ├─ Start dev server (if needed)                              │
│    ├─ Run full test suite                                        │
│    └─ Generate test report                                      │
│ 4️⃣ User Confirmation Prompt → Review results & confirm         │
│ 5️⃣ process-cleanup.cjs → Clean shutdown (if confirmed)        │
└─────────────────────────────────────────────────────────────────┘
```

### Step 6: 🔄 Enhanced Testing & Validation Workflow

#### **Phase 1: Automated Build Process**
When development session ends (`Stop` hook triggers):

1. **Auto Error Resolution** (`trigger-build-resolver.cjs`)
   - Detect TypeScript errors
   - Auto-fix common issues (unused variables, implicit any, etc.)
   - Generate detailed fix report

2. **Build Verification**
   - Run `npm run build` or `npm run build-only`
   - Verify build completes successfully
   - Check for any remaining compilation errors

#### **Phase 2: Playwright End-to-End Testing**
After successful build:

3. **Test Environment Setup**
   - Start development server (`npm run dev`)
   - Wait for server to be ready
   - Launch Playwright test runner

4. **Automated Testing**
   ```bash
   # Run all E2E tests
   npx playwright test

   # Or run specific test suites
   npx playwright test --project=chromium
   npx playwright test --project=webkit
   npx playwright test --project=firefox
   ```

5. **Test Coverage Areas**
   - **Component Functionality**: All Vue components render and work correctly
   - **User Interactions**: Forms, buttons, navigation, and interactive elements
   - **Rich Text Editors**: wangEditor and Tiptap functionality
   - **Responsive Design**: Mobile, tablet, and desktop layouts
   - **Theme System**: Light/dark mode switching
   - **Routing**: Page navigation and route guards
   - **Error Handling**: Error states and user feedback

#### **Phase 3: Verification & Confirmation**

6. **Test Results Review**
   - Analyze test report and screenshots
   - Check for any failing tests
   - Review coverage metrics

7. **Manual Confirmation**
   ```
   ✅ All tests passed
   ✅ Build successful
   ✅ No TypeScript errors
   ✅ Functionality verified

   🔄 Ready to proceed? (y/N)
   ```

8. **Process Cleanup**
   - Shutdown development server
   - Close browser instances
   - Clean up temporary files
   - Generate final completion report

### Implementation Benefits

#### **Quality Assurance**
- **Zero Manual Testing**: Automated E2E tests replace manual clicking
- **Cross-Browser Testing**: Chrome, Firefox, Safari support via Playwright
- **Regression Prevention**: Catch breaking changes before deployment
- **Visual Testing**: Automated screenshots catch UI regressions

#### **Developer Experience**
- **Confidence in Changes**: Every change is thoroughly tested
- **Fast Feedback**: Immediate test results after implementation
- **Zero Cleanup**: Automatic process management
- **Deployment Ready**: Code is always production-ready after workflow

### Playwright Test Structure

#### **Test Organization**
```
tests/
├── e2e/
│   ├── components/          # Component tests
│   │   ├── editor.spec.ts  # Rich text editor tests
│   │   ├── forms.spec.ts   # Form functionality
│   │   └── tables.spec.ts  # Table operations
│   ├── pages/              # Page-level tests
│   │   ├── home.spec.ts    # Homepage functionality
│   │   ├── editor.spec.ts  # Editor pages
│   │   └── demo.spec.ts    # Demo pages
│   └── integration/        # Cross-feature tests
│       ├── theme.spec.ts   # Theme switching
│       └── routing.spec.ts # Navigation tests
├── fixtures/               # Test data and utilities
└── playwright.config.ts    # Playwright configuration
```

#### **Test Configuration**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Hook Integration

#### **Stop Hook Flow**
```javascript
// settings.json hooks configuration
"Stop": [
  {
    "hooks": [
      { "type": "command", "command": "node ./.claude/hooks/vsc-check.cjs" },
      { "type": "command", "command": "node ./.claude/hooks/trigger-build-resolver.cjs" },
      { "type": "command", "command": "node ./.claude/hooks/playwright-test-runner.cjs" },
      { "type": "command", "command": "node ./.claude/hooks/process-cleanup.cjs" }
    ]
  }
]
```

#### **New Hook Scripts**
1. **playwright-test-runner.cjs**: Runs E2E tests after successful build
2. **process-cleanup.cjs**: Shuts down all processes after confirmation

### Usage Instructions

#### **Automatic Workflow**
1. Complete your Vue development using the 5-step process
2. Stop the development session (Stop hook triggers automatically)
3. Wait for the automated workflow to complete
4. Review the test results and confirmation prompt
5. Confirm to proceed with cleanup

#### **Manual Testing**
```bash
# Run specific test suites
npx playwright test --grep "Rich Text Editor"
npx playwright test --grep "Table Operations"
npx playwright test --grep "Theme Switching"

# Debug failed tests
npx playwright test --debug
npx playwright test --headed
```

This enhanced workflow ensures that every change is thoroughly tested and production-ready before completion.