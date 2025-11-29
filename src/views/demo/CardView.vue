<template>
  <div class="card-demo">
    <div class="demo-header">
      <h1 class="demo-title">卡片组件演示</h1>
      <p class="demo-description">Element Plus 卡片组件功能演示</p>
    </div>

    <div class="demo-content">
      <!-- 基础卡片 -->
      <div class="demo-section">
        <h2 class="section-title">基础卡片</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="card in basicCards" :key="card.id">
            <el-card class="basic-card">
              <template #header>
                <div class="card-header">
                  <span>{{ card.title }}</span>
                  <el-button type="text" @click="handleCardAction(card)">
                    操作
                  </el-button>
                </div>
              </template>
              <div class="card-content">
                <p>{{ card.description }}</p>
                <div class="card-meta">
                  <el-tag :type="card.tagType">{{ card.tag }}</el-tag>
                  <span class="card-time">{{ card.time }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图片卡片 -->
      <div class="demo-section">
        <h2 class="section-title">图片卡片</h2>
        <el-row :gutter="20">
          <el-col :span="6" v-for="imgCard in imageCards" :key="imgCard.id">
            <el-card :body-style="{ padding: '0px' }" class="image-card">
              <img :src="imgCard.image" class="card-image" />
              <div class="image-card-content">
                <h3>{{ imgCard.title }}</h3>
                <p>{{ imgCard.description }}</p>
                <div class="image-card-actions">
                  <el-button type="primary" size="small">查看详情</el-button>
                  <el-button size="small">收藏</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 统计卡片 -->
      <div class="demo-section">
        <h2 class="section-title">统计卡片</h2>
        <el-row :gutter="20">
          <el-col :span="6" v-for="stat in statistics" :key="stat.key">
            <el-card class="stat-card" :class="stat.type">
              <div class="stat-icon">
                <el-icon :size="32">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.trend">
                  <el-icon>
                    <ArrowUp v-if="stat.trend === 'up'" />
                    <ArrowDown v-else />
                  </el-icon>
                  <span>{{ stat.change }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 用户卡片 -->
      <div class="demo-section">
        <h2 class="section-title">用户卡片</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="user in users" :key="user.id">
            <el-card class="user-card">
              <div class="user-info">
                <el-avatar :size="64" :src="user.avatar" />
                <div class="user-details">
                  <h3>{{ user.name }}</h3>
                  <p>{{ user.role }}</p>
                  <el-rate
                    v-model="user.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                  />
                </div>
              </div>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ user.projects }}</span>
                  <span class="stat-text">项目</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ user.followers }}</span>
                  <span class="stat-text">关注者</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ user.likes }}</span>
                  <span class="stat-text">点赞</span>
                </div>
              </div>
              <div class="user-actions">
                <el-button type="primary" size="small">关注</el-button>
                <el-button size="small">发消息</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 文章卡片 -->
      <div class="demo-section">
        <h2 class="section-title">文章卡片</h2>
        <el-row :gutter="20">
          <el-col :span="12" v-for="article in articles" :key="article.id">
            <el-card class="article-card" shadow="hover">
              <div class="article-header">
                <h3>{{ article.title }}</h3>
                <div class="article-meta">
                  <span class="author">{{ article.author }}</span>
                  <span class="date">{{ article.date }}</span>
                  <el-tag size="small">{{ article.category }}</el-tag>
                </div>
              </div>
              <div class="article-content">
                <p>{{ article.summary }}</p>
              </div>
              <div class="article-footer">
                <div class="article-stats">
                  <span><el-icon><View /></el-icon> {{ article.views }}</span>
                  <span><el-icon><ChatDotRound /></el-icon> {{ article.comments }}</span>
                  <span><el-icon><Star /></el-icon> {{ article.likes }}</span>
                </div>
                <el-button type="text" @click="readArticle(article)">
                  阅读全文
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowUp,
  ArrowDown,
  User,
  ShoppingCart,
  Document,
  Setting,
  View,
  ChatDotRound,
  Star
} from '@element-plus/icons-vue'

// 页面标题
defineOptions({
  name: 'CardView'
})

