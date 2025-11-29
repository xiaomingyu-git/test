<template>
  <div class="table-enhanced-test">
    <div class="test-header">
      <h1>Tiptap 增强表格功能测试</h1>
      <p>测试基于官方文档的表格组件升级，包括可视化行列添加按钮</p>
    </div>

    <el-row :gutter="24" class="test-row">
      <!-- 基础表格测试 -->
      <el-col :lg="12" :md="24" class="test-col">
        <h2>基础表格测试</h2>
        <el-space class="controls" direction="vertical">
          <el-space>
            <el-button @click="insertBasicTable" type="primary">
              插入基础表格
            </el-button>
            <el-button @click="insertAdvancedTable" type="success">
              插入高级表格
            </el-button>
            <el-button @click="clearContent" type="danger">
              清空内容
            </el-button>
          </el-space>
          <el-space>
            <el-switch
              v-model="showEnhancedTable"
              active-text="增强表格"
              inactive-text="普通表格"
            />
            <el-text size="small" type="info">
              切换表格模式以测试不同功能
            </el-text>
          </el-space>
        </el-space>

        <tiptap-editor
          v-model="tableContent"
          placeholder="点击上方按钮插入表格进行测试..."
          height="400px"
          @ready="onEditorReady"
        />
      </el-col>

      <!-- 功能说明 -->
      <el-col :lg="12" :md="24" class="test-col">
        <h2>功能说明</h2>
        <el-card class="feature-card">
          <div class="feature-list">
            <h3>✨ 增强表格功能</h3>
            <ul>
              <li><strong>可视化扩展按钮</strong>：鼠标悬停时在表格边缘显示 + 按钮</li>
              <li><strong>智能定位</strong>：自动定位到正确的行列位置</li>
              <li><strong>操作工具栏</strong>：选中表格时显示专门的表格操作工具</li>
              <li><strong>Element Plus 风格</strong>：与整体设计风格保持一致</li>
            </ul>

            <h3>🎯 操作方式</h3>
            <ul>
              <li>点击工具栏中的"插入表格"按钮</li>
              <li>鼠标悬停在表格上查看扩展按钮</li>
              <li>点击 + 按钮在对应位置添加行或列</li>
              <li>使用表格工具栏进行高级操作</li>
            </ul>

            <h3>🔧 支持的操作</h3>
            <ul>
              <li>添加/删除行</li>
              <li>添加/删除列</li>
              <li>表头切换</li>
              <li>表格删除（带确认）</li>
              <li>响应式布局</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 测试结果 -->
    <el-row :gutter="24" class="test-row">
      <el-col :span="24" class="test-col">
        <h2>测试结果</h2>
        <el-card class="result-card">
          <div class="test-status">
            <el-space>
              <el-tag :type="editorReady ? 'success' : 'danger'">
                编辑器状态: {{ editorReady ? '就绪' : '未就绪' }}
              </el-tag>
              <el-tag :type="showEnhancedTable ? 'success' : 'info'">
                表格模式: {{ showEnhancedTable ? '增强' : '普通' }}
              </el-tag>
              <el-tag :type="hasTable ? 'success' : 'info'">
                表格状态: {{ hasTable ? '已插入' : '未插入' }}
              </el-tag>
            </el-space>
          </div>

          <div class="content-preview" v-if="tableContent">
            <h3>HTML 预览</h3>
            <el-input
              v-model="tableContent"
              type="textarea"
              :rows="10"
              readonly
              placeholder="编辑器内容将显示在这里..."
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 示例内容 -->
    <el-row :gutter="24" class="test-row">
      <el-col :span="24" class="test-col">
        <h2>预定义表格内容</h2>
        <el-space class="sample-controls">
          <el-button @click="loadSampleTable1" type="primary">
            加载示例表格 1（项目计划）
          </el-button>
          <el-button @click="loadSampleTable2" type="success">
            加载示例表格 2（功能对比）
          </el-button>
          <el-button @click="loadSampleTable3" type="warning">
            加载示例表格 3（复杂表格）
          </el-button>
        </el-space>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ElRow,
  ElCol,
  ElSpace,
  ElButton,
  ElSwitch,
  ElText,
  ElCard,
  ElTag,
  ElInput
} from 'element-plus'
import TiptapEditor from '../components/TiptapEditor.vue'

