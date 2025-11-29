<template>
  <div class="tiptap-editor">
    <TiptapToolbar v-if="editor" :editor="editor" />
    <div class="editor-container" :style="{ height: containerHeight }">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { watch, onBeforeUnmount, nextTick, computed } from 'vue'
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

// 为Toolbar提供一个类型安全的方法 - 使用明确的返回类型
const editorForToolbar = computed((): unknown => editor.value)

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
        // case 'u':
        //   event.preventDefault()
        //   editor.value.chain().focus().toggleUnderline().run()
        //   break
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
@import '../styles/tiptap-element-plus.css';
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
</style>