// 基础卡片数据
const basicCards = ref([
  {
    id: 1,
    title: '项目进度',
    description: '当前项目正在进行第三阶段开发，预计本月底完成主要功能。',
    tag: '进行中',
    tagType: 'primary',
    time: '2023-12-01'
  },
  {
    id: 2,
    title: '数据分析',
    description: '本月用户增长15%，活跃度提升8%，转化率达到3.2%。',
    tag: '已完成',
    tagType: 'success',
    time: '2023-11-30'
  },
  {
    id: 3,
    title: '系统维护',
    description: '计划于本周日凌晨进行系统升级，预计耗时2小时。',
    tag: '待处理',
    tagType: 'warning',
    time: '2023-12-02'
  }
])

// 图片卡片数据
const imageCards = ref([
  {
    id: 1,
    title: '山景照片',
    description: '美丽的山脉风景，清晨的第一缕阳光洒在山峰上。',
    image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Mountain'
  },
  {
    id: 2,
    title: '海边日落',
    description: '金色的夕阳缓缓沉入海平面，天空染成了橙红色。',
    image: 'https://via.placeholder.com/300x200/2196F3/white?text=Sunset'
  },
  {
    id: 3,
    title: '城市夜景',
    description: '繁华都市的夜晚，霓虹灯闪烁，车水马龙。',
    image: 'https://via.placeholder.com/300x200/FF9800/white?text=City'
  },
  {
    id: 4,
    title: '森林小径',
    description: '幽静的森林小径，阳光透过树叶洒下斑驳的光影。',
    image: 'https://via.placeholder.com/300x200/9C27B0/white?text=Forest'
  }
])

// 统计数据
const statistics = ref([
  {
    key: 'users',
    label: '用户总数',
    value: '12,345',
    change: '12%',
    trend: 'up',
    type: 'primary',
    icon: User
  },
  {
    key: 'orders',
    label: '订单数量',
    value: '3,456',
    change: '8%',
    trend: 'up',
    type: 'success',
    icon: ShoppingCart
  },
  {
    key: 'revenue',
    label: '营业收入',
    value: '¥89,234',
    change: '15%',
    trend: 'up',
    type: 'warning',
    icon: Document
  },
  {
    key: 'performance',
    label: '系统性能',
    value: '99.8%',
    change: '0.2%',
    trend: 'down',
    type: 'danger',
    icon: Setting
  }
])

// 用户数据
const users = ref([
  {
    id: 1,
    name: '张小明',
    role: '前端工程师',
    avatar: 'https://via.placeholder.com/64/4CAF50/white?text=张',
    rating: 4.5,
    projects: 12,
    followers: 234,
    likes: 567
  },
  {
    id: 2,
    name: '李小红',
    role: 'UI设计师',
    avatar: 'https://via.placeholder.com/64/E91E63/white?text=李',
    rating: 4.8,
    projects: 18,
    followers: 456,
    likes: 890
  },
  {
    id: 3,
    name: '王小华',
    role: '产品经理',
    avatar: 'https://via.placeholder.com/64/2196F3/white?text=王',
    rating: 4.2,
    projects: 8,
    followers: 123,
    likes: 234
  }
])

// 文章数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    author: '技术团队',
    date: '2023-12-01',
    category: '前端开发',
    summary: '本文介绍了 Vue 3 组合式 API 的使用技巧和最佳实践，包括响应式数据处理、生命周期钩子、逻辑复用等内容。通过实际案例帮助开发者更好地理解和使用组合式 API。',
    views: 1234,
    comments: 45,
    likes: 89
  },
  {
    id: 2,
    title: 'TypeScript 类型系统深入解析',
    author: '架构师',
    date: '2023-11-30',
    category: '编程语言',
    summary: '深入探讨 TypeScript 的类型系统，包括高级类型、类型推断、泛型、类型守卫等特性。帮助开发者充分利用 TypeScript 的类型检查能力，提高代码质量和开发效率。',
    views: 2345,
    comments: 67,
    likes: 156
  },
  {
    id: 3,
    title: '前端性能优化实战指南',
    author: '性能专家',
    date: '2023-11-29',
    category: '性能优化',
    summary: '从多个维度介绍前端性能优化的方法和技巧，包括资源加载优化、代码分割、缓存策略、渲染优化等。通过实际案例分析，帮助开发者构建高性能的 Web 应用。',
    views: 3456,
    comments: 89,
    likes: 234
  },
  {
    id: 4,
    title: '微前端架构设计与实践',
    author: '架构团队',
    date: '2023-11-28',
    category: '架构设计',
    summary: '详细介绍微前端架构的设计理念和实现方案，包括模块拆分、通信机制、样式隔离、部署策略等。分享大型项目的微前端改造经验和最佳实践。',
    views: 4567,
    comments: 123,
    likes: 345
  }
])

