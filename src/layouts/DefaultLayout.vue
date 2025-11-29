<template>
  <div class="default-layout">
    <!-- 头部导航 -->
    <app-header />

    <!-- 主要内容区域 -->
    <main class="default-layout__main">
      <div class="default-layout__container">
        <!-- 面包屑导航 -->
        <div v-if="showBreadcrumb" class="breadcrumb-section">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="item in breadcrumbItems"
              :key="item.path"
              :to="item.path ? { path: item.path } : undefined"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 页面内容 -->
        <div class="content-section">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <!-- 底部信息 -->
    <app-footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

interface Props {
  /** 是否显示面包屑导航 */
  showBreadcrumb?: boolean
}

withDefaults(defineProps<Props>(), {
  showBreadcrumb: true
})

const route = useRoute()

// 面包屑导航项
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items: Array<{ title: string; path?: string }> = []

  // 根据路径生成面包屑
  pathSegments.forEach((segment, index) => {
    const fullPath = '/' + pathSegments.slice(0, index + 1).join('/')

    // 根据路径段生成标题
    let title = segment
    switch (segment) {
      case 'editor':
        title = '编辑器'
        break
      case 'demo':
        title = '演示'
        break
      case 'tiptap':
        title = 'Tiptap Editor'
        break
      case 'wang':
        title = 'wangEditor'
        break
      case 'table':
        title = '表格组件'
        break
      case 'card':
        title = '卡片组件'
        break
      case 'integration':
        title = '集成演示'
        break
      case 'about':
        title = '关于'
        break
      default:
        title = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    items.push({
      title,
      path: index < pathSegments.length - 1 ? fullPath : undefined
    })
  })

  return items
})
</script>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.default-layout__main {
  flex: 1;
  padding: 20px 0;
}

.default-layout__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb-section {
  margin-bottom: 24px;

  :deep(.el-breadcrumb) {
    font-size: 14px;
  }
}

.content-section {
  min-height: 400px;
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 移动端样式
@media (max-width: 768px) {
  .default-layout__main {
    padding: 16px 0;
  }

  .default-layout__container {
    padding: 0 16px;
  }

  .breadcrumb-section {
    margin-bottom: 20px;
  }
}

// 小屏幕样式
@media (max-width: 480px) {
  .default-layout__main {
    padding: 12px 0;
  }

  .default-layout__container {
    padding: 0 12px;
  }

  .breadcrumb-section {
    margin-bottom: 16px;

    :deep(.el-breadcrumb) {
      font-size: 13px;
    }
  }
}
</style>