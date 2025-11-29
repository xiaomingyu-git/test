<template>
  <div class="tiptap-view">
    <!-- 编辑器容器 -->
    <tiptap-editor-container
      v-model="content"
      title="Tiptap 富文本编辑器"
      subtitle="基于 Vue 3 + TypeScript + Element Plus 的现代化编辑器"
      placeholder="开始编辑你的内容..."
      :show-char-count="true"
      :show-theme-toggle="true"
      :allow-fullscreen="true"
      :show-statusbar="true"
      :last-saved="lastSaved"
      height="600px"
      @ready="onEditorReady"
      @change="onContentChange"
      @fullscreen-change="onFullscreenChange"
      @save="handleSave"
    >
      <!-- 工具栏扩展插槽 -->
      <template #toolbar-extra>
        <el-divider direction="vertical" />
        <el-space>
          <el-button size="small" @click="insertTable" :icon="Grid"> 插入表格 </el-button>
          <el-button size="small" @click="insertImage" :icon="Picture"> 插入图片 </el-button>
          <el-button size="small" @click="exportContent" :icon="Download"> 导出内容 </el-button>
        </el-space>
      </template>

      <!-- 状态栏右侧 -->
      <template #statusbar-right>
        <el-space>
          <el-text size="small" type="info"> 字数: {{ wordCount }} </el-text>
          <el-button size="small" text @click="previewContent">
            <el-icon><View /></el-icon>
            预览
          </el-button>
        </el-space>
      </template>
    </tiptap-editor-container>

    <!-- 预览对话框 -->
    <el-dialog v-model="showPreview" title="内容预览" width="80%" :fullscreen="isFullscreen">
      <div class="preview-content" v-html="content"></div>
      <template #footer>
        <el-button @click="showPreview = false">关闭</el-button>
        <el-button type="primary" @click="copyHtml">复制 HTML</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Editor } from '@tiptap/core'
import { Grid, Picture, Download, View } from '@element-plus/icons-vue'
import TiptapEditorContainer from '@/components/editor/TiptapEditorContainer.vue'

// 注入编辑器布局上下文
const editorLayout = inject('editorLayout') as {
  isFullscreen: { value: boolean }
  toggleFullscreen: () => void
}

// 编辑器状态
const content = ref('')
const lastSaved = ref(new Date())
const showPreview = ref(false)
const editorInstance = ref<Editor | null>(null)

// 计算属性
const wordCount = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, '')
  return text.trim().length
})

const isFullscreen = computed(() => editorLayout?.isFullscreen?.value || false)

// 示例内容
const exampleContent = `
<h1>Tiptap 编辑器演示</h1>
<p>这是一个基于 <strong>Tiptap</strong> 构建的现代化富文本编辑器，具有以下特性：</p>

<h2>🎨 核心特性</h2>
<ul>
  <li><strong>现代化架构</strong>：基于 Vue 3 Composition API 和 TypeScript</li>
  <li><strong>高性能</strong>：基于 ProseMirror，提供出色的编辑体验</li>
  <li><strong>高度可定制</strong>：丰富的插件系统，支持各种扩展</li>
  <li><strong>TypeScript 支持</strong>：完整的类型定义和智能提示</li>
</ul>

<h2>📝 文本格式</h2>
<p>支持各种文本格式，包括 <strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s>等。</p>

<blockquote>
  这是一段引用内容，用于突出显示重要的引用信息。
</blockquote>

<h2>💻 代码支持</h2>
<p>支持行内代码 <code>console.log('Hello World')</code> 和代码块：</p>

<pre><code data-language="javascript">// 代码块示例
function createEditor() {
  return new Editor({
    content: '<p>Hello Tiptap!</p>',
    extensions: [StarterKit],
  })
}

const editor = createEditor()</code></pre>

<h2>📊 表格支持</h2>
<p>支持插入和编辑表格：</p>
<table>
  <thead>
    <tr>
      <th>功能</th>
      <th>描述</th>
      <th>状态</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>基础编辑</td>
      <td>支持富文本编辑</td>
      <td>✅ 完成</td>
    </tr>
    <tr>
      <td>表格操作</td>
      <td>插入、删除、合并单元格</td>
      <td>✅ 完成</td>
    </tr>
    <tr>
      <td>图片上传</td>
      <td>拖拽或点击上传图片</td>
      <td>🚧 开发中</td>
    </tr>
  </tbody>
</table>

<h2>🔗 链接和图片</h2>
<p>支持插入链接：<a href="https://tiptap.dev">Tiptap 官网</a></p>

<hr>

<p>以上展示了 Tiptap 编辑器的主要功能特性。开始编辑这段内容，体验完整的编辑功能！</p>
`

