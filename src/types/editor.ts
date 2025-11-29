import type { Editor as TiptapEditor } from '@tiptap/core'

// 编辑器通用类型定义

/**
 * 编辑器配置接口
 */
export interface EditorConfig {
  /** 占位符文本 */
  placeholder?: string
  /** 编辑器高度 */
  height?: string | number
  /** 是否可编辑 */
  editable?: boolean
  /** 是否自动聚焦 */
  autofocus?: boolean
  /** 主题模式 */
  theme?: 'light' | 'dark' | 'auto'
  /** 是否显示字符计数 */
  showCharCount?: boolean
  /** 是否显示主题切换 */
  showThemeToggle?: boolean
  /** 是否允许全屏 */
  allowFullscreen?: boolean
  /** 是否显示状态栏 */
  showStatusbar?: boolean
  /** 最大字符数 */
  maxLength?: number
  /** 最小高度 */
  minHeight?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 自定义CSS类名 */
  className?: string
  /** 编辑器ID */
  id?: string
  /** 内容预处理 */
  contentPreprocessor?: (content: string) => string
  /** 内容后处理 */
  contentPostprocessor?: (content: string) => string
}

export interface EditorEvents {
  /** 内容更新事件 - 用于v-model双向绑定 */
  'update:modelValue': [value: string]
  /** 内容变化事件 - 任何内容改变时触发 */
  change: [value: string]
  /** 获得焦点事件 */
  focus: [event: FocusEvent]
  /** 失去焦点事件 */
  blur: [event: FocusEvent]
  /** 编辑器就绪事件 */
  ready: [editor: TiptapEditor]
  /** 保存事件 */
  save: [content: string]
  /** 全屏状态变化事件 */
  'fullscreen-change': [isFullscreen: boolean]
  /** 字符数变化事件 */
  'char-count-change': [count: number]
}

export interface ToolbarItem {
  /** 工具项类型 */
  type: 'button' | 'dropdown' | 'divider' | 'spacer'
  /** 工具项标题 */
  title?: string
  /** 工具项图标 */
  icon?: string
  /** 是否激活 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击处理函数 */
  handler?: () => void
  /** 下拉菜单项（仅dropdown类型） */
  items?: ToolbarDropdownItem[]
}

export interface ToolbarDropdownItem {
  /** 菜单项文本 */
  text: string
  /** 菜单项值 */
  value: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 点击处理函数 */
  handler?: (value: string | number) => void
}

export interface TableOperation {
  /** 操作类型 */
  type:
    | 'add-row-before'
    | 'add-row-after'
    | 'delete-row'
    | 'add-column-before'
    | 'add-column-after'
    | 'delete-column'
    | 'toggle-header'
    | 'merge-cells'
    | 'split-cell'
    | 'delete-table'
  /** 操作标题 */
  title: string
  /** 操作图标 */
  icon: string
  /** 是否危险操作 */
  danger?: boolean
  /** 操作处理函数 */
  handler: () => void | Promise<void>
}

export interface ImageUploadOptions {
  /** 上传地址 */
  action: string
  /** 请求头 */
  headers?: Record<string, string>
  /** 额外参数 */
  data?: Record<string, any>
  /** 文件字段名 */
  name?: string
  /** 支持的文件类型 */
  accept?: string
  /** 文件大小限制（字节） */
  maxSize?: number
  /** 最多上传数量 */
  limit?: number
}

export interface EditorInstance {
  /** Tiptap编辑器实例 */
  editor: TiptapEditor | null
  /** 是否全屏 */
  isFullscreen: boolean
  /** 字符数 */
  charCount: number
  /** 获取HTML内容 */
  getHTML: () => string
  /** 设置HTML内容 */
  setHTML: (html: string) => void
  /** 获取纯文本内容 */
  getText: () => string
  /** 清空内容 */
  clear: () => void
  /** 聚焦编辑器 */
  focus: () => void
  /** 失焦编辑器 */
  blur: () => void
  /** 切换全屏 */
  toggleFullscreen: () => void
  /** 销毁编辑器 */
  destroy: () => void
}

// WangEditor 相关类型
export interface WangEditorConfig {
  /** 编辑器配置 */
  config?: any
  /** 工具栏配置 */
  toolbarConfig?: any
  /** 其他配置项 */
  [key: string]: any
}
