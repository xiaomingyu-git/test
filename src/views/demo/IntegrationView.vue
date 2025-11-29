<template>
  <div class="integration-demo">
    <div class="demo-header">
      <h1 class="demo-title">集成演示</h1>
      <p class="demo-description">编辑器与其他组件的集成演示</p>
    </div>

    <div class="demo-content">
      <!-- 富文本编辑器集成 -->
      <div class="demo-section">
        <h2 class="section-title">富文本编辑器与表单集成</h2>
        <el-card class="integration-card">
          <div class="editor-form">
            <el-form :model="articleForm" label-width="100px">
              <el-form-item label="文章标题">
                <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
              </el-form-item>

              <el-form-item label="文章分类">
                <el-select v-model="articleForm.category" placeholder="请选择分类">
                  <el-option
                    v-for="item in categories"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="文章标签">
                <el-select
                  v-model="articleForm.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入标签"
                >
                  <el-option
                    v-for="tag in tagOptions"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="文章内容">
                <TiptapEditor
                  v-model="articleForm.content"
                  placeholder="请开始编写文章内容..."
                  height="300px"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveArticle" :loading="saving">
                  保存文章
                </el-button>
                <el-button @click="previewArticle">预览</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>

      <!-- 评论系统集成 -->
      <div class="demo-section">
        <h2 class="section-title">评论系统集成</h2>
        <el-card class="integration-card">
          <div class="comment-section">
            <div class="comment-list">
              <h3>评论列表 ({{ comments.length }})</h3>

              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-header">
                  <el-avatar :size="40" :src="comment.avatar" />
                  <div class="comment-info">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <div class="comment-actions">
                    <el-button
                      type="text"
                      size="small"
                      @click="replyComment(comment)"
                    >
                      回复
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="likeComment(comment)"
                    >
                      <el-icon><Star /></el-icon>
                      {{ comment.likes }}
                    </el-button>
                  </div>
                </div>
                <div class="comment-content" v-html="comment.content"></div>
              </div>
            </div>

            <div class="comment-form">
              <h4>发表评论</h4>
              <TiptapEditor
                v-model="newComment"
                placeholder="写下你的评论..."
                height="150px"
                :toolbar-options="commentToolbarOptions"
              />
              <div class="comment-form-actions">
                <el-button type="primary" @click="submitComment" :loading="submitting">
                  发表评论
                </el-button>
                <el-button @click="cancelComment">取消</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 数据表格集成 -->
      <div class="demo-section">
        <h2 class="section-title">数据表格与编辑器集成</h2>
        <el-card class="integration-card">
          <div class="table-editor-section">
            <div class="table-toolbar">
              <el-button type="primary" @click="addNewRow">添加行</el-button>
              <el-button @click="editSelectedRow">编辑选中</el-button>
              <el-button type="danger" @click="deleteSelectedRow">删除选中</el-button>
            </div>

            <el-table
              :data="tableData"
              border
              @selection-change="handleSelectionChange"
              style="width: 100%"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" width="200" />
              <el-table-column prop="description" label="描述">
                <template #default="{ row }">
                  <div class="description-cell" v-html="row.description"></div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="text" @click="editRow(row)">编辑</el-button>
                  <el-button type="text" @click="deleteRow(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>

      <!-- 对话框集成 -->
      <div class="demo-section">
        <h2 class="section-title">对话框与编辑器集成</h2>
        <el-card class="integration-card">
          <div class="dialog-integration">
            <el-button type="primary" @click="openRichTextDialog">
              打开富文本编辑对话框
            </el-button>
            <el-button type="success" @click="openEmailDialog">
              打开邮件编辑对话框
            </el-button>
            <el-button type="warning" @click="openNoticeDialog">
              打开公告编辑对话框
            </el-button>

            <div class="dialog-preview" v-if="dialogContent">
              <h4>对话框内容预览：</h4>
              <div class="preview-content" v-html="dialogContent"></div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="dialogTitle"
      width="80%"
      @close="closeEditDialog"
    >
      <TiptapEditor
        v-model="editingContent"
        :placeholder="dialogPlaceholder"
        height="400px"
      />
      <template #footer>
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" @click="saveDialogContent">保存</el-button>
      </template>
    </el-dialog>

    <!-- 表格行编辑对话框 -->
    <el-dialog
      v-model="rowEditDialogVisible"
      title="编辑表格行"
      width="60%"
    >
      <el-form :model="editingRow" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editingRow.title" />
        </el-form-item>
        <el-form-item label="描述">
          <TiptapEditor
            v-model="editingRow.description"
            placeholder="请输入描述..."
            height="200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editingRow.status">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rowEditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRowEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import TiptapEditor from '@/components/editor/TiptapEditor.vue'

