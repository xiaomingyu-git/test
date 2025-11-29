<template>
  <div class="tiptap-integration-test">
    <div class="test-header">
      <h1>Tiptap 编辑器集成测试</h1>
      <p>测试Element Plus样式集成、主题切换和容器组件</p>
    </div>

    <el-row :gutter="24" class="test-row">
      <!-- 基础编辑器测试 -->
      <el-col :lg="12" :md="24" class="test-col">
        <h2>基础编辑器</h2>
        <tiptap-editor
          v-model="basicContent"
          placeholder="请输入内容..."
          height="200px"
          @change="onBasicChange"
        />
        <div class="test-info">
          <el-text size="small" type="info">字符数: {{ basicContent.length }}</el-text>
        </div>
      </el-col>

      <!-- 带容器的编辑器测试 -->
      <el-col :lg="12" :md="24" class="test-col">
        <h2>完整容器编辑器</h2>
        <tiptap-editor-container
          v-model="containerContent"
          title="富文本编辑器"
          subtitle="支持主题切换和全屏编辑"
          placeholder="开始编写你的内容..."
          :show-char-count="true"
          :show-theme-toggle="true"
          :allow-fullscreen="true"
          :show-statusbar="true"
          :last-saved="lastSaved"
          height="300px"
          @fullscreen-change="onFullscreenChange"
        >
          <template #statusbarRight>
            <el-button size="small" text @click="saveContent">保存</el-button>
          </template>
        </tiptap-editor-container>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="test-row">
      <!-- 不同尺寸的编辑器 -->
      <el-col :lg="8" :md="12" :sm="24" class="test-col">
        <h2>小型编辑器</h2>
        <tiptap-editor-container
          v-model="smallContent"
          title="小型编辑器"
          :show-char-count="true"
          height="150px"
        />
      </el-col>

      <el-col :lg="8" :md="12" :sm="24" class="test-col">
        <h2>中型编辑器</h2>
        <tiptap-editor-container
          v-model="mediumContent"
          title="中型编辑器"
          subtitle="中等尺寸的编辑器"
          :show-theme-toggle="true"
          height="250px"
        />
      </el-col>

      <el-col :lg="8" :md="12" :sm="24" class="test-col">
        <h2>大型编辑器</h2>
        <tiptap-editor-container
          v-model="largeContent"
          title="大型编辑器"
          subtitle="适合长文本编辑"
          :show-char-count="true"
          :show-theme-toggle="true"
          :allow-fullscreen="true"
          height="400px"
        />
      </el-col>
    </el-row>

    <el-row :gutter="24" class="test-row">
      <!-- 响应式测试 -->
      <el-col :span="24" class="test-col">
        <h2>响应式和主题测试</h2>
        <div class="theme-controls">
          <el-space>
            <span>主题切换:</span>
            <theme-toggle />
            <el-divider direction="vertical" />
            <el-text size="small" type="info"> 调整浏览器窗口大小测试响应式效果 </el-text>
          </el-space>
        </div>

        <tiptap-editor-container
          v-model="responsiveContent"
          title="响应式编辑器"
          subtitle="测试不同屏幕尺寸下的显示效果"
          placeholder="这是一个响应式编辑器，尝试调整窗口大小..."
          :show-char-count="true"
          :show-theme-toggle="true"
          :show-statusbar="true"
          :allow-fullscreen="true"
          height="300px"
        />
      </el-col>
    </el-row>

    <!-- 预设内容测试 -->
    <el-row :gutter="24" class="test-row">
      <el-col :span="24" class="test-col">
        <h2>样式效果测试</h2>
        <el-space class="style-controls">
          <el-button @click="loadSampleContent">加载示例内容</el-button>
          <el-button @click="clearContent">清空内容</el-button>
          <el-button @click="insertLoremIpsum">插入测试文本</el-button>
        </el-space>

        <tiptap-editor-container
          v-model="styleTestContent"
          title="样式效果测试"
          subtitle="测试标题、列表、引用、代码块等格式"
          placeholder="点击上方按钮加载测试内容..."
          :show-char-count="true"
          :show-theme-toggle="true"
          height="400px"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElRow, ElCol, ElText, ElSpace, ElButton, ElDivider } from 'element-plus'
import TiptapEditor from '../components/editor/TiptapEditor.vue'
import TiptapEditorContainer from '../components/editor/TiptapEditorContainer.vue'
import ThemeToggle from '../components/common/ThemeToggle.vue'

