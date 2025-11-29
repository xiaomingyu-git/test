<template>
  <el-dialog
    v-model="dialogVisible"
    title="插入图片"
    width="600px"
    :before-close="handleClose"
    append-to-body
  >
    <div class="image-upload-container">
      <!-- 标签页切换 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 上传图片标签页 -->
        <el-tab-pane label="上传图片" name="upload">
          <div class="upload-section">
            <!-- 拖拽上传区域 -->
            <el-upload
              ref="uploadRef"
              class="upload-dragger"
              drag
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将图片拖拽到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG、PNG、GIF、WebP 格式，单个文件不超过 5MB
                </div>
              </template>
            </el-upload>

            <!-- 图片预览区域 -->
            <div v-if="previewUrl" class="preview-section">
              <h4>图片预览</h4>
              <div class="preview-image-container">
                <img :src="previewUrl" alt="预览图片" class="preview-image" />
              </div>

              <!-- 图片设置 -->
              <div class="image-settings">
                <el-form :model="imageSettings" label-width="80px" size="small">
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="宽度">
                        <el-input-number
                          v-model="imageSettings.width"
                          :min="1"
                          :max="2000"
                          placeholder="自动"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="高度">
                        <el-input-number
                          v-model="imageSettings.height"
                          :min="1"
                          :max="2000"
                          placeholder="自动"
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item label="对齐">
                        <el-select v-model="imageSettings.align" placeholder="对齐方式">
                          <el-option label="默认" value="" />
                          <el-option label="左对齐" value="left" />
                          <el-option label="居中" value="center" />
                          <el-option label="右对齐" value="right" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="替代文本">
                        <el-input
                          v-model="imageSettings.alt"
                          placeholder="图片描述"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 网络图片标签页 -->
        <el-tab-pane label="网络图片" name="url">
          <div class="url-section">
            <el-form :model="urlForm" label-width="80px">
              <el-form-item label="图片地址" required>
                <el-input
                  v-model="urlForm.url"
                  placeholder="请输入图片地址 (https://...)"
                  type="url"
                />
              </el-form-item>
              <el-form-item label="替代文本">
                <el-input
                  v-model="urlForm.alt"
                  placeholder="图片描述"
                />
              </el-form-item>
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="宽度">
                    <el-input-number
                      v-model="urlForm.width"
                      :min="1"
                      :max="2000"
                      placeholder="自动"
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="高度">
                    <el-input-number
                      v-model="urlForm.height"
                      :min="1"
                      :max="2000"
                      placeholder="自动"
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="对齐">
                <el-select v-model="urlForm.align" placeholder="对齐方式">
                  <el-option label="默认" value="" />
                  <el-option label="左对齐" value="left" />
                  <el-option label="居中" value="center" />
                  <el-option label="右对齐" value="right" />
                </el-select>
              </el-form-item>
            </el-form>

            <!-- URL图片预览 -->
            <div v-if="urlPreviewUrl" class="url-preview-section">
              <h4>图片预览</h4>
              <div class="preview-image-container">
                <img :src="urlPreviewUrl" alt="预览图片" class="preview-image" />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="!canConfirm"
          :loading="uploading"
        >
          {{ uploading ? '上传中...' : '插入图片' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

// 图片设置接口定义
interface ImageSettings {
  width?: number
  height?: number
  alt?: string
  align: ''
  | 'left'
  | 'center'
  | 'right'
}

// URL表单接口定义
interface UrlForm extends ImageSettings {
  url: string
}

// Props 定义
interface Props {
  modelValue: boolean
  editor: any
}

const props = defineProps<Props>()

// Emits 定义
interface Emits {
  'update:modelValue': [value: boolean]
}

const emit = defineEmits<Emits>()

// 响应式数据
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const activeTab = ref<'upload' | 'url'>('upload')
const uploadRef = ref()
const uploading = ref(false)
const previewUrl = ref('')
const urlPreviewUrl = ref('')

// 图片设置
const imageSettings = ref<ImageSettings>({
  width: undefined,
  height: undefined,
  alt: '',
  align: ''
})

// URL表单
const urlForm = ref<UrlForm>({
  url: '',
  width: undefined,
  height: undefined,
  alt: '',
  align: ''
})

// 上传的文件
const uploadedFile = ref<File | null>(null)

// 计算属性：是否可以确认插入
const canConfirm = computed(() => {
  if (activeTab.value === 'upload') {
    return !!previewUrl.value && !!uploadedFile.value
  } else {
    return !!urlForm.value.url
  }
})

// 监听URL变化，更新预览
watch(() => urlForm.value.url, (newUrl) => {
  if (newUrl && isValidUrl(newUrl)) {
    urlPreviewUrl.value = newUrl
  } else {
    urlPreviewUrl.value = ''
  }
})

// 标签页切换处理
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName as 'upload' | 'url'
}

// 文件变化处理
const handleFileChange = (file: any) => {
  const rawFile = file.raw
  if (rawFile && rawFile.type.startsWith('image/')) {
    uploadedFile.value = rawFile

    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(rawFile)
  }
}

// 上传前验证
const beforeUpload = (file: File) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件！')
    return false
  }

  // 检查文件大小 (5MB)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  return false // 阻止自动上传
}

