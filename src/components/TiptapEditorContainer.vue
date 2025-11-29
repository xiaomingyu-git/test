<template>
  <el-card
    :class="['tiptap-editor-container', { 'is-fullscreen': isFullscreen }]"
    :shadow="shadow"
    :body-style="{ padding: 0 }"
  >
    <!-- 标题栏 -->
    <template #header v-if="title || showToolbar">
      <div class="editor-header">
        <div class="editor-title-section">
          <h3 v-if="title" class="editor-title">{{ title }}</h3>
          <div v-if="subtitle" class="editor-subtitle">{{ subtitle }}</div>
        </div>

        <div class="editor-controls">
          <!-- 字符统计 -->
          <div v-if="showCharCount" class="char-count">
            <el-text size="small" type="info">
              字符: {{ charCount }} {{ wordCount > 0 ? `/ ${wordCount}词` : '' }}
            </el-text>
          </div>

          <!-- 主题切换 -->
          <div v-if="showThemeToggle" class="theme-toggle">
            <theme-toggle />
          </div>

          <!-- 全屏按钮 -->
          <el-button
            v-if="allowFullscreen"
            size="small"
            text
            @click="toggleFullscreen"
          >
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </el-button>

          <!-- 预览模式按钮 -->
          <el-button
            v-if="allowPreview"
            size="small"
            text
            @click="togglePreview"
          >
            {{ isPreviewMode ? '编辑' : '预览' }}
          </el-button>
        </div>
      </div>
    </template>

    <!-- 编辑器/预览内容 -->
    <div class="editor-content" :style="{ height: contentHeight }">
      <!-- 预览模式 -->
      <div
        v-show="isPreviewMode"
        class="preview-content"
        v-html="modelValue"
      ></div>

      <!-- 编辑模式 -->
      <tiptap-editor
        v-show="!isPreviewMode"
        ref="editorRef"
        :model-value="modelValue"
        :placeholder="placeholder"
        :editable="editable && !isPreviewMode"
        :autofocus="autofocus && !isPreviewMode"
        :height="editorHeight"
        @update:model-value="handleChange"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @ready="handleReady"
        @save="handleSave"
      />
    </div>

    <!-- 底部状态栏 -->
    <div v-if="showStatusbar" class="editor-statusbar">
      <div class="statusbar-left">
        <el-text v-if="lastSaved" size="small" type="info">
          上次保存: {{ formatTime(lastSaved) }}
        </el-text>
      </div>
      <div class="statusbar-right">
        <el-text v-if="currentPath" size="small" type="info">
          {{ currentPath }}
        </el-text>
        <slot name="statusbar-right" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElCard, ElButton, ElText } from 'element-plus'
import TiptapEditor from './TiptapEditor.vue'
import ThemeToggle from './ThemeToggle.vue'

// Props和Emits
const props = withDefaults(defineProps<{
  modelValue?: string
  title?: string
  subtitle?: string
  placeholder?: string
  editable?: boolean
  autofocus?: boolean
  height?: string | number
  shadow?: 'always' | 'hover' | 'never'
  showToolbar?: boolean
  showStatusbar?: boolean
  showCharCount?: boolean
  showThemeToggle?: boolean
  allowFullscreen?: boolean
  allowPreview?: boolean
  lastSaved?: Date
  currentPath?: string
}>(), {
  shadow: 'always',
  showToolbar: true,
  showStatusbar: false,
  showCharCount: false,
  showThemeToggle: false,
  allowFullscreen: false,
  allowPreview: false,
  editable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'ready': [editor: unknown]
  'fullscreen-change': [isFullscreen: boolean]
  'save': [content: string]
}>()

// 组件状态
const isFullscreen = ref(false)
const isPreviewMode = ref(false)
const charCount = ref(0)
const wordCount = ref(0)
const editorInstance = ref<unknown>(null)
const editorRef = ref<unknown>(null)

// 计算属性
const contentHeight = computed(() => {
  if (isFullscreen.value) {
    return 'calc(100vh - 120px)' // 减去标题栏和状态栏的高度
  }
  return props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto'
})

const editorHeight = computed(() => {
  return isFullscreen.value ? '100%' : 'auto'
})

// 方法
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-change', isFullscreen.value)

  // 全屏时添加/移除类
  if (isFullscreen.value) {
    document.body.classList.add('tiptap-editor-fullscreen')
  } else {
    document.body.classList.remove('tiptap-editor-fullscreen')
  }
}

