<template v-if="editorInstance">
  <div class="tiptap-toolbar">
    <el-space wrap>
      <!-- 撤销/重做 -->
      <el-button-group>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().undo().run()"
          :disabled="!safeEditorInstance?.can().undo()"
          title="撤销"
        >
          撤销
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().redo().run()"
          :disabled="!safeEditorInstance?.can().redo()"
          title="重做"
        >
          重做
        </el-button>
      </el-button-group>

      <!-- 标题级别 -->
      <el-dropdown @command="setHeading" trigger="click">
        <el-button size="small"> 标题 ▼ </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="paragraph">正文</el-dropdown-item>
            <el-dropdown-item command="heading-1">标题 1</el-dropdown-item>
            <el-dropdown-item command="heading-2">标题 2</el-dropdown-item>
            <el-dropdown-item command="heading-3">标题 3</el-dropdown-item>
            <el-dropdown-item command="heading-4">标题 4</el-dropdown-item>
            <el-dropdown-item command="heading-5">标题 5</el-dropdown-item>
            <el-dropdown-item command="heading-6">标题 6</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 文本格式 -->
      <el-button-group>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleBold().run()"
          :type="safeEditorInstance?.isActive('bold') ? 'primary' : 'default'"
          title="粗体 (Ctrl+B)"
        >
          粗体
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleItalic().run()"
          :type="safeEditorInstance?.isActive('italic') ? 'primary' : 'default'"
          title="斜体 (Ctrl+I)"
        >
          斜体
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleUnderline().run()"
          :type="safeEditorInstance?.isActive('underline') ? 'primary' : 'default'"
          title="下划线 (Ctrl+U)"
        >
          下划线
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleStrike().run()"
          :type="safeEditorInstance?.isActive('strike') ? 'primary' : 'default'"
          title="删除线"
        >
          删除线
        </el-button>
      </el-button-group>

      <!-- 列表 -->
      <el-button-group>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleBulletList().run()"
          :type="safeEditorInstance?.isActive('bulletList') ? 'primary' : 'default'"
          title="无序列表"
        >
          • 列表
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleOrderedList().run()"
          :type="safeEditorInstance?.isActive('orderedList') ? 'primary' : 'default'"
          title="有序列表"
        >
          1. 列表
        </el-button>
      </el-button-group>

      <!-- 对齐方式 -->
      <el-button-group>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().setTextAlign('left').run()"
          :type="safeEditorInstance?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
          title="左对齐"
        >
          左对齐
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().setTextAlign('center').run()"
          :type="safeEditorInstance?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
          title="居中对齐"
        >
          居中
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().setTextAlign('right').run()"
          :type="safeEditorInstance?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
          title="右对齐"
        >
          右对齐
        </el-button>
      </el-button-group>

      <!-- 其他格式 -->
      <el-button-group>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleBlockquote().run()"
          :type="safeEditorInstance?.isActive('blockquote') ? 'primary' : 'default'"
          title="引用"
        >
          引用
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleCode().run()"
          :type="safeEditorInstance?.isActive('code') ? 'primary' : 'default'"
          title="行内代码"
        >
          代码
        </el-button>
        <el-button
          size="small"
          @click="safeEditorInstance?.chain().focus().toggleCodeBlock().run()"
          :type="safeEditorInstance?.isActive('codeBlock') ? 'primary' : 'default'"
          title="代码块"
        >
          代码块
        </el-button>
      </el-button-group>

      <!-- 水平分割线 -->
      <el-button
        size="small"
        @click="safeEditorInstance?.chain().focus().setHorizontalRule().run()"
        title="插入水平分割线"
      >
        分割线
      </el-button>

      <!-- 清除格式 -->
      <el-button
        size="small"
        @click="safeEditorInstance?.chain().focus().unsetAllMarks().run()"
        title="清除格式"
      >
        清除
      </el-button>

      <!-- 插入链接 -->
      <el-button
        size="small"
        @click="insertLink"
        :type="safeEditorInstance?.isActive('link') ? 'primary' : 'default'"
        title="插入链接"
      >
        链接
      </el-button>

      <!-- 插入图片 -->
      <el-button size="small" @click="insertImage" title="插入图片"> 图片 </el-button>

      <!-- 表格插入 -->
      <el-button
        v-if="!safeEditorInstance?.isActive('table')"
        size="small"
        @click="insertTable"
        title="插入表格 (3x3)"
        :icon="Grid"
      >
        插入表格
      </el-button>
    </el-space>

    <!-- 图片上传对话框 -->
    <ImageUploadDialog v-model="showImageUploadDialog" :editor="editorInstance" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Grid } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import ImageUploadDialog from './ImageUploadDialog.vue'
// 暂时使用简单的文本按钮，稍后添加图标

interface Props {
  editorInstance: any // 使用any类型以匹配实际的Tiptap Editor
}

const props = defineProps<Props>()

// 为了在模板中使用，创建一个计算属性，确保类型安全
const editorInstance = computed(() => props.editorInstance)

// 为模板提供安全的编辑器实例，在模板中使用可选链操作
const safeEditorInstance = computed(() => props.editorInstance)

// 图片上传对话框显示状态
const showImageUploadDialog = ref(false)

// 设置标题级别 - 使用明确的返回类型
const setHeading = (command: string): void => {
  if (!editorInstance.value) return

  const currentEditor = editorInstance.value
  if (command === 'paragraph') {
    currentEditor.chain().focus().setParagraph().run()
  } else {
    const levelStr = command.split('-')[1]
    if (levelStr) {
      const level = parseInt(levelStr) as 1 | 2 | 3 | 4 | 5 | 6
      currentEditor.chain().focus().toggleHeading({ level }).run()
    }
  }
}

// 插入链接 - 使用明确的返回类型
const insertLink = (): void => {
  if (!editorInstance.value) return

  const url = window.prompt('请输入链接地址:')

  if (url === null) {
    return
  }

  if (url === '') {
    editorInstance.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // 验证URL格式
  try {
    new URL(url)
  } catch {
    // 如果不是完整URL，添加http://
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    editorInstance.value.chain().focus().setLink({ href: fullUrl }).run()
  }
}

// 插入图片 - 使用明确的返回类型
const insertImage = (): void => {
  if (!editorInstance.value) return

  // 打开图片上传对话框
  showImageUploadDialog.value = true
}

// 插入表格 - 使用明确的返回类型
const insertTable = (): void => {
  if (!editorInstance.value) return

  try {
    // 插入默认 3x3 表格，带表头
    editorInstance.value
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
    ElMessage.success('已插入 3x3 表格，包含表头')
  } catch (error) {
    console.error('插入表格失败:', error)
    ElMessage.error('插入表格失败')
  }
}
</script>

<style scoped>
.tiptap-toolbar {
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-light);
  border-bottom: none;
  border-radius: var(--el-border-radius-base) var(--el-border-radius-base) 0 0;
  background-color: var(--el-bg-color-page);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tiptap-toolbar {
    padding: 6px 8px;
  }
}
</style>
