<template>
  <header class="app-header" :class="{ 'app-header--compact': compact }">
    <div class="app-header__container">
      <!-- Logo区域 -->
      <div class="app-header__logo">
        <router-link to="/" class="logo-link">
          <img v-if="!compact" src="@/assets/logo.svg" alt="Vue Editor" class="logo-image" />
          <h1 v-if="!compact" class="logo-text">Vue Editor</h1>
          <h1 v-else class="logo-text logo-text--compact">VE</h1>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="app-header__nav">
        <el-menu
          :default-active="activeRoute"
          mode="horizontal"
          :router="true"
          class="nav-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span v-if="!compact">首页</span>
          </el-menu-item>

          <el-sub-menu index="editor">
            <template #title>
              <el-icon><Edit /></el-icon>
              <span v-if="!compact">编辑器</span>
            </template>
            <el-menu-item index="/editor/tiptap">Tiptap Editor</el-menu-item>
            <el-menu-item index="/editor/wang">wangEditor</el-menu-item>
            <el-menu-item index="/editor/comparison">编辑器对比</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="demo">
            <template #title>
              <el-icon><Grid /></el-icon>
              <span v-if="!compact">演示</span>
            </template>
            <el-menu-item index="/demo/table">表格组件</el-menu-item>
            <el-menu-item index="/demo/card">卡片组件</el-menu-item>
            <el-menu-item index="/demo/integration">集成演示</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="crud">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span v-if="!compact">系统管理</span>
            </template>
            <el-menu-item index="/crud/user">用户管理</el-menu-item>
            <el-menu-item index="/crud/role">角色管理</el-menu-item>
            <el-menu-item index="/crud/permission">权限管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span v-if="!compact">关于</span>
          </el-menu-item>
        </el-menu>
      </nav>

      <!-- 右侧工具栏 -->
      <div class="app-header__actions">
        <theme-toggle />

        <!-- 移动端菜单按钮 -->
        <el-button v-if="isMobile" text @click="toggleMobileMenu" class="mobile-menu-button">
          <el-icon size="20"><Menu /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 移动端侧边菜单 -->
    <el-drawer
      v-model="showMobileMenu"
      title="导航菜单"
      direction="rtl"
      size="280px"
      class="mobile-nav-drawer"
    >
      <el-menu :default-active="activeRoute" :router="true" @select="handleMobileMenuSelect">
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="editor">
          <template #title>
            <el-icon><Edit /></el-icon>
            <span>编辑器</span>
          </template>
          <el-menu-item index="/editor/tiptap">Tiptap Editor</el-menu-item>
          <el-menu-item index="/editor/wang">wangEditor</el-menu-item>
          <el-menu-item index="/editor/comparison">编辑器对比</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="demo">
          <template #title>
            <el-icon><Grid /></el-icon>
            <span>演示</span>
          </template>
          <el-menu-item index="/demo/table">表格组件</el-menu-item>
          <el-menu-item index="/demo/card">卡片组件</el-menu-item>
          <el-menu-item index="/demo/integration">集成演示</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="crud">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/crud/user">用户管理</el-menu-item>
          <el-menu-item index="/crud/role">角色管理</el-menu-item>
          <el-menu-item index="/crud/permission">权限管理</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import ThemeToggle from './ThemeToggle.vue'
import { House, Edit, Grid, InfoFilled, Setting, Menu } from '@element-plus/icons-vue'

interface Props {
  /** 是否为紧凑模式 */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  compact: false,
})

const route = useRoute()
const { isMobile } = useResponsive()

// 当前激活的路由
const activeRoute = computed(() => {
  // 移除查询参数和哈希
  const pathParts = route.path.split('?')
  return pathParts[0]?.split('#')[0] || '/'
})

// 移动端菜单状态
const showMobileMenu = ref(false)

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  console.log('Menu selected:', index)
}

// 移动端菜单选择处理
const handleMobileMenuSelect = (index: string) => {
  showMobileMenu.value = false
  console.log('Mobile menu selected:', index)
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<style scoped lang="scss">
.app-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;

  &--compact {
    .app-header__container {
      height: 60px;
    }

    .logo-text {
      font-size: 1.2rem;

      &--compact {
        font-size: 1rem;
      }
    }
  }
}

.app-header__container {
  max-width: 1200px;
  margin: 0 auto;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.app-header__logo {
  flex-shrink: 0;

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--el-text-color-primary);
    transition: all 0.3s ease;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .logo-image {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;

    &--compact {
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
}

.app-header__nav {
  flex: 1;
  display: flex;
  justify-content: center;

  .nav-menu {
    border-bottom: none;
    background-color: transparent;
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .mobile-menu-button {
    display: none;
  }
}

// 移动端样式
@media (max-width: 768px) {
  .app-header__container {
    height: 60px;
    padding: 0 16px;
  }

  .app-header__nav {
    display: none;
  }

  .app-header__logo {
    .logo-image {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .logo-text {
      font-size: 1.2rem;
    }
  }

  .app-header__actions {
    .mobile-menu-button {
      display: flex;
    }
  }
}

// 小屏幕样式
@media (max-width: 480px) {
  .app-header__container {
    padding: 0 12px;
  }

  .app-header__logo {
    .logo-text {
      font-size: 1.1rem;
    }
  }
}

// 深色主题样式
:root.dark .app-header {
  background-color: var(--el-bg-color);
  border-bottom-color: var(--el-border-color-dark);
}

// 抽屉样式调整
::v-deep(.mobile-nav-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-menu {
    border-right: none;
  }
}
</style>
