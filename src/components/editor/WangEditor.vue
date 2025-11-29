<template>
  <div class="wang-editor">
    <WangEditorToolbar
      v-if="editorRef"
      :editorInstance="editorRef"
      :config="toolbarConfig"
    />
    <div
      class="editor-container"
      :style="{ height: containerHeight }"
    >
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customPaste="handleCustomPaste"
        @customAlert="handleCustomAlert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor-next/editor/dist/css/style.css'
import '@/styles/wang-editor-element-plus.css'
import { Editor } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { ref, shallowRef, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import WangEditorToolbar from './WangEditorToolbar.vue'

// WangEditor组件接口定义
interface WangEditorProps {
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

  /** 编辑器模式 */
  mode?: 'default' | 'simple'

  /** 是否只读 */
  readonly?: boolean
}

/** 编辑器事件类型定义 */
interface WangEditorEmits {
  /** 内容更新事件 - 用于v-model双向绑定 */
  'update:modelValue': [value: string]

  /** 内容变化事件 - 任何内容改变时触发 */
  'change': [value: string]

  /** 获得焦点事件 */
  'focus': [event: FocusEvent]

  /** 失去焦点事件 */
  'blur': [event: FocusEvent]

  /** 编辑器就绪事件 */
  'ready': [editor: IDomEditor]

  /** 编辑器销毁事件 */
  'destroyed': [editor: IDomEditor]

  /** 保存事件 */
  'save': [content: string]

  /** 最大长度事件 */
  'maxLength': [editor: IDomEditor]
}

const props = withDefaults(defineProps<WangEditorProps>(), {
  modelValue: '',
  editable: true,
  autofocus: false,
  height: 300,
  mode: 'default',
  placeholder: '请输入内容...',
  readonly: false
})

const emit = defineEmits<WangEditorEmits>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref(props.modelValue || '<p></p>')

// 计算容器高度
const containerHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})

// 工具栏配置
const toolbarConfig = ref<Partial<IToolbarConfig>>({})

// 编辑器配置
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: props.placeholder,
  readOnly: props.readonly,
  autoFocus: props.autofocus,

  // 配置上传图片
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload', // 服务器上传地址
      base64LimitSize: 10 * 1024 * 1024, // 10MB，base64转换限制
      // 自定义图片上传
      customUpload: (file: File, insertFn: (url: string, alt?: string, href?: string) => void) => {
        // 这里可以实现自己的上传逻辑
        // 临时使用本地预览
        const url = URL.createObjectURL(file)
        insertFn(url, file.name, url)
      },
      metaWithUrl: true,
      onSuccess: () => {},
      onFailed: () => {},
      onError: () => {}
    },
    // 配置上传视频
    uploadVideo: {
      server: '/api/upload/video',
      customUpload: (file: File, insertFn: (url: string, poster?: string) => void) => {
        // 这里可以实现自己的上传逻辑
        const url = URL.createObjectURL(file)
        insertFn(url, url)
      },
      metaWithUrl: true,
      onSuccess: () => {},
      onFailed: () => {},
      onError: () => {}
    },
    // 配置链接校验
    insertLink: {
      checkLink: (link: string) => {
        // 简单的URL校验
        return /^https?:\/\//.test(link)
      },
      parseLinkUrl: (url: string) => {
        return url.startsWith('http') ? url : `https://${url}`
      }
    },
    // 配置代码块语言选择
    codeSelectLang: {
      // 代码语言列表
      codeLangs: [
        { text: 'CSS', value: 'css' },
        { text: 'HTML', value: 'html' },
        { text: 'XML', value: 'xml' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'typescript' },
        { text: 'JSON', value: 'json' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C++', value: 'cpp' },
        { text: 'C#', value: 'csharp' },
        { text: 'PHP', value: 'php' },
        { text: 'SQL', value: 'sql' },
        { text: 'Go', value: 'go' },
        { text: 'Rust', value: 'rust' },
        { text: 'Shell', value: 'shell' },
        { text: 'YAML', value: 'yaml' },
        { text: 'Markdown', value: 'markdown' }
      ]
    }
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== valueHtml.value) {
    valueHtml.value = newValue || '<p></p>'
  }
})

