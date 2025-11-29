<template>
  <div class="wang-editor-toolbar">
    <Toolbar
      v-if="editorInstance"
      :editor="editorInstance"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
  </div>
</template>

<script setup lang="ts">
import { Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor, IToolbarConfig } from '@wangeditor-next/editor'
import { computed } from 'vue'

// WangEditorToolbar组件接口定义
interface WangEditorToolbarProps {
  /** 编辑器实例 */
  editorInstance: IDomEditor

  /** 工具栏配置 */
  config?: Partial<IToolbarConfig>

  /** 工具栏模式 */
  mode?: 'default' | 'simple'
}

const props = withDefaults(defineProps<WangEditorToolbarProps>(), {
  mode: 'default'
})

// 计算工具栏配置
const toolbarConfig = computed((): Partial<IToolbarConfig> => {
  const defaultConfig: Partial<IToolbarConfig> = {
    // 工具栏显示的菜单 - 使用正确的菜单key
    toolbarKeys: [
      // 基本格式
      'headerSelect',
      'bold',
      'italic',
      'underline',
      'through',
      'code',
      'sub',
      'sup',

      // 分割线
      '|',

      // 对齐方式
      'justifyLeft',
      'justifyCenter',
      'justifyRight',

      // 分割线
      '|',

      // 列表
      'bulletedList',
      'numberedList',
      'todo',

      // 分割线
      '|',

      // 缩进
      'indent',
      'delIndent',

      // 分割线
      '|',

      // 颜色
      'color',
      'bgColor',

      // 分割线
      '|',

      // 字体大小
      'fontSize',
      'fontFamily',
      'lineHeight',

      // 分割线
      '|',

      // 链接
      'insertLink',

      // 图片
      'uploadImage',

      // 视频
      'uploadVideo',

      // 表格
      'insertTable',

      // 代码块
      'codeBlock',

      // 分割线
      '|',

      // 引用
      'blockquote',

      // 水平分割线
      'divider',

      // 分割线
      '|',

      // 撤销重做
      'undo',
      'redo'
    ]
  }

  // 合并用户配置
  return Object.assign(defaultConfig, props.config || {})
})

// 编辑器模式
const mode = computed(() => props.mode)

// 为了模板中使用
const editorInstance = computed(() => props.editorInstance)
</script>

<style scoped>
.wang-editor-toolbar {
  border-bottom: 1px solid var(--el-border-color-light);
  background-color: var(--el-bg-color-page);
}

/* 工具栏样式优化 */
:deep(.w-e-toolbar) {
  padding: 8px 12px;
  border: none;
  flex-wrap: wrap;
}

:deep(.w-e-toolbar .w-e-bar-item) {
  margin: 2px 4px;
}

:deep(.w-e-toolbar .w-e-bar-item button) {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-small);
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  transition: all 0.2s ease;
}

:deep(.w-e-toolbar .w-e-bar-item button:hover) {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-6);
  color: var(--el-color-primary);
}

:deep(.w-e-toolbar .w-e-bar-item button.w-e-active) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
}

:deep(.w-e-toolbar .w-e-bar-item button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.w-e-toolbar .w-e-bar-item button:disabled:hover) {
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-lighter);
  color: var(--el-text-color-primary);
}

/* 下拉菜单样式 */
:deep(.w-e-toolbar .w-e-select-list) {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  background-color: var(--el-bg-color);
}

:deep(.w-e-toolbar .w-e-select-list .w-e-select-item) {
  padding: 8px 12px;
  color: var(--el-text-color-primary);
}

:deep(.w-e-toolbar .w-e-select-list .w-e-select-item:hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.w-e-toolbar .w-e-select-list .w-e-select-item.w-e-active) {
  background-color: var(--el-color-primary);
  color: white;
}

/* 弹出框样式 */
:deep(.w-e-modal) {
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow);
}

:deep(.w-e-modal .w-e-modal-header) {
  background-color: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base) var(--el-border-radius-base) 0 0;
}

:deep(.w-e-modal .w-e-modal-title) {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

:deep(.w-e-modal .w-e-modal-body) {
  padding: 20px;
}

:deep(.w-e-modal .w-e-modal-footer) {
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-light);
  border-radius: 0 0 var(--el-border-radius-base) var(--el-border-radius-base);
  padding: 12px 20px;
}

:deep(.w-e-modal .w-e-modal-btn-container button) {
  border-radius: var(--el-border-radius-base);
  margin-left: 8px;
}

:deep(.w-e-modal .w-e-modal-btn-container button.w-e-btn-primary) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

:deep(.w-e-modal .w-e-modal-btn-container button.w-e-btn-primary:hover) {
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

/* 工具提示样式 */
:deep(.w-e-tooltip) {
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  color: var(--el-text-color-primary);
  font-size: 12px;
}

/* 颜色选择器样式 */
:deep(.w-e-color-picker) {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
}

/* 字体大小选择器样式 */
:deep(.w-e-font-size--wrap) {
  min-width: 80px;
}

/* 表格编辑样式 */
:deep(.w-e-table-container) {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.w-e-toolbar) {
    padding: 6px 8px;
  }

  :deep(.w-e-toolbar .w-e-bar-item) {
    margin: 1px 2px;
  }

  :deep(.w-e-toolbar .w-e-bar-item button) {
    padding: 6px 8px;
    font-size: 12px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  :deep(.w-e-toolbar .w-e-bar-item button) {
    background-color: var(--el-bg-color-page);
    border-color: var(--el-border-color);
  }

  :deep(.w-e-toolbar .w-e-bar-item button:hover) {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary);
  }
}
</style>