<template>
  <div class="wang-editor-view">
    <!-- wangEditor 容器 -->
    <div class="editor-container">
      <div class="editor-wrapper">
        <wang-editor
          v-model="content"
          :height="500"
          :config="editorConfig"
          placeholder="开始编辑你的内容..."
          @ready="onEditorReady"
          @change="onContentChange"
        />
      </div>

      <!-- 状态栏 -->
      <div class="editor-statusbar">
        <div class="statusbar-left">
          <el-text size="small" type="info"> 字符数: {{ charCount }} </el-text>
          <el-divider direction="vertical" />
          <el-text size="small" type="info"> 最后保存: {{ lastSaved.toLocaleString() }} </el-text>
        </div>
        <div class="statusbar-right">
          <el-space>
            <el-button size="small" text @click="previewContent">
              <el-icon><View /></el-icon>
              预览
            </el-button>
            <el-button size="small" text @click="clearContent">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </el-space>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog v-model="showPreview" title="内容预览" width="80%">
      <div class="preview-content" v-html="content"></div>
      <template #footer>
        <el-button @click="showPreview = false">关闭</el-button>
        <el-button type="primary" @click="copyHtml">复制 HTML</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { View, Delete } from '@element-plus/icons-vue'
import WangEditor from '@/components/editor/WangEditor.vue'

// 编辑器状态
const content = ref('')
const lastSaved = ref(new Date())
const showPreview = ref(false)
const editorInstance = ref<any>(null)

// 计算属性
const charCount = computed(() => {
  return content.value.length
})

// wangEditor 配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    // 图片上传配置
    uploadImage: {
      server: '/api/upload/image',
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['image/*'],
      metaWithUrl: true,
      withCredentials: false,
      timeout: 5 * 1000, // 5秒
    },
  },
}

// 示例内容
const exampleContent = `
<h1>wangEditor 演示</h1>
<p>这是一个基于 <strong>wangEditor</strong> 构建的富文本编辑器演示。</p>
<h2>主要特性</h2>
<ul>
  <li>轻量级，易于集成</li>
  <li>开箱即用的丰富功能</li>
  <li>完善的中文文档</li>
  <li>成熟的社区生态</li>
</ul>
<blockquote>
  <p>wangEditor 是一款优秀的国产富文本编辑器，具有良好的兼容性和稳定性。</p>
</blockquote>
<p>开始编辑这段内容，体验 wangEditor 的强大功能！</p>
`

// 编辑器就绪回调
const onEditorReady = (editor: any) => {
  editorInstance.value = editor
  console.log('wangEditor is ready:', editor)

  // 加载初始示例内容
  loadExample()
}

// 内容变化回调
const onContentChange = (value: string) => {
  console.log('Content changed:', value.length, 'characters')
}

// 加载示例内容
const loadExample = () => {
  content.value = exampleContent
  ElMessage.success('示例内容已加载')
}

// 清空内容
const clearContent = () => {
  content.value = ''
  ElMessage.success('内容已清空')
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

// 页面标题定义
defineOptions({
  name: 'WangEditorView',
})
</script>

<style scoped lang="scss">
.wang-editor-view {
  width: 100%;
}

.editor-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.editor-wrapper {
  // wangEditor 样式会在组件内部处理
}

.editor-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--el-fill-color-extra-light);
  border-top: 1px solid var(--el-border-color-light);

  .statusbar-left,
  .statusbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.preview-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;

  // 基础预览样式
  :deep(h1) {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--el-text-color-primary);
  }

  :deep(h2) {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 1.5rem 0 0.8rem 0;
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
    background: var(--el-fill-color-extra-light);
    padding: 1rem;
    border-radius: 0 4px 4px 0;
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
    border: 1px solid var(--el-border-color-light);

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

  :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .editor-statusbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    .statusbar-left,
    .statusbar-right {
      justify-content: center;
    }
  }

  .preview-content {
    padding: 16px;

    :deep(h1) {
      font-size: 1.5rem;
    }

    :deep(h2) {
      font-size: 1.2rem;
    }
  }
}

// 深色主题适配
:root.dark {
  .editor-container {
    border-color: var(--el-border-color-dark);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .editor-statusbar {
    background: var(--el-fill-color-darker);
    border-top-color: var(--el-border-color-dark);
  }
}
</style>