// 状态管理
const tableContent = ref('')
const showEnhancedTable = ref(true)
const editorReady = ref(false)

// 计算属性
const hasTable = computed(() => {
  return tableContent.value.includes('<table>')
})

// 示例表格内容
const sampleTable1 = `
<h2>项目开发计划</h2>
<table>
  <tbody>
    <tr>
      <th><p><strong>任务</strong></p></th>
      <th><p><strong>负责人</strong></p></th>
      <th><p><strong>开始日期</strong></p></th>
      <th><p><strong>结束日期</strong></p></th>
      <th><p><strong>状态</strong></p></th>
    </tr>
    <tr>
      <td><p>需求分析</p></td>
      <td><p>张三</p></td>
      <td><p>2024-01-01</p></td>
      <td><p>2024-01-15</p></td>
      <td><p>已完成</p></td>
    </tr>
    <tr>
      <td><p>UI设计</p></td>
      <td><p>李四</p></td>
      <td><p>2024-01-16</p></td>
      <td><p>2024-02-01</p></td>
      <td><p>进行中</p></td>
    </tr>
    <tr>
      <td><p>前端开发</p></td>
      <td><p>王五</p></td>
      <td><p>2024-02-02</p></td>
      <td><p>2024-03-15</p></td>
      <td><p>待开始</p></td>
    </tr>
    <tr>
      <td><p>后端开发</p></td>
      <td><p>赵六</p></td>
      <td><p>2024-02-02</p></td>
      <td><p>2024-03-30</p></td>
      <td><p>待开始</p></td>
    </tr>
  </tbody>
</table>
<p>这是一个项目管理表格，展示了项目各阶段的任务分配和时间安排。</p>
`

const sampleTable2 = `
<h2>富文本编辑器功能对比</h2>
<table>
  <tbody>
    <tr>
      <th><p><strong>功能</strong></p></th>
      <th><p><strong>Tiptap</strong></p></th>
      <th><p><strong>CKEditor</strong></p></th>
      <th><p><strong>Quill</strong></p></th>
      <th><p><strong>TinyMCE</strong></p></th>
    </tr>
    <tr>
      <td><p>表格支持</p></td>
      <td><p>✅ 优秀</p></td>
      <td><p>✅ 良好</p></td>
      <td><p>⚠️ 基础</p></td>
      <td><p>✅ 优秀</p></td>
    </tr>
    <tr>
      <td><p>代码高亮</p></td>
      <td><p>✅ 支持</p></td>
      <td><p>✅ 支持</p></td>
      <td><p>⚠️ 有限</p></td>
      <td><p>✅ 支持</p></td>
    </tr>
    <tr>
      <td><p>协作编辑</p></td>
      <td><p>⚠️ 需扩展</p></td>
      <td><p>✅ 内置</p></td>
      <td><p>⚠️ 需扩展</p></td>
      <td><p>✅ 内置</p></td>
    </tr>
    <tr>
      <td><p>包大小</p></td>
      <td><p>🟢 轻量</p></td>
      <td><p>🟡 中等</p></td>
      <td><p>🟢 轻量</p></td>
      <td><p>🔴 较大</p></td>
    </tr>
  </tbody>
</table>
<p>通过对比不同编辑器的特性，可以选择最适合项目需求的工具。</p>
`

