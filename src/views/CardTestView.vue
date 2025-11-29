<template>
  <div class="card-test">
    <h1>Card容器测试</h1>

    <!-- 测试Element Plus Card是否正常工作 -->
    <div class="test-section">
      <h2>原生Element Plus Card</h2>
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>测试Card</span>
          </div>
        </template>
        <p>这是一个原生Element Plus Card组件，用于测试Card是否正常显示。</p>
      </el-card>
    </div>

    <!-- 测试TiptapEditorContainer -->
    <div class="test-section">
      <h2>TiptapEditorContainer</h2>
      <tiptap-editor-container
        v-model="content"
        title="富文本编辑器"
        subtitle="基于Element Plus Card的容器"
        placeholder="请输入内容..."
        :show-char-count="true"
        :show-theme-toggle="true"
        :allow-fullscreen="true"
        :allow-preview="true"
        height="300px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TiptapEditorContainer from '../components/TiptapEditorContainer.vue'

const content = ref(`
<h1>预览模式测试</h1>
<p>这是一个包含<strong>粗体文本</strong>和<em>斜体文本</em>的段落。</p>
<ul>
  <li>无序列表项目1</li>
  <li>无序列表项目2</li>
</ul>
<blockquote>这是一个引用块。</blockquote>
<p>还有<code>行内代码</code>和预览模式测试。</p>
`)
</script>

<style scoped>
.card-test {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 32px;
}

.test-section h2 {
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}
</style>
