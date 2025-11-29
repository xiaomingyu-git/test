<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <!-- 主要内容区域 -->
      <div class="app-footer__content">
        <!-- 左侧信息 -->
        <div class="app-footer__info">
          <h3 class="footer-title">Vue Editor</h3>
          <p class="footer-description">
            基于 Vue 3 + TypeScript + Element Plus 的富文本编辑器解决方案
          </p>
          <div class="footer-tech">
            <el-tag v-for="tech in technologies" :key="tech.name" size="small">
              {{ tech.name }}
            </el-tag>
          </div>
        </div>

        <!-- 中间链接 -->
        <div class="app-footer__links">
          <div class="link-group">
            <h4 class="link-title">编辑器</h4>
            <router-link to="/editor/tiptap" class="link-item">Tiptap Editor</router-link>
            <router-link to="/editor/wang" class="link-item">wangEditor</router-link>
            <router-link to="/editor/comparison" class="link-item">编辑器对比</router-link>
          </div>
          <div class="link-group">
            <h4 class="link-title">演示</h4>
            <router-link to="/demo/table" class="link-item">表格组件</router-link>
            <router-link to="/demo/card" class="link-item">卡片组件</router-link>
            <router-link to="/demo/integration" class="link-item">集成演示</router-link>
          </div>
          <div class="link-group">
            <h4 class="link-title">更多</h4>
            <router-link to="/about" class="link-item">关于项目</router-link>
            <a href="https://github.com" target="_blank" class="link-item">GitHub</a>
            <a href="https://vuejs.org" target="_blank" class="link-item">Vue.js</a>
          </div>
        </div>

        <!-- 右侧主题切换 -->
        <div class="app-footer__theme">
          <div class="theme-section">
            <h4 class="theme-title">主题设置</h4>
            <div class="theme-controls">
              <theme-toggle />
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="app-footer__bottom">
        <div class="copyright">
          <span>© {{ currentYear }} Vue Editor Project.</span>
          <span class="separator">•</span>
          <span>Built with ❤️ using Vue 3</span>
        </div>
        <div class="footer-stats">
          <span class="stat-item">
            <el-icon><View /></el-icon>
            访问量: {{ visitCount.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { View } from '@element-plus/icons-vue'
import ThemeToggle from './ThemeToggle.vue'

// 技术栈列表
const technologies = [
  { name: 'Vue 3' },
  { name: 'TypeScript' },
  { name: 'Element Plus' },
  { name: 'Tiptap' },
  { name: 'wangEditor' },
  { name: 'Vite' }
]

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 模拟访问量
const visitCount = ref(1234)
</script>

<style scoped lang="scss">
.app-footer {
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-light);
  margin-top: auto;
}

.app-footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.app-footer__content {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  gap: 40px;
  margin-bottom: 32px;
}

.app-footer__info {
  .footer-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .footer-description {
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 400px;
  }

  .footer-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .el-tag {
      background-color: var(--el-fill-color-light);
      border-color: var(--el-border-color-light);
      color: var(--el-text-color-regular);
    }
  }
}

.app-footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.link-group {
  .link-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  .link-item {
    display: block;
    color: var(--el-text-color-regular);
    text-decoration: none;
    margin-bottom: 8px;
    transition: color 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      color: var(--el-color-primary);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.app-footer__theme {
  .theme-section {
    .theme-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;
    }

    .theme-controls {
      display: flex;
      justify-content: center;
    }
  }
}

.app-footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.copyright {
  display: flex;
  align-items: center;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;

  .separator {
    margin: 0 12px;
    color: var(--el-border-color-light);
  }
}

.footer-stats {
  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--el-text-color-secondary);
    font-size: 0.9rem;

    .el-icon {
      font-size: 16px;
    }
  }
}

// 平板样式
@media (max-width: 992px) {
  .app-footer__content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .app-footer__links {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .app-footer__theme {
    display: flex;
    justify-content: center;
  }

  .app-footer__bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

// 移动端样式
@media (max-width: 768px) {
  .app-footer__container {
    padding: 32px 16px 16px;
  }

  .app-footer__content {
    gap: 24px;
  }

  .app-footer__links {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .app-footer__info {
    .footer-title {
      font-size: 1.3rem;
    }

    .footer-description {
      font-size: 0.9rem;
    }
  }

  .copyright {
    font-size: 0.85rem;
    flex-direction: column;
    gap: 4px;

    .separator {
      display: none;
    }
  }

  .footer-stats {
    .stat-item {
      font-size: 0.85rem;
    }
  }
}

// 小屏幕样式
@media (max-width: 480px) {
  .app-footer__links {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .app-footer__theme {
    .theme-section {
      .theme-title {
        text-align: center;
      }
    }
  }
}

// 深色主题样式
:root.dark .app-footer {
  background-color: var(--el-bg-color-page);
  border-top-color: var(--el-border-color-dark);

  .footer-tech .el-tag {
    background-color: var(--el-fill-color-dark);
    border-color: var(--el-border-color-dark);
  }
}
</style>