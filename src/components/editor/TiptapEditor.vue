<template>
  <div class="tiptap-editor">
    <TiptapToolbar v-if="editor" :editorInstance="editor" />
    <div class="editor-container" :style="{ height: containerHeight }">
      <editor-content :editor="editor" />
      <!-- 表格工具栏，当选中表格时显示 -->
      <div
        v-if="editor && editor.isActive('table')"
        class="enhanced-table-toolbar"
      >
        <el-card shadow="hover">
          <div class="toolbar-header">
            <span class="toolbar-title">
              <el-icon><Grid /></el-icon>
              表格操作
            </span>
          </div>

          <div class="toolbar-sections">
            <!-- 行操作 -->
            <div class="toolbar-section">
              <span class="section-title">行操作</span>
              <el-space size="small">
                <el-button size="small" @click="addRowBefore" title="在上方添加行">
                  <el-icon><ArrowUp /></el-icon>
                </el-button>
                <el-button size="small" @click="addRowAfter" title="在下方添加行">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <el-button size="small" @click="deleteRow" type="danger" title="删除当前行">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-space>
            </div>

            <!-- 列操作 -->
            <div class="toolbar-section">
              <span class="section-title">列操作</span>
              <el-space size="small">
                <el-button size="small" @click="addColumnBefore" title="在左侧添加列">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button size="small" @click="addColumnAfter" title="在右侧添加列">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
                <el-button size="small" @click="deleteColumn" type="danger" title="删除当前列">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-space>
            </div>

            <!-- 表格操作 -->
            <div class="toolbar-section">
              <span class="section-title">表格操作</span>
              <el-space size="small">
                <el-button size="small" @click="toggleHeaderRow" title="切换表头行">
                  H
                </el-button>
                <el-button size="small" @click="mergeCells" :disabled="!canMergeCells" title="合并单元格">
                  合并
                </el-button>
                <el-button size="small" @click="splitCell" :disabled="!canSplitCell" title="拆分单元格">
                  拆分
                </el-button>
                <el-button size="small" @click="deleteTable" type="danger" title="删除整个表格">
                  删除表格
                </el-button>
              </el-space>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { createLowlight } from 'lowlight'
import { watch, onBeforeUnmount, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Grid, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Delete } from '@element-plus/icons-vue'
import TiptapToolbar from './TiptapToolbar.vue'

// 导入所有常用语言 - 使用lowlight内置的common集合
import { common } from 'lowlight'

// 导入highlight.js主题
import 'highlight.js/styles/github.css'

// 创建lowlight实例，使用内置的common语言集合
const lowlight = createLowlight(common)

import type { Editor } from '@tiptap/core'


// TiptapEditor组件接口定义 - 使用JSDoc注释
interface TiptapEditorProps {
  /** 编辑器内容 - 支持双向绑定 */
  modelValue?: string

  /** 占位符文本 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 是否自动聚焦 */
  autofocus?: boolean

  /** 编辑器高度 */
  height?: string | number
}

/** 编辑器事件类型定义 */
interface TiptapEditorEmits {
  /** 内容更新事件 - 用于v-model双向绑定 */
  'update:modelValue': [value: string]

  /** 内容变化事件 - 任何内容改变时触发 */
  'change': [value: string]

  /** 获得焦点事件 */
  'focus': [event: FocusEvent]

  /** 失去焦点事件 */
  'blur': [event: FocusEvent]

  /** 编辑器就绪事件 */
  'ready': [editor: Editor]

  /** 保存事件 */
  'save': [content: string]
}

const props = withDefaults(defineProps<TiptapEditorProps>(), {
  modelValue: '',
  editable: true,
  autofocus: false,
  height: undefined,
  placeholder: undefined,
})

const emit = defineEmits<TiptapEditorEmits>()

// 创建编辑器实例
const editor = useEditor({
  content: props.modelValue || '',
  editable: props.editable ?? true,
  autofocus: props.autofocus ?? false,
  extensions: [
    StarterKit.configure({
      codeBlock: false, // 禁用默认的CodeBlock，使用我们自己的
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript',
      HTMLAttributes: {
        class: 'code-block-wrapper',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'tiptap-image',
      },
      inline: false,
    }),
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,
      HTMLAttributes: {
        class: 'tiptap-table',
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'tiptap-table-row',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'tiptap-table-header',
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'tiptap-table-cell',
      },
    }),
    ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
  onFocus: ({ event }) => {
    emit('focus', event)
  },
  onBlur: ({ event }) => {
    emit('blur', event)
  },
  onCreate: ({ editor }) => {
    emit('ready', editor)
  }
})

