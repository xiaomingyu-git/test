<template>
  <div class="tiptap-editor-container" :class="{ 'is-fullscreen': isFullscreen }">
    <el-card class="editor-card" :shadow="!isFullscreen ? 'hover' : 'never'">
      <!-- 头部区域 -->
      <template #header v-if="title || subtitle || $slots.toolbarExtra">
        <div class="editor-header">
          <div class="editor-header__content">
            <h3 v-if="title" class="editor-title">{{ title }}</h3>
            <p v-if="subtitle" class="editor-subtitle">{{ subtitle }}</p>
          </div>
          <div class="editor-header__actions">
            <!-- 主题切换 -->
            <theme-toggle v-if="showThemeToggle" />
            <!-- 全屏切换 -->
            <el-button
              v-if="allowFullscreen"
              :icon="isFullscreen ? 'Close' : 'FullScreen'"
              circle
              text
              @click="toggleFullscreen"
              :title="isFullscreen ? '退出全屏' : '全屏编辑'"
            />
          </div>
        </div>
      </template>

      <!-- 额外工具栏 -->
      <div v-if="$slots.toolbarExtra" class="extra-toolbar">
        <slot name="toolbarExtra" />
      </div>

      <!-- 编辑器主体 -->
      <div class="editor-body">
        <tiptap-editor
          :value="modelValue"
          @update:value="onEditorChange"
          :placeholder="placeholder"
          :height="editorHeight"
          :editable="editable"
          :autofocus="autofocus"
          :show-char-count="false"
          @ready="onEditorReady"
          @focus="onEditorFocus"
          @blur="onEditorBlur"
          @save="onEditorSave"
        />
      </div>

      <!-- 状态栏 -->
      <div v-if="showStatusbar || showCharCount || $slots.statusbarRight" class="editor-statusbar">
        <div class="statusbar-left">
          <el-text v-if="showCharCount" size="small" type="info"> 字符数: {{ charCount }} </el-text>
          <el-divider v-if="showCharCount && lastSaved" direction="vertical" />
          <el-text v-if="lastSaved" size="small" type="info">
            最后保存: {{ formatTime(lastSaved) }}
          </el-text>
        </div>
        <div class="statusbar-right">
          <slot name="statusbarRight" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { ElCard, ElButton, ElDivider, ElText } from 'element-plus'
import TiptapEditor from './TiptapEditor.vue'
import ThemeToggle from '../common/ThemeToggle.vue'
import type { Editor } from '@tiptap/core'

interface Props {
  /** 编辑器内容 */
  modelValue: string
  /** 编辑器标题 */
  title?: string
  /** 编辑器副标题 */
  subtitle?: string
  /** 占位符文本 */
  placeholder?: string
  /** 编辑器高度 */
  height?: string | number
  /** 是否可编辑 */
  editable?: boolean
  /** 是否自动聚焦 */
  autofocus?: boolean
  /** 是否显示字符计数 */
  showCharCount?: boolean
  /** 是否显示主题切换 */
  showThemeToggle?: boolean
  /** 是否允许全屏 */
  allowFullscreen?: boolean
  /** 是否显示状态栏 */
  showStatusbar?: boolean
  /** 最后保存时间 */
  lastSaved?: Date
}

interface Emits {
  /** 内容更新事件 */
  'update:modelValue': [value: string]
  /** 内容变化事件 */
  change: [value: string]
  /** 编辑器就绪事件 */
  ready: [editor: Editor]
  /** 获得焦点事件 */
  focus: [event: FocusEvent]
  /** 失去焦点事件 */
  blur: [event: FocusEvent]
  /** 保存事件 */
  save: [content: string]
  /** 全屏状态变化事件 */
  'fullscreen-change': [isFullscreen: boolean]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容...',
  editable: true,
  autofocus: false,
  showCharCount: true,
  showThemeToggle: false,
  allowFullscreen: false,
  showStatusbar: false,
})

const emit = defineEmits<Emits>()

// 注入编辑器布局上下文（如果存在）
const editorLayout = inject('editorLayout', {
  isFullscreen: { value: false },
  toggleFullscreen: () => {},
  allowFullscreen: false,
})

// 内部状态
const editorInstance = ref<Editor | null>(null)
const isFullscreen = ref(false)

// 计算属性
const charCount = computed(() => {
  return props.modelValue.length
})

const editorHeight = computed(() => {
  if (isFullscreen.value) {
    return 'calc(100vh - 200px)'
  }
  return props.height || '400px'
})

// 切换全屏
const toggleFullscreen = () => {
  if (props.allowFullscreen || editorLayout.allowFullscreen) {
    if (editorLayout.toggleFullscreen) {
      editorLayout.toggleFullscreen()
    } else {
      isFullscreen.value = !isFullscreen.value
    }
    emit('fullscreen-change', isFullscreen.value)
  }
}

// 格式化时间
const formatTime = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 编辑器事件处理
const onEditorReady = (editor: Editor) => {
  editorInstance.value = editor
  emit('ready', editor)
}

const onEditorChange = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onEditorFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const onEditorBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const onEditorSave = (content: string) => {
  emit('save', content)
}

// 监听布局的全屏状态变化
if (editorLayout.isFullscreen) {
  watch(
    () => editorLayout.isFullscreen.value,
    (newVal) => {
      isFullscreen.value = newVal
    },
    { immediate: true },
  )
}
</script>

<style scoped lang="scss">
.tiptap-editor-container {
  width: 100%;
  transition: all 0.3s ease;

  &.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: var(--el-bg-color);

    .editor-card {
      height: 100vh;
      display: flex;
      flex-direction: column;
      border: none;
      border-radius: 0;
    }

    .editor-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}

.editor-card {
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-border-color);
  }

  .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .el-card__body {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  &__content {
    flex: 1;

    .editor-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 4px 0;
    }

    .editor-subtitle {
      font-size: 0.9rem;
      color: var(--el-text-color-regular);
      margin: 0;
      line-height: 1.4;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
}

.extra-toolbar {
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-extra-light);
}

.editor-body {
  flex: 1;
  min-height: 200px;
}

.editor-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--el-fill-color-extra-light);
  border-top: 1px solid var(--el-border-color-lighter);
  min-height: 52px;

  .statusbar-left,
  .statusbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .el-divider--vertical {
    margin: 0;
  }
}

// 全屏模式下的样式调整
.tiptap-editor-container.is-fullscreen {
  .editor-card .el-card__header {
    padding: 20px 24px;
  }

  .extra-toolbar {
    padding: 16px 24px;
  }

  .editor-statusbar {
    padding: 16px 24px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    &__actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .editor-statusbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    .statusbar-left,
    .statusbar-right {
      justify-content: center;
    }
  }

  .tiptap-editor-container.is-fullscreen {
    .editor-header {
      flex-direction: row;
      align-items: center;
      padding: 16px 20px;
    }

    .editor-statusbar {
      flex-direction: row;
      gap: 12px;
      align-items: center;
      padding: 12px 20px;
    }
  }
}

// 深色主题适配
:root.dark {
  .editor-card {
    border-color: var(--el-border-color-dark);
    background-color: var(--el-bg-color);

    .el-card__header {
      border-bottom-color: var(--el-border-color-dark);
    }
  }

  .extra-toolbar,
  .editor-statusbar {
    background: var(--el-fill-color-darker);
    border-top-color: var(--el-border-color-dark);
  }
}
</style>
