<template>
  <div class="table-demo">
    <div class="demo-header">
      <h1 class="demo-title">表格组件演示</h1>
      <p class="demo-description">Element Plus 表格组件功能演示</p>
    </div>

    <div class="demo-content">
      <!-- 基础表格 -->
      <div class="demo-section">
        <h2 class="section-title">基础表格</h2>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="address" label="地址" />
          <el-table-column prop="date" label="日期" width="180" />
        </el-table>
      </div>

      <!-- 带状态的表格 -->
      <div class="demo-section">
        <h2 class="section-title">带状态的表格</h2>
        <el-table :data="statusTableData" border style="width: 100%">
          <el-table-column prop="name" label="商品名称" width="120" />
          <el-table-column prop="price" label="价格" width="100">
            <template #default="{ row }">
              <span>¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100">
            <template #default="{ row }">
              <span :class="{ 'low-stock': row.stock < 10 }">
                {{ row.stock }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 可展开的表格 -->
      <div class="demo-section">
        <h2 class="section-title">可展开的表格</h2>
        <el-table
          :data="expandTableData"
          border
          style="width: 100%"
          @expand-change="handleExpandChange"
        >
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="expand-content">
                <h4>详细信息</h4>
                <p><strong>描述：</strong>{{ row.description }}</p>
                <p><strong>标签：</strong>
                  <el-tag
                    v-for="tag in row.tags"
                    :key="tag"
                    size="small"
                    style="margin-right: 8px;"
                  >
                    {{ tag }}
                  </el-tag>
                </p>
                <p><strong>创建时间：</strong>{{ row.createTime }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="项目名称" width="150" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="progress" label="进度" width="200">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :color="getProgressColor(row.progress)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 可排序、可筛选的表格 -->
      <div class="demo-section">
        <h2 class="section-title">可排序、可筛选的表格</h2>
        <el-table
          :data="filteredTableData"
          border
          style="width: 100%"
          :default-sort="{ prop: 'score', order: 'descending' }"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="name" label="学生姓名" sortable width="120" />
          <el-table-column prop="class" label="班级" width="100" />
          <el-table-column
            prop="subject"
            label="科目"
            width="100"
            :filters="subjectFilters"
            :filter-method="filterSubject"
          />
          <el-table-column prop="score" label="分数" sortable width="100" />
          <el-table-column prop="grade" label="等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getGradeType(row.grade)">{{ row.grade }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 页面标题
defineOptions({
  name: 'TableView'
})

// 基础表格数据
const tableData = ref([
  {
    id: 1,
    name: '王小虎',
    age: 18,
    address: '北京市朝阳区建国门外大街1号',
    date: '2023-12-01'
  },
  {
    id: 2,
    name: '张小丽',
    age: 22,
    address: '上海市浦东新区陆家嘴环路1000号',
    date: '2023-12-02'
  },
  {
    id: 3,
    name: '李小明',
    age: 25,
    address: '广州市天河区珠江新城花城大道85号',
    date: '2023-12-03'
  },
  {
    id: 4,
    name: '赵小花',
    age: 20,
    address: '深圳市南山区科技园南区深南大道9988号',
    date: '2023-12-04'
  }
])

// 状态表格数据
const statusTableData = ref([
  {
    name: 'iPhone 15 Pro',
    price: 7999,
    status: 'active',
    stock: 50
  },
  {
    name: 'MacBook Pro',
    price: 14999,
    status: 'active',
    stock: 8
  },
  {
    name: 'AirPods Pro',
    price: 1999,
    status: 'inactive',
    stock: 0
  },
  {
    name: 'iPad Air',
    price: 4599,
    status: 'pending',
    stock: 25
  }
])

// 可展开表格数据
const expandTableData = ref([
  {
    name: 'Vue 3 项目',
    type: '前端',
    progress: 85,
    description: '基于 Vue 3 + TypeScript + Vite 的现代化前端项目',
    tags: ['Vue3', 'TypeScript', 'Vite'],
    createTime: '2023-10-15 10:30:00'
  },
  {
    name: 'Node.js API',
    type: '后端',
    progress: 60,
    description: 'RESTful API 服务，支持用户认证、数据管理等功能',
    tags: ['Node.js', 'Express', 'MongoDB'],
    createTime: '2023-11-01 14:20:00'
  },
  {
    name: '移动端应用',
    type: '移动端',
    progress: 30,
    description: '跨平台移动应用，支持 iOS 和 Android',
    tags: ['React Native', 'TypeScript'],
    createTime: '2023-11-20 09:15:00'
  }
])

// 可排序可筛选表格数据
const studentTableData = ref([
  { name: '张三', class: '1班', subject: '数学', score: 95, grade: 'A' },
  { name: '李四', class: '2班', subject: '语文', score: 88, grade: 'B' },
  { name: '王五', class: '1班', subject: '英语', score: 92, grade: 'A' },
  { name: '赵六', class: '3班', subject: '数学', score: 76, grade: 'C' },
  { name: '钱七', class: '2班', subject: '语文', score: 98, grade: 'A' },
  { name: '孙八', class: '1班', subject: '英语', score: 85, grade: 'B' },
  { name: '周九', class: '3班', subject: '数学', score: 91, grade: 'A' },
  { name: '吴十', class: '2班', subject: '语文', score: 73, grade: 'C' }
])

// 科目筛选器
const subjectFilters = [
  { text: '数学', value: '数学' },
  { text: '语文', value: '语文' },
  { text: '英语', value: '英语' }
]

// 筛选后的表格数据
const filteredTableData = ref([...studentTableData.value])

// 状态类型映射
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '在售',
    inactive: '下架',
    pending: '待上架'
  }
  return textMap[status] || '未知'
}

// 进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 40) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

// 等级类型映射
const getGradeType = (grade: string) => {
  const typeMap: Record<string, string> = {
    A: 'success',
    B: 'warning',
    C: 'danger'
  }
  return typeMap[grade] || 'info'
}

// 展开行变化处理
const handleExpandChange = (row: any, expandedRows: any[]) => {
  console.log('展开的行:', row, expandedRows)
}

// 排序变化处理
const handleSortChange = ({ column, prop, order }: any) => {
  console.log('排序变化:', { column, prop, order })
}

// 科目筛选方法
const filterSubject = (value: string, row: any) => {
  return row.subject === value
}
</script>

<style scoped lang="scss">
.table-demo {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;

  .demo-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .demo-description {
    font-size: 1.2rem;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 20px 0;
    border-bottom: 2px solid var(--el-color-primary);
    padding-bottom: 8px;
  }

  :deep(.el-table) {
    .low-stock {
      color: var(--el-color-danger);
      font-weight: 600;
    }
  }
}

.expand-content {
  padding: 16px;
  background: var(--el-fill-color-extra-light);
  border-radius: 6px;

  h4 {
    margin: 0 0 12px 0;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 8px 0;
    color: var(--el-text-color-regular);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-header {
    .demo-title {
      font-size: 2rem;
    }

    .demo-description {
      font-size: 1rem;
    }
  }

  .demo-section {
    padding: 16px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }
}

// 深色主题适配
:root.dark {
  .table-demo {
    background: var(--el-bg-color);
  }

  .demo-section {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .expand-content {
    background: var(--el-fill-color-darker);
  }
}
</style>