// 编辑器内容状态
const basicContent = ref('<p>这是一个基础的Tiptap编辑器测试。</p>')
const containerContent = ref('')
const smallContent = ref('<p>小型编辑器内容</p>')
const mediumContent = ref('<p>中型编辑器内容，可以包含更多文字。</p>')
const largeContent = ref('<h2>大型编辑器</h2><p>这里适合编辑长文本内容，提供了更好的编辑体验。</p>')
const responsiveContent = ref('<p>调整浏览器窗口大小来测试响应式效果。</p>')
const styleTestContent = ref('')

// 状态管理
const lastSaved = ref(new Date())
const isFullscreen = ref(false)

// 示例内容
const sampleHTML = `
<h1>Tiptap编辑器样式测试</h1>
<h2>二级标题测试</h2>
<p>这是一个段落，包含<strong>粗体文本</strong>和<em>斜体文本</em>以及<u>下划线文本</u>。</p>

<h3>列表测试</h3>
<p>无序列表：</p>
<ul>
  <li>第一项</li>
  <li>第二项
    <ul>
      <li>子项目1</li>
      <li>子项目2</li>
    </ul>
  </li>
  <li>第三项</li>
</ul>

<p>有序列表：</p>
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<h3>引用和代码</h3>
<blockquote>这是一段引用内容，用于测试引用块的样式效果。</blockquote>

<p>行内代码：使用<code>console.log()</code>来输出调试信息。</p>

<pre><code data-language="javascript">
// 代码块测试
function greeting(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}\`;
}

greeting('World');
</code></pre>

<h3>其他格式</h3>
<p>这里还支持链接、图片等格式（如果配置了相应扩展）。</p>
<hr>

<p>以上是所有基础格式的测试效果。</p>
`

// 方法
const onBasicChange = (value: string) => {
  console.log('基础编辑器内容变化:', value.length, '字符')
}

const onFullscreenChange = (fullscreen: boolean) => {
  isFullscreen.value = fullscreen
  console.log('全屏状态变化:', fullscreen)
}

const saveContent = () => {
  lastSaved.value = new Date()
  // 这里可以添加实际的保存逻辑
  console.log('内容已保存')
}

const loadSampleContent = () => {
  styleTestContent.value = sampleHTML
}

const clearContent = () => {
  styleTestContent.value = ''
}

const insertLoremIpsum = () => {
  const loremText = `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<blockquote>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</blockquote>
<p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`

  styleTestContent.value += loremText
}

// 页面加载时的初始化
const initSampleContent = () => {
  containerContent.value = `
<h2>欢迎使用Tiptap编辑器</h2>
<p>这是一个集成了Element Plus样式的富文本编辑器，具有以下特性：</p>
<ul>
  <li>🎨 <strong>Element Plus样式集成</strong>：完美融入Element Plus设计系统</li>
  <li>🌓 <strong>深色/浅色主题</strong>：支持主题切换，适应不同环境</li>
  <li>📱 <strong>响应式设计</strong>：在不同设备上都有良好的显示效果</li>
  <li>🔧 <strong>丰富的功能</strong>：支持标题、列表、引用、代码块等格式</li>
  <li>⚡ <strong>性能优化</strong>：轻量级设计，快速响应</li>
</ul>
<p>尝试编辑这段内容，或者切换到全屏模式获得更好的编辑体验！</p>
  `
}

// 初始化示例内容
initSampleContent()
</script>

<style scoped>
.tiptap-integration-test {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.test-header p {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-base);
}

.test-row {
  margin-bottom: 32px;
}

.test-col {
  margin-bottom: 24px;
}

.test-col h2 {
  font-size: var(--el-font-size-large);
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.test-info {
  margin-top: 8px;
  text-align: right;
}

.theme-controls,
.style-controls {
  margin-bottom: 16px;
  padding: 12px;
  background-color: var(--el-fill-color-extra-light);
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-lighter);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tiptap-integration-test {
    padding: 16px;
  }

  .test-header h1 {
    font-size: 1.5rem;
  }

  .test-col h2 {
    font-size: var(--el-font-size-base);
  }
}

@media (max-width: 480px) {
  .tiptap-integration-test {
    padding: 12px;
  }

  .test-row {
    margin-bottom: 24px;
  }

  .test-col {
    margin-bottom: 16px;
  }
}

/* 打印样式 */
@media print {
  .theme-controls,
  .style-controls,
  .test-header {
    display: none;
  }

  .tiptap-integration-test {
    padding: 0;
  }

  .test-row {
    margin-bottom: 24px;
    break-inside: avoid;
  }
}
</style>
