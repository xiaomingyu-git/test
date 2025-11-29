<template>
  <div class="simple-tiptap-test">
    <div class="test-header">
      <h1>Tiptap编辑器集成测试</h1>
      <p>测试Element Plus样式集成和基础功能</p>
    </div>

    <div class="test-content">
      <div class="test-section">
        <h2>基础编辑器测试</h2>
        <tiptap-editor
          v-model="content"
          placeholder="请输入测试内容..."
          height="300px"
          @change="handleChange"
        />
        <div class="test-info">
          <p>字符数: {{ content.length }}</p>
          <p>HTML内容:</p>
          <pre>{{ content }}</pre>
        </div>
      </div>

      <div class="test-section">
        <h2>容器编辑器测试</h2>
        <tiptap-editor-container
          v-model="containerContent"
          title="富文本编辑器"
          subtitle="集成了Element Plus样式"
          placeholder="开始编写你的内容..."
          :show-char-count="true"
          :show-theme-toggle="true"
          height="400px"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditor from '../components/TiptapEditor.vue'
import TiptapEditorContainer from '../components/TiptapEditorContainer.vue'

const content = ref('<p>这是基础的Tiptap编辑器测试。</p>')
const containerContent = ref('')

const handleChange = (value: string) => {
  console.log('编辑器内容变化:', value.length, '字符')
}
</script>

<style scoped>
.simple-tiptap-test {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-header h1 {
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.test-header p {
  color: var(--el-text-color-secondary);
}

.test-content {
  display: grid;
  gap: 32px;
}

.test-section {
  margin-bottom: 32px;
}

.test-section h2 {
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.test-info {
  margin-top: 16px;
  padding: 16px;
  background: var(--el-fill-color-extra-light);
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-lighter);
}

.test-info p {
  margin: 8px 0;
  color: var(--el-text-color-regular);
}

.test-info pre {
  background: var(--el-fill-color);
  padding: 12px;
  border-radius: var(--el-border-radius-small);
  border: 1px solid var(--el-border-color);
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
  color: var(--el-text-color-primary);
}

@media (max-width: 768px) {
  .simple-tiptap-test {
    padding: 16px;
  }

  .test-section {
    padding: 16px;
  }
}
</style>
