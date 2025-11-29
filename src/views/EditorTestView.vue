<template>
  <div class="editor-test">
    <el-container>
      <el-header>
        <h1>Tiptap编辑器测试</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-card header="编辑器测试" class="editor-card">
              <TiptapEditor
                v-model="content"
                placeholder="请输入要编辑的内容..."
                :height="400"
                @ready="onEditorReady"
                @change="onContentChange"
                @focus="onFocus"
                @blur="onBlur"
              />
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-card header="HTML输出" class="preview-card">
              <pre class="html-preview">{{ content }}</pre>
            </el-card>
            <el-card header="操作按钮" class="controls-card">
              <el-space wrap>
                <el-button type="primary" @click="setSampleContent">设置示例内容</el-button>
                <el-button type="success" @click="clearContent">清空内容</el-button>
                <el-button type="warning" @click="getEditorContent">获取内容</el-button>
                <el-button type="info" @click="toggleEditable">{{
                  editable ? '只读' : '编辑'
                }}</el-button>
              </el-space>
            </el-card>
            <el-card header="状态信息" class="status-card">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="字符数">{{ content.length }}</el-descriptions-item>
                <el-descriptions-item label="是否可编辑">{{
                  editable ? '是' : '否'
                }}</el-descriptions-item>
                <el-descriptions-item label="编辑器状态">{{
                  editorReady ? '已就绪' : '未就绪'
                }}</el-descriptions-item>
                <el-descriptions-item label="最后更新时间">{{
                  lastUpdateTime
                }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import TiptapEditor from '@/components/TiptapEditor.vue'

const content = ref('')
const editable = ref(true)
const editorReady = ref(false)
const lastUpdateTime = ref('')

const sampleContent = `
<h1>Tiptap编辑器测试</h1>
<p>这是一个<strong>富文本编辑器</strong>的测试页面。</p>
<h2>功能特性</h2>
<ul>
<li><em>斜体文本</em></li>
<li><u>下划线文本</u></li>
<li><code>代码片段</code></li>
</ul>
<h3>引用示例</h3>
<blockquote>这是一个引用块的示例，用于显示重要的引用内容。</blockquote>
<p>段落内容测试，包括<a href="#">链接</a>元素。</p>
<pre><code>// 代码块示例
function hello() {
  console.log('Hello, Tiptap!')
}</code></pre>
`

const onEditorReady = (_editor: unknown) => {
  editorReady.value = true
  updateLastTime()
  ElMessage.success('编辑器已就绪')
}

const onContentChange = (_value: string) => {
  updateLastTime()
}

const onFocus = (event: FocusEvent) => {
  console.log('编辑器获得焦点', event)
}

const onBlur = (event: FocusEvent) => {
  console.log('编辑器失去焦点', event)
}

const setSampleContent = () => {
  content.value = sampleContent
  ElMessage.success('已设置示例内容')
}

const clearContent = () => {
  content.value = ''
  ElMessage.success('内容已清空')
}

const getEditorContent = () => {
  if (content.value) {
    ElMessage.info(`当前内容长度: ${content.value.length} 字符`)
  } else {
    ElMessage.warning('编辑器内容为空')
  }
}

const toggleEditable = () => {
  editable.value = !editable.value
  ElMessage.info(editable.value ? '编辑器已设为可编辑' : '编辑器已设为只读')
}

const updateLastTime = () => {
  const now = new Date()
  lastUpdateTime.value = now.toLocaleTimeString()
}

onMounted(() => {
  updateLastTime()
})
</script>

<style scoped>
.editor-test {
  padding: 20px;
}

.editor-card,
.preview-card,
.controls-card,
.status-card {
  margin-bottom: 20px;
}

.html-preview {
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-test {
    padding: 10px;
  }
}
</style>