// 编辑器就绪回调
const onEditorReady = (editor: Editor) => {
  editorInstance.value = editor
  console.log('Tiptap editor is ready:', editor)

  // 加载初始示例内容
  loadExample()
}

// 内容变化回调
const onContentChange = (value: string) => {
  console.log('Content changed:', value.length, 'characters')
}

// 全屏状态变化
const onFullscreenChange = (fullscreen: boolean) => {
  console.log('Fullscreen state changed:', fullscreen)
}

// 保存内容
const saveContent = async () => {
  try {
    // 模拟保存操作
    await new Promise((resolve) => setTimeout(resolve, 500))
    lastSaved.value = new Date()
    ElMessage.success('内容保存成功')
  } catch (error) {
    console.error('Save failed:', error)
    ElMessage.error('保存失败')
  }
}

// 处理保存事件
const handleSave = (content: string) => {
  console.log('Save event triggered:', content.length, 'characters')
  saveContent()
}

// 加载示例内容
const loadExample = () => {
  content.value = exampleContent
  ElMessage.success('示例内容已加载')
}

// 插入表格
const insertTable = () => {
  if (!editorInstance.value) return

  try {
    editorInstance.value
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
    ElMessage.success('表格插入成功')
  } catch (error) {
    console.error('Insert table failed:', error)
    ElMessage.error('插入表格失败')
  }
}

// 插入图片
const insertImage = () => {
  ElMessageBox.prompt('请输入图片地址', '插入图片', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    inputErrorMessage: '请输入有效的图片地址',
  })
    .then(({ value }) => {
      if (!editorInstance.value) return

      const imageUrl = value.startsWith('http') ? value : `https://${value}`

      try {
        editorInstance.value.chain().focus().setImage({ src: imageUrl }).run()
        ElMessage.success('图片插入成功')
      } catch (error) {
        console.error('Insert image failed:', error)
        ElMessage.error('插入图片失败')
      }
    })
    .catch(() => {
      // 用户取消
    })
}

// 导出内容
const exportContent = () => {
  if (!content.value) {
    ElMessage.warning('没有内容可导出')
    return
  }

  try {
    // 创建下载链接
    const blob = new Blob([content.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `content-${new Date().getTime()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('内容导出成功')
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('导出失败')
  }
}

// 预览内容
const previewContent = () => {
  if (!content.value) {
    ElMessage.warning('没有内容可预览')
    return
  }
  showPreview.value = true
}

// 复制 HTML
const copyHtml = async () => {
  try {
    await navigator.clipboard.writeText(content.value)
    ElMessage.success('HTML 已复制到剪贴板')
    showPreview.value = false
  } catch (error) {
    console.error('Copy failed:', error)
    ElMessage.error('复制失败')
  }
}

// 页面标题和描述定义
defineOptions({
  name: 'TiptapView',
})
</script>

<style scoped lang="scss">
.tiptap-view {
  width: 100%;
}

.preview-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;

  // 模拟文章预览样式
  :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--el-text-color-primary);
  }

  :deep(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    color: var(--el-text-color-primary);
  }

  :deep(p) {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: var(--el-text-color-regular);
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1rem;
    padding-left: 2rem;
    color: var(--el-text-color-regular);
  }

  :deep(li) {
    margin-bottom: 0.5rem;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--el-color-primary);
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: var(--el-text-color-secondary);
    font-style: italic;
  }

  :deep(code) {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;

    code {
      background: none;
      color: var(--el-text-color-primary);
      padding: 0;
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;

    th,
    td {
      border: 1px solid var(--el-border-color-light);
      padding: 0.75rem;
      text-align: left;
    }

    th {
      background: var(--el-fill-color-light);
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: var(--el-fill-color-extra-light);
    }
  }

  :deep(hr) {
    border: none;
    border-top: 2px solid var(--el-border-color-light);
    margin: 2rem 0;
  }

  :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .preview-content {
    padding: 16px;

    :deep(h1) {
      font-size: 1.5rem;
    }

    :deep(h2) {
      font-size: 1.3rem;
    }
  }
}
</style>