// 监听editable变化
watch(() => props.editable, (newValue) => {
  if (editor.value && newValue !== undefined) {
    editor.value.setEditable(newValue)
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== undefined && editor.value.getHTML() !== newValue) {
    // 如果编辑器不可编辑，直接设置内容
    if (!props.editable) {
      editor.value.commands.setContent(newValue, { emitUpdate: false })
    } else {
      // 可编辑时，只有在内容真正不同时才设置，避免破坏光标位置
      const currentHtml = editor.value.getHTML()
      if (currentHtml !== newValue) {
        editor.value.commands.setContent(newValue, { emitUpdate: false })
      }
    }
  }
})


// 监听autofocus变化
watch(() => props.autofocus, (newValue) => {
  if (editor.value && newValue) {
    nextTick(() => {
      editor.value?.commands?.focus()
    })
  }
})

// 添加键盘快捷键监听 - 使用明确的返回类型
const setupKeyboardShortcuts = (): (() => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!editor.value || !props.editable) return

    const { ctrlKey, metaKey, shiftKey, altKey, key } = event
    const modKey = ctrlKey || metaKey // 支持 Ctrl (Windows/Linux) 和 Cmd (Mac)

    // 格式化快捷键
    if (modKey && !shiftKey && !altKey) {
      switch (key.toLowerCase()) {
        case 'b':
          event.preventDefault()
          editor.value.chain().focus().toggleBold().run()
          break
        case 'i':
          event.preventDefault()
          editor.value.chain().focus().toggleItalic().run()
          break
        case 'u':
          event.preventDefault()
          editor.value.chain().focus().toggleUnderline().run()
          break
        case 'k':
          event.preventDefault()
          // 插入链接
          const url = window.prompt('请输入链接地址:')
          if (url) {
            const fullUrl = url.startsWith('http') ? url : `https://${url}`
            editor.value.chain().focus().setLink({ href: fullUrl }).run()
          }
          break
        case 's':
          event.preventDefault()
          // 触发保存事件
          emit('save', editor.value.getHTML())
          break
      }
    }

    // 标题快捷键 (Ctrl/Cmd + Shift + 数字)
    if (modKey && shiftKey && !altKey) {
      const num = parseInt(key)
      if (num >= 1 && num <= 6) {
        event.preventDefault()
        editor.value.chain().focus().toggleHeading({ level: num as 1 | 2 | 3 | 4 | 5 | 6 }).run()
      }
    }

    // 其他快捷键
    if (modKey && shiftKey && !altKey) {
      switch (key.toLowerCase()) {
        case '8':
          event.preventDefault()
          editor.value.chain().focus().toggleBulletList().run()
          break
        case '9':
          event.preventDefault()
          editor.value.chain().focus().toggleOrderedList().run()
          break
        case '>':
          event.preventDefault()
          editor.value.chain().focus().toggleBlockquote().run()
          break
        case 'l':
          event.preventDefault()
          editor.value.chain().focus().setTextAlign('left').run()
          break
        case 'e':
          event.preventDefault()
          editor.value.chain().focus().setTextAlign('center').run()
          break
        case 'r':
          event.preventDefault()
          editor.value.chain().focus().setTextAlign('right').run()
          break
              }
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}

// 计算容器高度 - 使用明确的返回类型
const containerHeight = computed((): string => {
  return props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : '300px'
})

// 表格操作方法
const addRowBefore = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().addRowBefore().run()
    ElMessage.success('已在上方添加行')
  } catch (error) {
    console.error('添加行失败:', error)
    ElMessage.error('添加行失败')
  }
}

const addRowAfter = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().addRowAfter().run()
    ElMessage.success('已在下方添加行')
  } catch (error) {
    console.error('添加行失败:', error)
    ElMessage.error('添加行失败')
  }
}