// 页面标题
defineOptions({
  name: 'IntegrationView'
})

// 文章表单数据
const articleForm = reactive({
  title: '',
  category: '',
  tags: [],
  content: ''
})

// 分类选项
const categories = [
  { label: '技术分享', value: 'tech' },
  { label: '生活随笔', value: 'life' },
  { label: '工作笔记', value: 'work' },
  { label: '学习记录', value: 'study' }
]

// 标签选项
const tagOptions = [
  'Vue.js', 'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML',
  'Node.js', '前端', '后端', '全栈', '设计', '产品'
]

// 评论数据
const comments = ref([
  {
    id: 1,
    author: '张三',
    avatar: 'https://via.placeholder.com/40/4CAF50/white?text=张',
    content: '<p>这是一个很棒的集成演示！编辑器功能很强大。</p>',
    time: '2023-12-01 10:30',
    likes: 12
  },
  {
    id: 2,
    author: '李四',
    avatar: 'https://via.placeholder.com/40/2196F3/white?text=李',
    content: '<p>集成的效果很好，特别是表单和编辑器的配合。</p>',
    time: '2023-12-01 11:45',
    likes: 8
  }
])

// 新评论
const newComment = ref('')
const submitting = ref(false)

// 表格数据
const tableData = ref([
  {
    id: 1,
    title: 'Vue 3 教程',
    description: '<p>详细介绍 <strong>Vue 3</strong> 的新特性和用法。</p>',
    status: 'published'
  },
  {
    id: 2,
    title: 'TypeScript 指南',
    description: '<p>从入门到精通的 <em>TypeScript</em> 学习路线。</p>',
    status: 'draft'
  },
  {
    id: 3,
    title: '前端性能优化',
    description: '<p>提升 Web 应用性能的最佳实践。</p>',
    status: 'published'
  }
])

const selectedRows = ref<any[]>([])
const editingRow = reactive({
  id: 0,
  title: '',
  description: '',
  status: 'draft'
})

// 对话框相关
const editDialogVisible = ref(false)
const rowEditDialogVisible = ref(false)
const dialogTitle = ref('')
const dialogPlaceholder = ref('')
const editingContent = ref('')
const dialogContent = ref('')
const saving = ref(false)

// 评论工具栏选项
const commentToolbarOptions = {
  heading: false,
  table: false,
  image: false,
  link: true,
  bold: true,
  italic: true,
  strike: true,
  code: true,
  quote: true,
  bulletList: true,
  orderedList: true
}

// 保存文章
const saveArticle = async () => {
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!articleForm.content) {
    ElMessage.warning('请输入文章内容')
    return
  }

  saving.value = true
  try {
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('文章保存成功！')
  } catch {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 预览文章
const previewArticle = () => {
  if (!articleForm.content) {
    ElMessage.warning('请先输入文章内容')
    return
  }

  ElMessage.info('预览功能开发中...')
}

// 重置表单
const resetForm = () => {
  Object.assign(articleForm, {
    title: '',
    category: '',
    tags: [],
    content: ''
  })
  ElMessage.success('表单已重置')
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 800))

    comments.value.unshift({
      id: Date.now(),
      author: '当前用户',
      avatar: 'https://via.placeholder.com/40/FF9800/white?text=我',
      content: newComment.value,
      time: new Date().toLocaleString(),
      likes: 0
    })

    newComment.value = ''
    ElMessage.success('评论发表成功！')
  } catch {
    ElMessage.error('发表失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 取消评论
const cancelComment = () => {
  newComment.value = ''
  ElMessage.info('已取消评论')
}

// 回复评论
const replyComment = (comment: any) => {
  newComment.value = `<p>@${comment.author} </p>`
  ElMessage.info(`正在回复 ${comment.author}`)
}

// 点赞评论
const likeComment = (comment: any) => {
  comment.likes++
  ElMessage.success(`已点赞 ${comment.author} 的评论`)
}

// 表格操作
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const addNewRow = () => {
  const newId = Math.max(...tableData.value.map(item => item.id)) + 1
  Object.assign(editingRow, {
    id: newId,
    title: '',
    description: '',
    status: 'draft'
  })
  rowEditDialogVisible.value = true
}

const editSelectedRow = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要编辑的行')
    return
  }
  if (selectedRows.value.length > 1) {
    ElMessage.warning('只能选择一行进行编辑')
    return
  }

  Object.assign(editingRow, selectedRows.value[0])
  rowEditDialogVisible.value = true
}