// 验证URL格式
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 处理确认插入
const handleConfirm = async () => {
  try {
    uploading.value = true

    if (activeTab.value === 'upload' && uploadedFile.value) {
      // 处理上传的图片
      const imageUrl = previewUrl.value
      insertImageWithSettings(imageUrl, imageSettings.value)
    } else if (activeTab.value === 'url' && urlForm.value.url) {
      // 处理网络图片
      const finalUrl = urlForm.value.url.startsWith('http')
        ? urlForm.value.url
        : `https://${urlForm.value.url}`

      // 验证URL
      if (!isValidUrl(finalUrl)) {
        ElMessage.error('请输入有效的图片地址！')
        return
      }

      insertImageWithSettings(finalUrl, urlForm.value)
    }

    handleClose()
    ElMessage.success('图片插入成功！')
  } catch (error) {
    console.error('插入图片失败:', error)
    ElMessage.error('插入图片失败，请重试！')
  } finally {
    uploading.value = false
  }
}

// 插入图片到编辑器
const insertImageWithSettings = (src: string, settings: ImageSettings) => {
  if (!props.editor) return

  // 构建图片属性
  const imageAttrs: any = { src }

  if (settings.alt) {
    imageAttrs.alt = settings.alt
  }

  if (settings.width) {
    imageAttrs.width = settings.width
  }

  if (settings.height) {
    imageAttrs.height = settings.height
  }

  // 插入图片
  const chain = props.editor.chain().focus()

  if (settings.align) {
    // 如果有对齐设置，先用段落包装
    chain
      .insertContent({
        type: 'paragraph',
        attrs: settings.align ? { textAlign: settings.align } : {},
        content: [
          {
            type: 'image',
            attrs: imageAttrs
          }
        ]
      })
      .run()
  } else {
    chain.setImage(imageAttrs).run()
  }
}

// 关闭对话框
const handleClose = () => {
  // 重置状态
  previewUrl.value = ''
  urlPreviewUrl.value = ''
  uploadedFile.value = null
  imageSettings.value = {
    width: undefined,
    height: undefined,
    alt: '',
    align: ''
  }
  urlForm.value = {
    url: '',
    width: undefined,
    height: undefined,
    alt: '',
    align: ''
  }
  activeTab.value = 'upload'
  uploading.value = false

  dialogVisible.value = false
}
</script>

<style scoped>
.image-upload-container {
  min-height: 300px;
}

.upload-section {
  margin-top: 16px;
}

.upload-dragger {
  width: 100%;
}

.preview-section {
  margin-top: 24px;
}

.preview-section h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.preview-image-container {
  margin-bottom: 16px;
  text-align: center;
  background: var(--el-fill-color-lighter);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  max-height: 200px;
  overflow: auto;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-settings {
  background: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: var(--el-border-radius-base);
}

.url-section {
  margin-top: 16px;
}

.url-preview-section {
  margin-top: 24px;
}

.url-preview-section h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-upload-container {
    min-height: 250px;
  }

  .preview-image-container {
    max-height: 150px;
  }

  .preview-image {
    max-height: 150px;
  }
}

/* 拖拽区域自定义样式 */
:deep(.el-upload-dragger) {
  border: 2px dashed var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-upload-dragger .el-icon--upload) {
  font-size: 48px;
  color: var(--el-text-color-placeholder);
  margin-bottom: 16px;
  text-align: center;
}

:deep(.el-upload-dragger .el-upload__text) {
  color: var(--el-text-color-regular);
  font-size: 14px;
  text-align: center;
}

:deep(.el-upload-dragger .el-upload__tip) {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
  text-align: center;
}
</style>