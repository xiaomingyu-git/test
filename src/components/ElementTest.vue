<template>
  <div class="element-test">
    <el-card class="test-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Element Plus 组件测试</span>
          <el-button type="primary" size="small">操作按钮</el-button>
        </div>
      </template>

      <!-- 基础组件测试 -->
      <div class="test-section">
        <h3>基础组件测试</h3>

        <!-- Button组件测试 -->
        <div class="component-group">
          <h4>按钮组件 (Button)</h4>
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
          <el-button type="info">信息按钮</el-button>
        </div>

        <!-- Input组件测试 -->
        <div class="component-group">
          <h4>输入组件 (Input)</h4>
          <el-input v-model="inputText" placeholder="请输入内容" clearable />
          <el-input v-model="inputText" placeholder="带图标的输入" :prefix-icon="Search" />
          <el-input v-model="inputText" type="textarea" placeholder="文本输入框" />
        </div>

        <!-- Select组件测试 -->
        <div class="component-group">
          <h4>选择组件 (Select)</h4>
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option label="选项1" value="1" />
            <el-option label="选项2" value="2" />
            <el-option label="选项3" value="3" />
          </el-select>
        </div>

        <!-- Card组件测试 -->
        <div class="component-group">
          <h4>卡片组件 (Card)</h4>
          <el-card style="width: 300px">
            <p>这是一个卡片组件测试内容</p>
            <el-button type="text">了解更多</el-button>
          </el-card>
        </div>

        <!-- 响应式设计测试 -->
        <div class="component-group">
          <h4>响应式布局测试</h4>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card shadow="always" class="responsive-card">
                <span>XS: 100%</span>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card shadow="always" class="responsive-card">
                <span>SM: 50%</span>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card shadow="always" class="responsive-card">
                <span>MD: 33%</span>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-card shadow="always" class="responsive-card">
                <span>LG: 25%</span>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 状态显示 -->
        <div class="component-group">
          <h4>组件状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="输入内容">{{ inputText }}</el-descriptions-item>
            <el-descriptions-item label="选择值">{{ selectValue }}</el-descriptions-item>
            <el-descriptions-item label="按钮点击次数">{{ clickCount }}</el-descriptions-item>
            <el-descriptions-item label="当前时间">{{ currentTime }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>

    <!-- 浮动操作按钮 -->
    <el-button type="primary" circle class="floating-button" @click="incrementClick">
      <el-icon><Plus /></el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

// 响应式数据
const inputText = ref('')
const selectValue = ref('')
const clickCount = ref(0)
const currentTime = ref(new Date().toLocaleString())

// 定时器
let timer: number | null = null

// 方法
const incrementClick = () => {
  clickCount.value++
}

// 生命周期
onMounted(() => {
  // 更新时间
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.element-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-section {
  margin-top: 20px;
}

.component-group {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #f9fafc;
}

.component-group h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
}

.component-group h4 {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.responsive-card {
  text-align: center;
  margin-bottom: 10px;
}

.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .element-test {
    padding: 10px;
  }

  .component-group {
    padding: 15px;
  }

  .floating-button {
    bottom: 20px;
    right: 20px;
  }
}

/* 组件间距 */
.el-button + .el-button {
  margin-left: 10px;
}

.el-input {
  margin-bottom: 10px;
  max-width: 300px;
}

.el-select {
  max-width: 300px;
}

.responsive-card {
  margin-bottom: 10px;
}
</style>
