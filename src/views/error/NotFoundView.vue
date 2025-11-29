<template>
  <div class="error-page">
    <div class="error-illustration">
      <div class="error-number">404</div>
      <div class="error-text">页面未找到</div>
    </div>

    <div class="error-content">
      <h1 class="error-message">抱歉，您访问的页面不存在</h1>
      <p class="error-description">可能是因为链接已过期、页面已被删除或您输入了错误的地址。</p>

      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上页
        </el-button>
        <el-button text @click="reload">
          <el-icon><Refresh /></el-icon>
          刷新页面
        </el-button>
      </div>

      <div class="helpful-links">
        <h3>您可能在寻找：</h3>
        <div class="links-grid">
          <router-link to="/editor/tiptap" class="link-item">
            <el-icon><Edit /></el-icon>
            Tiptap Editor
          </router-link>
          <router-link to="/editor/wang" class="link-item">
            <el-icon><Edit /></el-icon>
            wangEditor
          </router-link>
          <router-link to="/demo/table" class="link-item">
            <el-icon><Grid /></el-icon>
            表格演示
          </router-link>
          <router-link to="/demo/card" class="link-item">
            <el-icon><Grid /></el-icon>
            卡片演示
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, ArrowLeft, Refresh, Edit, Grid } from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

// 刷新页面
const reload = () => {
  window.location.reload()
}

// 页面标题
defineOptions({
  name: 'NotFoundView',
})
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(
    135deg,
    var(--el-bg-color-page) 0%,
    var(--el-fill-color-extra-light) 100%
  );
}

.error-illustration {
  margin-bottom: 40px;

  .error-number {
    font-size: 8rem;
    font-weight: 700;
    color: var(--el-color-primary);
    line-height: 1;
    margin-bottom: 16px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      font-size: 6rem;
    }

    @media (max-width: 480px) {
      font-size: 4rem;
    }
  }

  .error-text {
    font-size: 1.5rem;
    color: var(--el-text-color-secondary);
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
}

.error-content {
  max-width: 600px;
  width: 100%;
}

.error-message {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
}

.error-description {
  font-size: 1.1rem;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;

    .el-button {
      width: 200px;
    }
  }
}

.helpful-links {
  margin-top: 32px;

  h3 {
    font-size: 1.2rem;
    color: var(--el-text-color-primary);
    margin-bottom: 20px;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;

    .link-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-light);
      border-radius: 8px;
      text-decoration: none;
      color: var(--el-text-color-primary);
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .el-icon {
        font-size: 18px;
      }
    }
  }
}

// 深色主题适配
:root.dark {
  .error-page {
    background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-fill-color) 100%);
  }

  .helpful-links .links-grid .link-item {
    background: var(--el-bg-color);
    border-color: var(--el-border-color-dark);

    &:hover {
      border-color: var(--el-color-primary-light-1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