// 监听editable变化
watch(() => props.editable, (newValue) => {
  if (editorRef.value && newValue !== undefined) {
    if (newValue) {
      editorRef.value.enable()
    } else {
      editorRef.value.disable()
    }
  }
})

// 监听readonly变化
watch(() => props.readonly, (newValue) => {
  if (editorRef.value) {
    if (newValue) {
      editorRef.value.disable()
    } else {
      editorRef.value.enable()
    }
  }
})

// 编辑器创建完成
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
  emit('ready', editor)

  // 设置初始焦点
  if (props.autofocus) {
    nextTick(() => {
      editor.focus()
    })
  }
}

// 编辑器内容变化
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml()
  valueHtml.value = html
  emit('update:modelValue', html)
  emit('change', html)
}

// 编辑器销毁
const handleDestroyed = (editor: IDomEditor) => {
  emit('destroyed', editor)
}

// 获得焦点
const handleFocus = (_editor: IDomEditor) => {
  emit('focus', new FocusEvent('focus'))
}

// 失去焦点
const handleBlur = (_editor: IDomEditor) => {
  emit('blur', new FocusEvent('blur'))
}

// 自定义粘贴
const handleCustomPaste = (editor: IDomEditor, event: ClipboardEvent, callback: (flag: boolean) => void) => {
  // 可以在这里处理自定义粘贴逻辑
  // callback(false) // 阻止默认粘贴行为
  callback(true) // 继续默认粘贴行为
}

// 自定义提示
const handleCustomAlert = (info: string, type: string) => {
  // 可以在这里使用项目的消息提示组件
  console.warn(`WangEditor ${type}: ${info}`)
}

// 键盘快捷键处理
const setupKeyboardShortcuts = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!editorRef.value || !props.editable) return

    const { ctrlKey, metaKey, key } = event
    const modKey = ctrlKey || metaKey

    if (modKey && key.toLowerCase() === 's') {
      event.preventDefault()
      emit('save', editorRef.value.getHtml())
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}

// 设置快捷键
const removeKeyboardListeners = setupKeyboardShortcuts()

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()

  if (removeKeyboardListeners) {
    removeKeyboardListeners()
  }
})

// 暴露编辑器实例给父组件
defineExpose({
  editor: editorRef,
  getEditor: () => editorRef.value,
  insertText: (text: string) => {
    const editor = editorRef.value
    if (editor == null) return
    editor.insertText(text)
  },
  setHtml: (html: string) => {
    const editor = editorRef.value
    if (editor == null) return
    editor.setHtml(html)
  },
  getHtml: () => {
    const editor = editorRef.value
    return editor?.getHtml() || ''
  },
  focus: () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.focus()
  },
  blur: () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.blur()
  }
})
</script>

<style scoped>
/* WangEditor 主容器样式已移至 wang-editor-element-plus.css */
/* 此处保留必要的容器样式和覆盖 */

.wang-editor {
  /* 确保容器最小高度 */
  min-height: var(--wang-editor-container-min-height, 300px);
}

.editor-container {
  overflow: hidden;
  /* 确保内容区域的最小高度 */
  min-height: calc(var(--wang-editor-container-min-height, 300px) - var(--wang-editor-toolbar-height, 40px));
}

/* 确保编辑器区域可以正常扩展 */
:deep(.w-e-text-container) {
  min-height: inherit;
}

/* 响应式设计补充 */
@media (max-width: 768px) {
  .wang-editor {
    border-radius: var(--el-border-radius-small);
  }
}

@media (max-width: 480px) {
  .wang-editor {
    border-radius: 0;
  }
}
</style>