# Vue.js 布局指南

## 布局原则

### 1. 一致性
- 所有页面应该遵循统一的布局模式
- 保持间距、对齐和组件使用的一致性
- 使用设计系统提供的标准组件

### 2. 简洁性
- 避免过度复杂的布局结构
- 保持页面整洁，减少视觉噪音
- 优先考虑用户体验

### 3. 响应式
- 所有布局都应该适配不同屏幕尺寸
- 移动端优先设计
- 使用 Element Plus 的栅格系统

## CRUD 页面标准布局

### 整体结构

```
页面容器 (Card)
├── 页面标题区域
├── 查询表单区域 (可选)
├── 操作按钮区域 (可选)
└── 数据表格区域
```

### Card 容器

每个CRUD页面都应该包含在一个 Card 组件中：

```vue
<template>
  <div class="crud-page">
    <el-card>
      <!-- 页面内容 -->
    </el-card>
  </div>
</template>

<style scoped>
.crud-page {
  padding: 16px;
}
</style>
```

### 页面标题区域

标题区域位于Card顶部，包含页面标题和可能的操作按钮：

```vue
<template>
  <el-card>
    <!-- 标题区域 -->
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="page-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>
    </div>

    <!-- 其他内容 -->
  </el-card>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-actions {
  display: flex;
  gap: 8px;
}
</style>
```

### 查询表单区域

查询表单应该紧凑布局，常用查询项一行显示：

```vue
<template>
  <el-card>
    <!-- 标题区域 -->
    <div class="page-header">...</div>

    <!-- 查询表单区域 -->
    <div class="search-form" v-if="showSearchForm">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 其他内容 -->
  </el-card>
</template>

<style scoped>
.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
```

### 操作按钮区域

操作按钮区域位于查询表单和表格之间，包含批量操作等按钮：

```vue
<template>
  <el-card>
    <!-- 标题区域 -->
    <div class="page-header">...</div>

    <!-- 查询表单区域 -->
    <div class="search-form">...</div>

    <!-- 操作按钮区域 -->
    <div class="table-toolbar" v-if="selectedRows.length > 0">
      <div class="toolbar-left">
        <span class="selected-info">
          已选择 {{ selectedRows.length }} 项
        </span>
        <el-button type="danger" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button type="warning" @click="handleBatchDisable">
          <el-icon><Lock /></el-icon>
          批量禁用
        </el-button>
      </div>

      <div class="toolbar-right">
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据表格区域 -->
    <div class="table-container">...</div>
  </el-card>
</template>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.selected-info {
  color: var(--el-text-color-regular);
  font-size: 14px;
}
</style>
```

### 数据表格区域

表格区域是页面的主要数据展示区域：

```vue
<template>
  <el-card>
    <!-- 标题区域 -->
    <div class="page-header">...</div>

    <!-- 查询表单区域 -->
    <div class="search-form">...</div>

    <!-- 操作按钮区域 -->
    <div class="table-toolbar">...</div>

    <!-- 数据表格区域 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="username" label="用户名" min-width="120" />

        <el-table-column prop="email" label="邮箱" min-width="180" />

        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
            <el-dropdown trigger="click" @command="(command) => handleDropdownCommand(command, row)">
              <el-button type="primary" link size="small">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">查看详情</el-dropdown-item>
                  <el-dropdown-item command="reset">重置密码</el-dropdown-item>
                  <el-dropdown-item command="logs">操作日志</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.table-container {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
```

## 响应式布局

### 移动端适配

在移动端，查询表单应该变为垂直布局：

```vue
<template>
  <div class="crud-page">
    <el-card>
      <!-- 响应式查询表单 -->
      <div class="search-form" v-if="showSearchForm">
        <el-form :model="searchForm" :label-position="isMobile ? 'top' : 'right'">
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="用户名">
                <el-input
                  v-model="searchForm.username"
                  placeholder="请输入用户名"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="状态">
                <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="启用" value="active" />
                  <el-option label="禁用" value="inactive" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8">
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

const screenWidth = ref(window.innerWidth)

const isMobile = computed(() => screenWidth.value < 768)

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## 特殊页面布局

### 详情页面

详情页面采用左右布局或上下布局：

```vue
<template>
  <div class="detail-page">
    <el-card>
      <!-- 返回按钮和标题 -->
      <div class="detail-header">
        <el-button @click="handleBack" :icon="ArrowLeft">返回</el-button>
        <h2 class="detail-title">用户详情</h2>
      </div>

      <!-- 详情内容 -->
      <div class="detail-content">
        <el-row :gutter="24">
          <!-- 左侧主要信息 -->
          <el-col :xs="24" :lg="16">
            <div class="detail-section">
              <h3 class="section-title">基本信息</h3>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
                    {{ userInfo.status === 'active' ? '启用' : '禁用' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>

          <!-- 右侧辅助信息 -->
          <el-col :xs="24" :lg="8">
            <div class="detail-section">
              <h3 class="section-title">系统信息</h3>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="创建时间">{{ userInfo.createdAt }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ userInfo.updatedAt }}</el-descriptions-item>
                <el-descriptions-item label="创建人">{{ userInfo.creator }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.detail-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
```

## 布局最佳实践

### 1. 间距规范
- 页面间距：16px
- 组件间距：12px-16px
- 表单项间距：16px
- 卡片内边距：20px

### 2. 对齐方式
- 标题左对齐
- 操作按钮右对齐
- 表格数据左对齐（数字右对齐）
- 表单标签右对齐

### 3. 视觉层次
- 使用不同的字体大小区分标题层级
- 使用颜色区分不同状态
- 使用分割线区分不同区域

### 4. 交互反馈
- Loading 状态指示
- 操作结果提示
- 表单验证反馈

这种标准化的布局确保了整个应用的一致性和可维护性，同时提供了良好的用户体验。