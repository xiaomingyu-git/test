<template>
  <div class="test-wangeditor-page">
    <div class="container">
      <el-page-header @back="goBack" title="返回">
        <template #content>
          <span class="text-large font-600 mr-3"> wangEditor 富文本编辑器测试</span>
        </template>
      </el-page-header>

      <div class="content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card title="编辑器">
              <WangEditor
                v-model="editorContent"
                :height="500"
                placeholder="请输入富文本内容..."
                @ready="onEditorReady"
                @change="onEditorChange"
                @save="onEditorSave"
              />
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card title="实时预览">
              <div class="preview-container">
                <div class="preview-content" v-html="editorContent"></div>
                <el-divider />
                <div class="preview-json">
                  <h4>HTML源码：</h4>
                  <el-input
                    v-model="editorContent"
                    type="textarea"
                    :rows="10"
                    placeholder="HTML内容将显示在这里..."
                    readonly
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card title="功能测试">
              <el-space wrap>
                <el-button @click="insertSampleContent">插入示例内容</el-button>
                <el-button @click="clearContent">清空内容</el-button>
                <el-button type="primary" @click="saveContent">保存内容</el-button>
                <el-button @click="toggleReadonly">
                  {{ isReadonly ? '退出只读' : '进入只读' }}
                </el-button>
                <el-button @click="getContentInfo">获取内容信息</el-button>
              </el-space>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import WangEditor from '@/components/WangEditor.vue'

const router = useRouter()

// 编辑器内容
const editorContent = ref('<p>欢迎使用 <strong>wangEditor</strong> 富文本编辑器！</p>')
const isReadonly = ref(false)
const editorRef = ref()

const goBack = () => {
  router.back()
}

const onEditorReady = (editor: any) => {
  console.log('编辑器已就绪:', editor)
  editorRef.value = editor
  ElMessage.success('编辑器初始化成功')
}

const onEditorChange = (content: string) => {
  console.log('内容已更改:', content.length, '字符')
}

const onEditorSave = (content: string) => {
  console.log('内容已保存:', content)
  ElMessage.success('内容已保存')
}

const insertSampleContent = () => {
  const sampleContent = `
    <h2>wangEditor 功能示例</h2>
    <p>这是一个<strong>功能丰富</strong>的富文本编辑器。</p>

    <h3>文本格式</h3>
    <p>支持 <em>斜体</em>、<u>下划线</u>、<s>删除线</s> 等格式。</p>

    <h3>列表</h3>
    <ul>
      <li>无序列表项 1</li>
      <li>无序列表项 2</li>
      <li>无序列表项 3</li>
    </ul>

    <ol>
      <li>有序列表项 1</li>
      <li>有序列表项 2</li>
      <li>有序列表项 3</li>
    </ol>

    <h3>引用和代码</h3>
    <blockquote>这是一个引用块，用于引用重要信息。</blockquote>

    <p><code>行内代码</code> 和代码块：</p>
    <pre><code>function hello() {
  console.log("Hello, wangEditor!");
}</code></pre>

    <h3>表格</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">姓名</th>
          <th style="border: 1px solid #ddd; padding: 8px;">年龄</th>
          <th style="border: 1px solid #ddd; padding: 8px;">城市</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">张三</td>
          <td style="border: 1px solid #ddd; padding: 8px;">25</td>
          <td style="border: 1px solid #ddd; padding: 8px;">北京</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">李四</td>
          <td style="border: 1px solid #ddd; padding: 8px;">30</td>
          <td style="border: 1px solid #ddd; padding: 8px;">上海</td>
        </tr>
      </tbody>
    </table>

    <h3>链接和样式</h3>
    <p>访问 <a href="https://www.wangeditor.com" target="_blank">wangEditor 官网</a> 了解更多信息。</p>

    <p style="color: #409eff; font-size: 16px;">这是带有颜色的文本。</p>
  `

  editorContent.value = sampleContent
  ElMessage.success('已插入示例内容')
}

const clearContent = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有内容吗？', '确认', {
      type: 'warning'
    })
    editorContent.value = '<p></p>'
    ElMessage.success('内容已清空')
  } catch {
    // 用户取消
  }
}

const saveContent = () => {
  if (editorRef.value) {
    const content = editorRef.value.getHtml()
    console.log('保存的内容:', content)
    ElMessage.success(`内容已保存（${content.length} 字符）`)
  }
}

const toggleReadonly = () => {
  isReadonly.value = !isReadonly.value
  if (editorRef.value) {
    editorRef.value.setEditable(!isReadonly.value)
  }
  ElMessage.info(isReadonly.value ? '已进入只读模式' : '已退出只读模式')
}

const getContentInfo = () => {
  if (editorRef.value) {
    const html = editorRef.value.getHtml()
    const text = editorRef.value.getText()
    const info = {
      htmlLength: html.length,
      textLength: text.length,
      wordCount: text.split(/\s+/).filter((word: string) => word.length > 0).length,
      isEditable: editorRef.value.isEditable
    }

    ElMessage.info(`HTML: ${info.htmlLength}字符, 文本: ${info.textLength}字符, 单词: ${info.wordCount}个, 可编辑: ${info.isEditable}`)
    console.log('内容信息:', info)
  }
}
</script>

<style scoped>
.test-wangeditor-page {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.content {
  margin-top: 20px;
}

.preview-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  background-color: var(--el-bg-color);
}

.preview-content {
  min-height: 300px;
  line-height: 1.6;
}

.preview-content h1,
.preview-content h2,
.preview-content h3,
.preview-content h4,
.preview-content h5,
.preview-content h6 {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.preview-content h1 { font-size: 2em; }
.preview-content h2 { font-size: 1.5em; }
.preview-content h3 { font-size: 1.25em; }

.preview-content p {
  margin: 8px 0;
}

.preview-content ul,
.preview-content ol {
  margin: 8px 0;
  padding-left: 20px;
}

.preview-content li {
  margin: 4px 0;
}

.preview-content blockquote {
  margin: 12px 0;
  padding: 8px 16px;
  border-left: 4px solid var(--el-color-primary);
  background-color: var(--el-fill-color-light);
  font-style: italic;
}

.preview-content code {
  background-color: var(--el-fill-color-light);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.preview-content pre {
  background-color: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
}

.preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.preview-content th,
.preview-content td {
  border: 1px solid var(--el-border-color-light);
  padding: 8px 12px;
  text-align: left;
}

.preview-content th {
  background-color: var(--el-fill-color-light);
  font-weight: 600;
}

.preview-content a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.preview-content a:hover {
  text-decoration: underline;
}

.preview-json h4 {
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-wangeditor-page {
    padding: 10px;
  }

  .content :deep(.el-col) {
    margin-bottom: 20px;
  }
}
</style>