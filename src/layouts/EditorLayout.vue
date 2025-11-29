<template>
  <div class="editor-layout" :class="{ 'editor-layout--fullscreen': isFullscreen }">
    <!-- 紧凑型头部 -->
    <app-header :compact="true" v-if="!isFullscreen" />

    <!-- 主要内容区域 -->
    <main class="editor-layout__main">
      <!-- 页面头部 -->
      <div v-if="title || subtitle" class="editor-layout__header">
        <div class="editor-layout__container">
          <div class="page-header">
            <div class="page-header__content">
              <h1 v-if="title" class="page-title">{{ title }}</h1>
              <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
            </div>
            <div v-if="$slots.headerActions" class="page-header__actions">
              <slot name="headerActions" />
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑器容器 -->
      <div class="editor-layout__content">
        <div class="editor-layout__container">
          <!-- 工具栏区域 -->
          <div v-if="$slots.toolbar" class="editor-toolbar">
            <slot name="toolbar" />
          </div>

          <!-- 编辑器主体 -->
          <div class="editor-body">
            <router-view v-slot="{ Component, route }">
              <transition name="editor-fade" mode="out-in">
                <component :is="Component" :key="route.path" />
              </transition>
            </router-view>
          </div>

          <!-- 底部状态栏 -->
          <div v-if="$slots.statusbar" class="editor-statusbar">
            <slot name="statusbar" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'

interface Props {
  /** 页面标题 */
  title?: string
  /** 页面副标题 */
  subtitle?: string
  /** 是否允许全屏 */
  allowFullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowFullscreen: true,
})

// 全屏状态
const isFullscreen = ref(false)

// 提供给子组件的全屏切换方法
const toggleFullscreen = () => {
  if (!props.allowFullscreen) return

  isFullscreen.value = !isFullscreen.value

  // 添加或移除全屏样式类
  if (isFullscreen.value) {
    document.body.classList.add('editor-fullscreen')
  } else {
    document.body.classList.remove('editor-fullscreen')
  }
}

// 提供给子组件的全屏状态
const fullscreenState = computed(() => isFullscreen.value)

// 通过 provide 传递给子组件
provide('editorLayout', {
  isFullscreen: fullscreenState,
  toggleFullscreen,
  allowFullscreen: props.allowFullscreen,
})

// 监听 ESC 键退出全屏
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

// 组件挂载时添加键盘事件监听
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscKey)
}
</script>

<style scoped lang="scss">
.editor-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
}

.editor-layout--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: var(--el-bg-color);
}

.editor-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-layout__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

// 页面头部样式
.editor-layout__header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 20px 0;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    &__content {
      flex: 1;

      .page-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 8px 0;
        line-height: 1.2;
      }

      .page-subtitle {
        color: var(--el-text-color-regular);
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
      }
    }

    &__actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
}

// 编辑器内容区域
.editor-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.editor-toolbar {
  margin-bottom: 20px;
}

.editor-body {
  flex: 1;
  min-height: 500px;
}

.editor-statusbar {
  margin-top: 16px;
}

// 全屏模式样式
.editor-layout--fullscreen {
  .editor-layout__header {
    background-color: var(--el-bg-color);
    border-bottom-color: var(--el-border-color-light);
  }

  .editor-layout__content {
    padding: 16px 0;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .editor-layout__container {
    max-width: 100%;
    padding: 0 24px;
  }

  .editor-body {
    min-height: calc(100vh - 200px);
  }
}

// 页面切换动画
.editor-fade-enter-active,
.editor-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.editor-fade-enter-from,
.editor-fade-leave-to {
  opacity: 0;
}

// 平板样式
@media (max-width: 992px) {
  .editor-layout__container {
    padding: 0 16px;
  }

  .editor-layout__header .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    &__actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .page-title {
    font-size: 1.5rem !important;
  }
}

// 移动端样式
@media (max-width: 768px) {
  .editor-layout__content {
    padding: 16px 0;
  }

  .editor-layout__container {
    padding: 0 12px;
  }

  .editor-layout__header {
    padding: 16px 0;

    .page-title {
      font-size: 1.4rem !important;
    }

    .page-subtitle {
      font-size: 0.9rem !important;
    }
  }

  .editor-body {
    min-height: 400px;
  }
}

// 小屏幕样式
@media (max-width: 480px) {
  .editor-layout__header .page-header {
    &__content {
      .page-title {
        font-size: 1.2rem !important;
      }
    }

    &__actions {
      justify-content: center;
    }
  }

  .editor-layout__content {
    padding: 12px 0;
  }

  .editor-toolbar {
    margin-bottom: 16px;
  }
}

// 全屏模式的响应式调整
@media (max-width: 768px) {
  .editor-layout--fullscreen {
    .editor-layout__container {
      padding: 0 16px;
    }

    .editor-layout__content {
      padding: 12px 0;
    }
  }
}

// 深色主题样式
:root.dark .editor-layout {
  background-color: var(--el-bg-color-page);

  &--fullscreen {
    background-color: var(--el-bg-color);
  }
}

// 全屏模式下的全局样式
:global(.editor-fullscreen) {
  overflow: hidden;
}

// 编辑器内容区域滚动条样式
.editor-layout__content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-extra-light);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color-darker);
    border-radius: 4px;

    &:hover {
      background: var(--el-border-color-dark);
    }
  }
}
</style>