// 卡片操作处理
const handleCardAction = (card: any) => {
  ElMessage.success(`操作了卡片：${card.title}`)
}

// 阅读文章
const readArticle = (article: any) => {
  ElMessage.info(`正在阅读：${article.title}`)
}
</script>

<style scoped lang="scss">
.card-demo {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;

  .demo-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .demo-description {
    font-size: 1.2rem;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 20px 0;
    border-bottom: 2px solid var(--el-color-primary);
    padding-bottom: 8px;
  }
}

// 基础卡片样式
.basic-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-content {
    p {
      color: var(--el-text-color-regular);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-time {
        color: var(--el-text-color-secondary);
        font-size: 0.9rem;
      }
    }
  }
}

// 图片卡片样式
.image-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }

  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .image-card-content {
    padding: 14px;

    h3 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0 0 12px 0;
      color: var(--el-text-color-regular);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .image-card-actions {
      display: flex;
      gap: 8px;
    }
  }
}

// 统计卡片样式
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &.primary {
    border-left: 4px solid var(--el-color-primary);
  }

  &.success {
    border-left: 4px solid var(--el-color-success);
  }

  &.warning {
    border-left: 4px solid var(--el-color-warning);
  }

  &.danger {
    border-left: 4px solid var(--el-color-danger);
  }

  .stat-icon {
    margin-right: 16px;
    opacity: 0.7;
  }

  .stat-content {
    flex: 1;

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }

    .stat-label {
      color: var(--el-text-color-regular);
      margin-bottom: 8px;
    }

    .stat-change {
      display: flex;
      align-items: center;
      font-size: 0.9rem;

      &.up {
        color: var(--el-color-success);
      }

      &.down {
        color: var(--el-color-danger);
      }

      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

// 用户卡片样式
.user-card {
  margin-bottom: 20px;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .user-details {
      margin-left: 16px;
      flex: 1;

      h3 {
        margin: 0 0 4px 0;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0 0 8px 0;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .user-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 16px 0;
    border-top: 1px solid var(--el-border-color-light);
    border-bottom: 1px solid var(--el-border-color-light);

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .stat-text {
        display: block;
        font-size: 0.9rem;
        color: var(--el-text-color-secondary);
        margin-top: 4px;
      }
    }
  }

  .user-actions {
    display: flex;
    gap: 8px;
  }
}

// 文章卡片样式
.article-card {
  margin-bottom: 20px;
  cursor: pointer;

  .article-header {
    margin-bottom: 16px;

    h3 {
      margin: 0 0 8px 0;
      color: var(--el-text-color-primary);
      font-size: 1.2rem;
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.9rem;
      color: var(--el-text-color-secondary);

      .author {
        font-weight: 500;
      }
    }
  }

  .article-content {
    margin-bottom: 16px;

    p {
      color: var(--el-text-color-regular);
      line-height: 1.6;
      margin: 0;
    }
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-light);

    .article-stats {
      display: flex;
      gap: 16px;
      font-size: 0.9rem;
      color: var(--el-text-color-secondary);

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-header {
    .demo-title {
      font-size: 2rem;
    }

    .demo-description {
      font-size: 1rem;
    }
  }

  .demo-section {
    padding: 16px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .stat-card {
    padding: 16px;

    .stat-icon {
      margin-right: 12px;
    }

    .stat-content .stat-value {
      font-size: 1.4rem;
    }
  }

  .user-stats .stat-item {
    flex: 1;
  }

  .article-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    .article-stats {
      order: 2;
    }
  }
}

// 深色主题适配
:root.dark {
  .card-demo {
    background: var(--el-bg-color);
  }

  .demo-section {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
}
</style>