const deleteSelectedRow = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的行')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 行吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const selectedIds = selectedRows.value.map(row => row.id)
    tableData.value = tableData.value.filter(row => !selectedIds.includes(row.id))
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const editRow = (row: any) => {
  Object.assign(editingRow, { ...row })
  rowEditDialogVisible.value = true
}

const deleteRow = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${row.title}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

const saveRowEdit = () => {
  if (!editingRow.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }

  const index = tableData.value.findIndex(item => item.id === editingRow.id)
  if (index > -1) {
    tableData.value[index] = { ...editingRow }
  } else {
    tableData.value.push({ ...editingRow })
  }

  rowEditDialogVisible.value = false
  ElMessage.success('保存成功')
}

// 对话框操作
const openRichTextDialog = () => {
  dialogTitle.value = '富文本编辑器'
  dialogPlaceholder.value = '请输入富文本内容...'
  editingContent.value = dialogContent.value || ''
  editDialogVisible.value = true
}

const openEmailDialog = () => {
  dialogTitle.value = '邮件编辑器'
  dialogPlaceholder.value = '请输入邮件内容...'
  editingContent.value = dialogContent.value || ''
  editDialogVisible.value = true
}

const openNoticeDialog = () => {
  dialogTitle.value = '公告编辑器'
  dialogPlaceholder.value = '请输入公告内容...'
  editingContent.value = dialogContent.value || ''
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false
}

const saveDialogContent = () => {
  dialogContent.value = editingContent.value
  editDialogVisible.value = false
  ElMessage.success('内容已保存')
}

// 状态相关方法
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    published: 'success',
    draft: 'warning',
    archived: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  }
  return textMap[status] || '未知'
}
</script>

<style scoped lang="scss">
.integration-demo {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;

  .demo-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .demo-description {
    font-size: 1.2rem;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 20px 0;
    border-bottom: 2px solid var(--el-color-primary);
    padding-bottom: 8px;
  }
}

.integration-card {
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color-light);
}

// 编辑器表单样式
.editor-form {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

// 评论系统样式
.comment-section {
  .comment-list {
    margin-bottom: 30px;

    h3 {
      margin-bottom: 20px;
      color: var(--el-text-color-primary);
    }

    .comment-item {
      background: var(--el-bg-color);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;

      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .comment-info {
          margin-left: 12px;
          flex: 1;

          .comment-author {
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin-right: 8px;
          }

          .comment-time {
            font-size: 0.9rem;
            color: var(--el-text-color-secondary);
          }
        }

        .comment-actions {
          .el-button {
            margin-left: 8px;
          }
        }
      }

      .comment-content {
        color: var(--el-text-color-regular);
        line-height: 1.6;
      }
    }
  }

  .comment-form {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 20px;

    h4 {
      margin: 0 0 16px 0;
      color: var(--el-text-color-primary);
    }

    .comment-form-actions {
      margin-top: 16px;
      text-align: right;
    }
  }
}

// 表格编辑器样式
.table-editor-section {
  .table-toolbar {
    margin-bottom: 16px;

    .el-button {
      margin-right: 8px;
    }
  }

  .description-cell {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

// 对话框集成样式
.dialog-integration {
  .el-button {
    margin-right: 16px;
    margin-bottom: 16px;
  }

  .dialog-preview {
    margin-top: 24px;
    padding: 16px;
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-light);

    h4 {
      margin: 0 0 12px 0;
      color: var(--el-text-color-primary);
    }

    .preview-content {
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-header {
    .demo-title {
      font-size: 2rem;
    }

    .demo-description {
      font-size: 1rem;
    }
  }

  .demo-section {
    padding: 16px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .comment-item {
    .comment-header {
      flex-direction: column;
      align-items: flex-start;

      .comment-info {
        margin-left: 0;
        margin-top: 8px;
      }

      .comment-actions {
        margin-top: 8px;
        align-self: flex-end;
      }
    }
  }

  .table-toolbar .el-button {
    margin-bottom: 8px;
  }
}

// 深色主题适配
:root.dark {
  .integration-demo {
    background: var(--el-bg-color);
  }

  .integration-card {
    background: var(--el-fill-color-darker);
    border-color: var(--el-border-color-dark);
  }
}
</style>