const deleteRow = (): void => {
  if (!editor.value) return

  ElMessageBox.confirm('确定要删除当前行吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    try {
      editor.value?.chain().focus().deleteRow().run()
      ElMessage.success('已删除行')
    } catch (error) {
      console.error('删除行失败:', error)
      ElMessage.error('删除行失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const addColumnBefore = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().addColumnBefore().run()
    ElMessage.success('已在左侧添加列')
  } catch (error) {
    console.error('添加列失败:', error)
    ElMessage.error('添加列失败')
  }
}

const addColumnAfter = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().addColumnAfter().run()
    ElMessage.success('已在右侧添加列')
  } catch (error) {
    console.error('添加列失败:', error)
    ElMessage.error('添加列失败')
  }
}

const deleteColumn = (): void => {
  if (!editor.value) return

  ElMessageBox.confirm('确定要删除当前列吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    try {
      editor.value?.chain().focus().deleteColumn().run()
      ElMessage.success('已删除列')
    } catch (error) {
      console.error('删除列失败:', error)
      ElMessage.error('删除列失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

const toggleHeaderRow = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().toggleHeaderRow().run()
    ElMessage.success('已切换表头行')
  } catch (error) {
    console.error('切换表头行失败:', error)
    ElMessage.error('切换表头行失败')
  }
}

const canMergeCells = computed((): boolean => {
  return editor.value ? editor.value.can().mergeCells() : false
})

const mergeCells = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().mergeCells().run()
    ElMessage.success('已合并单元格')
  } catch (error) {
    console.error('合并单元格失败:', error)
    ElMessage.error('合并单元格失败')
  }
}

const canSplitCell = computed((): boolean => {
  return editor.value ? editor.value.can().splitCell() : false
})

const splitCell = (): void => {
  if (!editor.value) return
  try {
    editor.value.chain().focus().splitCell().run()
    ElMessage.success('已拆分单元格')
  } catch (error) {
    console.error('拆分单元格失败:', error)
    ElMessage.error('拆分单元格失败')
  }
}

const deleteTable = (): void => {
  if (!editor.value) return

  ElMessageBox.confirm('确定要删除整个表格吗？此操作无法撤销。', '确认删除', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    try {
      editor.value?.chain().focus().deleteTable().run()
      ElMessage.success('已删除表格')
    } catch (error) {
      console.error('删除表格失败:', error)
      ElMessage.error('删除表格失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 设置快捷键
const removeKeyboardListeners = setupKeyboardShortcuts()

// 组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
  if (removeKeyboardListeners) {
    removeKeyboardListeners()
  }
})
</script>

<style scoped>
@import '../../styles/tiptap-element-plus.css';
/* Prism.js样式已在组件中导入 */

.tiptap-editor {
  width: 100%;
}

.editor-container {
  min-height: var(--tiptap-container-min-height);
}

:deep(.ProseMirror) {
  outline: none;
}

/* 组件特定的样式覆盖 */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
}

/* 图片样式 */
:deep(.tiptap-image) {
  max-width: 100%;
  height: auto;
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.tiptap-image:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 选中的图片样式 */
:deep(.ProseMirror-selectednode .tiptap-image) {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

/* 表格样式 */
:deep(.tiptap-table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 16px 0;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

:deep(.tiptap-table td),
:deep(.tiptap-table th) {
  min-width: 1em;
  border: 1px solid var(--el-border-color-light);
  padding: 8px 12px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

:deep(.tiptap-table th) {
  font-weight: 600;
  text-align: left;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

:deep(.tiptap-table .selectedCell) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.tiptap-table .column-resize-handle) {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: var(--el-color-primary);
  pointer-events: none;
}

:deep(.tiptap-table p) {
  margin: 0;
}

/* 增强表格工具栏 */
.enhanced-table-toolbar {
  position: sticky;
  top: 8px;
  z-index: 10;
  margin: 8px 0;
}

.enhanced-table-toolbar .el-card {
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-header {
  padding: 12px 16px 8px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.toolbar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.toolbar-sections {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-weight: 500;
  color: var(--el-text-color-regular);
  font-size: 12px;
  min-width: 60px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-sections {
    padding: 8px 12px;
  }

  .toolbar-section {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .section-title {
    text-align: center;
    min-width: auto;
  }

  .el-space {
    justify-content: center;
  }
}
</style>