const sampleTable3 = `
<h2>产品功能矩阵</h2>
<table>
  <tbody>
    <tr>
      <th><p><strong>功能模块</strong></p></th>
      <th><p><strong>基础版</strong></p></th>
      <th><p><strong>专业版</strong></p></th>
      <th><p><strong>企业版</strong></p></th>
      <th><p><strong>说明</strong></p></th>
    </tr>
    <tr>
      <td><p><strong>核心功能</strong></p></td>
      <td><p>✅ 完整</p></td>
      <td><p>✅ 完整</p></td>
      <td><p>✅ 完整</p></td>
      <td><p>包含所有基础编辑功能</p></td>
    </tr>
    <tr>
      <td><p><strong>表格功能</strong></p></p></td>
      <td><p>⚠️ 基础</p></td>
      <td><p>✅ 完整</p></td>
      <td><p>✅ 完整</p></td>
      <td><p>基础版仅支持简单表格</p></td>
    </tr>
    <tr>
      <td><p><strong>代码高亮</strong></p></td>
      <td><p>❌ 不支持</p></td>
      <td><p>✅ 支持</p></td>
      <td><p>✅ 支持</p></td>
      <td><p>专业版以上支持代码高亮</p></td>
    </tr>
    <tr>
      <td><p><strong>协作功能</strong></p></td>
      <td><p>❌ 不支持</p></td>
      <td><p>⚠️ 有限</p></td>
      <td><p>✅ 完整</p></td>
      <td><p>企业版支持多人实时协作</p></td>
    </tr>
    <tr>
      <td><p><strong>技术支持</strong></p></td>
      <td><p>社区支持</p></td>
      <td><p>邮件支持</p></td>
      <td><p>专属支持</p></td>
      <td><p>不同等级的技术服务</p></td>
    </tr>
    <tr>
      <td><p><strong>价格</strong></p></td>
      <td><p>免费</p></td>
      <td><p>¥99/月</p></td>
      <td><p>定制</p></td>
      <td><p>根据需求选择合适版本</p></td>
    </tr>
  </tbody>
</table>
<p>功能对比表格帮助用户了解不同版本的差异，选择最适合的产品。</p>
`

// 方法
const onEditorReady = (editor: any) => {
  editorReady.value = true
  console.log('编辑器已就绪:', editor)
}

const insertBasicTable = () => {
  tableContent.value = `
<p>这是一个基础的 3x3 表格：</p>
<table>
  <tbody>
    <tr>
      <th><p><strong>列1</strong></p></th>
      <th><p><strong>列2</strong></p></th>
      <th><p><strong>列3</strong></p></th>
    </tr>
    <tr>
      <td><p>数据1</p></td>
      <td><p>数据2</p></td>
      <td><p>数据3</p></td>
    </tr>
    <tr>
      <td><p>数据4</p></td>
      <td><p>数据5</p></td>
      <td><p>数据6</p></td>
    </tr>
  </tbody>
</table>
<p>鼠标悬停在表格上可以看到扩展按钮。</p>
  `
  ElMessage.success('已插入基础表格')
}

const insertAdvancedTable = () => {
  tableContent.value = sampleTable1
  ElMessage.success('已插入高级表格')
}

const clearContent = () => {
  tableContent.value = ''
  ElMessage.info('已清空内容')
}

const loadSampleTable1 = () => {
  tableContent.value = sampleTable1
  ElMessage.success('已加载示例表格 1')
}

const loadSampleTable2 = () => {
  tableContent.value = sampleTable2
  ElMessage.success('已加载示例表格 2')
}

const loadSampleTable3 = () => {
  tableContent.value = sampleTable3
  ElMessage.success('已加载示例表格 3')
}
</script>

<style scoped>
.table-enhanced-test {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.test-header p {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-base);
}

.test-row {
  margin-bottom: 32px;
}

.test-col {
  margin-bottom: 24px;
}

.test-col h2 {
  font-size: var(--el-font-size-large);
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.controls {
  margin-bottom: 16px;
  width: 100%;
}

.feature-card,
.result-card {
  height: 100%;
  border: 1px solid var(--el-border-color);
}

.feature-list h3 {
  color: var(--el-color-primary);
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: var(--el-font-size-base);
}

.feature-list h3:first-child {
  margin-top: 0;
}

.feature-list ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 4px;
  line-height: 1.5;
}

.test-status {
  margin-bottom: 16px;
  padding: 12px;
  background-color: var(--el-fill-color-extra-light);
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-lighter);
}

.content-preview h3 {
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.sample-controls {
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-enhanced-test {
    padding: 16px;
  }

  .test-header h1 {
    font-size: 1.5rem;
  }

  .test-col h2 {
    font-size: var(--el-font-size-base);
  }

  .controls {
    align-items: stretch;
  }

  .sample-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .table-enhanced-test {
    padding: 12px;
  }

  .test-row {
    margin-bottom: 24px;
  }

  .test-col {
    margin-bottom: 16px;
  }
}
</style>