const togglePreview = () => {
  const wasPreviewMode = isPreviewMode.value
  isPreviewMode.value = !isPreviewMode.value

  // 如果从预览模式切换到编辑模式，延迟设置焦点
  if (wasPreviewMode && editorInstance.value) {
    // 使用nextTick确保DOM已更新
    nextTick(() => {
      setTimeout(() => {
        (editorInstance.value as any)?.commands?.focus()
      }, 100)
    })
  }
}

const updateCharCount = (content: string) => {
  const textContent = content.replace(/<[^>]*>/g, '')
  charCount.value = textContent.length
  wordCount.value = textContent.trim() ? textContent.trim().split(/\s+/).length : 0
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const handleChange = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  updateCharCount(value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleReady = (editor: unknown) => {
  editorInstance.value = editor
  emit('ready', editor)
  if (props.modelValue) {
    updateCharCount(props.modelValue)
  }
}

const handleSave = (content: string) => {
  emit('save', content)
  // 可以在这里添加保存成功的提示
  // 比如更新保存时间等
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    updateCharCount(newValue)
  }
}, { immediate: true })
</script>

<style scoped>
.tiptap-editor-container {
  transition: all 0.3s ease;
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
}

.tiptap-editor-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  margin: 0;
}

.tiptap-editor-container.is-fullscreen .el-card__body {
  height: calc(100vh - 140px); /* 减去header和statusbar */
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
}

.editor-title-section {
  flex: 1;
}

.editor-title {
  margin: 0;
  font-size: var(--el-font-size-large);
  font-weight: var(--el-font-weight-primary);
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.editor-subtitle {
  margin-top: 4px;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.editor-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  white-space: nowrap;
}

.theme-toggle {
  display: flex;
  align-items: center;
}

.editor-content {
  position: relative;
  overflow: hidden;
}

.preview-content {
  padding: 16px;
  min-height: 268px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  word-wrap: break-word;
  white-space: pre-wrap;
}

.preview-content h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 0.5em 0;
  line-height: 1.2;
}

.preview-content h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.75em 0 0.5em;
  line-height: 1.3;
}

.preview-content h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.75em 0 0.5em;
  line-height: 1.4;
}

.preview-content p {
  margin: 0.5em 0;
}

.preview-content ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.preview-content ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.preview-content blockquote {
  border-left: 4px solid var(--el-border-color);
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: var(--el-text-color-regular);
}

.preview-content pre {
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
  line-height: 1.5;
}

.preview-content code {
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 0.125em 0.25em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
}

.preview-content pre code {
  background-color: transparent;
  padding: 0;
}

.editor-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: var(--el-fill-color-extra-light);
  border-top: 1px solid var(--el-border-color-lighter);
  font-size: var(--el-font-size-small);
}

.statusbar-left,
.statusbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 全屏模式下的样式调整 */
:global(.tiptap-editor-fullscreen) {
  overflow: hidden;
}

:global(.tiptap-editor-fullscreen .tiptap-editor-container.is-fullscreen) {
  background: var(--el-bg-color-page);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .editor-controls {
    width: 100%;
    justify-content: space-between;
  }

  .editor-statusbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .statusbar-left,
  .statusbar-right {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .editor-controls {
    flex-wrap: wrap;
    gap: 8px;
  }

  .editor-title {
    font-size: var(--el-font-size-base);
  }
}

/* 打印样式 */
@media print {
  .editor-header,
  .editor-statusbar {
    display: none;
  }

  .tiptap-editor-container {
    box-shadow: none;
    border: 1px solid #ccc;
  }

  .editor-content {
    height: auto !important;
  }
}
</style>