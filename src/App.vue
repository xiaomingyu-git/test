<template>
  <div id="app" class="app-container">
    <!-- 全局加载指示器 -->
    <el-loading
      v-if="globalLoading"
      :fullscreen="true"
      :lock="true"
      text="加载中..."
    />

    <!-- 主要内容区域 -->
    <router-view />

    <!-- 全局消息提示容器 -->
    <div class="global-message-container">
      <!-- 这里可以放置全局消息提示 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 全局加载状态
const globalLoading = ref(false)

// 应用初始化
const initializeApp = async () => {
  try {
    globalLoading.value = true

    // 检查系统主题偏好
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      // 如果没有保存的主题设置，使用系统偏好
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        document.documentElement.classList.toggle('dark', prefersDark)
      }
    }

    // 其他初始化逻辑...
    console.log('App initialized')

  } catch (error) {
    console.error('App initialization failed:', error)
  } finally {
    // 延迟一点时间，让用户看到加载效果
    setTimeout(() => {
      globalLoading.value = false
    }, 300)
  }
}

// 组件挂载时初始化
onMounted(() => {
  initializeApp()
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-container {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-dark);
}

/* Firefox 滚动条 */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) var(--el-fill-color-extra-light);
}

/* 全局过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式文本大小 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 打印样式 */
@media print {
  .app-container {
    background: white !important;
    color: black !important;
  }

  .no-print {
    display: none !important;
  }

  /* 优化打印时的样式 */
  .el-button,
  .el-input,
  .el-select {
    display: none !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .app-container {
    --el-border-color-light: #000;
    --el-text-color-regular: #000;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 焦点可见性增强 */
*:focus {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

/* 选择文本样式 */
::selection {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary-light-1);
}

/* 全局消息容器样式 */
.global-message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

/* 确保Element Plus组件正确显示深色主题 */
.dark .el-overlay {
  background-color: rgba(0, 0, 0, 0.8);
}

.dark .el-drawer {
  background-color: var(--el-bg-color);
}

.dark .el-dialog {
  background-color: var(--el-bg-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-message-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}

/* 错误页面样式 */
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 20px;

  .error-code {
    font-size: 6rem;
    font-weight: 700;
    color: var(--el-color-primary);
    margin-bottom: 20px;
  }

  .error-message {
    font-size: 1.2rem;
    color: var(--el-text-color-regular);
    margin-bottom: 30px;
  }

  .error-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>