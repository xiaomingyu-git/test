<template>
  <div class="about-page">
    <div class="about-header">
      <h1 class="about-title">关于项目</h1>
      <p class="about-subtitle">Vue Editor - 富文本编辑器解决方案</p>
    </div>

    <div class="about-content">
      <!-- 项目简介 -->
      <section class="about-section">
        <el-card class="intro-card">
          <div class="intro-content">
            <div class="intro-text">
              <h2>项目简介</h2>
              <p>
                Vue Editor 是一个基于 Vue 3 + TypeScript 的现代化富文本编辑器解决方案。 项目集成了
                Tiptap 和 wangEditor 两款主流的富文本编辑器，提供了完整的功能演示和集成示例。
              </p>
              <p>
                本项目旨在为开发者提供一个完整的富文本编辑器选型参考，通过实际的使用案例和性能对比，
                帮助开发者在不同场景下选择最适合的编辑器方案。
              </p>
            </div>
            <div class="intro-features">
              <h3>核心特性</h3>
              <div class="feature-grid">
                <div class="feature-item">
                  <el-icon :size="32" color="#409EFF">
                    <Edit />
                  </el-icon>
                  <h4>双编辑器支持</h4>
                  <p>集成 Tiptap 和 wangEditor</p>
                </div>
                <div class="feature-item">
                  <el-icon :size="32" color="#67C23A">
                    <Monitor />
                  </el-icon>
                  <h4>完整演示</h4>
                  <p>丰富的功能演示和示例</p>
                </div>
                <div class="feature-item">
                  <el-icon :size="32" color="#E6A23C">
                    <Tools />
                  </el-icon>
                  <h4>组件化设计</h4>
                  <p>模块化、可复用的组件</p>
                </div>
                <div class="feature-item">
                  <el-icon :size="32" color="#F56C6C">
                    <Document />
                  </el-icon>
                  <h4>TypeScript</h4>
                  <p>完整的类型定义支持</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 技术栈 -->
      <section class="about-section">
        <h2 class="section-title">技术栈</h2>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="tech-card">
              <template #header>
                <div class="tech-header">
                  <h3>前端技术</h3>
                  <el-tag type="primary">核心</el-tag>
                </div>
              </template>
              <div class="tech-list">
                <div v-for="tech in frontendTechs" :key="tech.name" class="tech-item">
                  <div class="tech-info">
                    <span class="tech-name">{{ tech.name }}</span>
                    <span class="tech-version">{{ tech.version }}</span>
                  </div>
                  <div class="tech-description">{{ tech.description }}</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="tech-card">
              <template #header>
                <div class="tech-header">
                  <h3>编辑器技术</h3>
                  <el-tag type="success">特色</el-tag>
                </div>
              </template>
              <div class="tech-list">
                <div v-for="tech in editorTechs" :key="tech.name" class="tech-item">
                  <div class="tech-info">
                    <span class="tech-name">{{ tech.name }}</span>
                    <span class="tech-version">{{ tech.version }}</span>
                  </div>
                  <div class="tech-description">{{ tech.description }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 项目结构 -->
      <section class="about-section">
        <h2 class="section-title">项目结构</h2>
        <el-card class="structure-card">
          <div class="structure-content">
            <div class="structure-tree">
              <pre><code>{{ projectStructure }}</code></pre>
            </div>
            <div class="structure-description">
              <h3>目录说明</h3>
              <ul>
                <li><strong>src/components/</strong> - 公共组件，包括编辑器组件封装</li>
                <li><strong>src/views/</strong> - 页面组件，按功能模块组织</li>
                <li><strong>src/router/</strong> - 路由配置，支持模块化路由</li>
                <li><strong>src/layouts/</strong> - 布局组件</li>
                <li><strong>src/utils/</strong> - 工具函数和辅助类</li>
                <li><strong>src/types/</strong> - TypeScript 类型定义</li>
                <li><strong>src/stores/</strong> - 状态管理（Pinia）</li>
              </ul>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 快速开始 -->
      <section class="about-section">
        <h2 class="section-title">快速开始</h2>
        <el-card class="quickstart-card">
          <div class="quickstart-content">
            <div class="quickstart-steps">
              <h3>安装和运行</h3>
              <div class="step-list">
                <div v-for="(step, index) in installSteps" :key="index" class="step-item">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <h4>{{ step.title }}</h4>
                    <div class="step-command">
                      <code>{{ step.command }}</code>
                      <el-button type="text" size="small" @click="copyCommand(step.command)">
                        复制
                      </el-button>
                    </div>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="quickstart-links">
              <h3>相关链接</h3>
              <div class="link-grid">
                <a
                  v-for="link in quickLinks"
                  :key="link.name"
                  :href="link.url"
                  target="_blank"
                  class="link-item"
                >
                  <el-icon :size="20">
                    <component :is="link.icon" />
                  </el-icon>
                  <span>{{ link.name }}</span>
                  <el-icon size="16">
                    <TopRight />
                  </el-icon>
                </a>
              </div>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 贡献指南 -->
      <section class="about-section">
        <h2 class="section-title">贡献指南</h2>
        <el-card class="contribute-card">
          <div class="contribute-content">
            <div class="contribute-info">
              <h3>如何贡献</h3>
              <p>我们欢迎任何形式的贡献，包括但不限于：</p>
              <ul>
                <li>🐛 报告 Bug 和提出问题</li>
                <li>💡 提出新功能建议</li>
                <li>📝 改进文档</li>
                <li>🔧 提交代码修复</li>
                <li>✨ 开发新功能</li>
              </ul>
            </div>

            <div class="contribute-steps">
              <h3>贡献流程</h3>
              <el-steps direction="vertical" :active="1">
                <el-step title="Fork 项目" description="将项目 Fork 到你的 GitHub 账户" />
                <el-step title="创建分支" description="基于 main 分支创建新的功能分支" />
                <el-step title="开发功能" description="在本地开发并测试你的功能" />
                <el-step title="提交 PR" description="向 main 分支提交 Pull Request" />
                <el-step title="代码审查" description="等待维护者审查和合并代码" />
              </el-steps>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 许可证 -->
      <section class="about-section">
        <h2 class="section-title">开源许可证</h2>
        <el-card class="license-card">
          <div class="license-content">
            <div class="license-info">
              <h3>MIT License</h3>
              <p>本项目采用 MIT 许可证开源，这意味着你可以：</p>
              <ul>
                <li>✅ 商业使用</li>
                <li>✅ 修改</li>
                <li>✅ 分发</li>
                <li>✅ 私人使用</li>
              </ul>
              <p class="license-note">
                详细的许可证条款请查看项目根目录下的 <code>LICENSE</code> 文件。
              </p>
            </div>
          </div>
        </el-card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Monitor, Tools, Document, TopRight, Link } from '@element-plus/icons-vue'

// 页面标题
defineOptions({
  name: 'AboutView',
})

// 前端技术栈
const frontendTechs = ref([
  {
    name: 'Vue 3',
    version: 'v3.x',
    description: '渐进式 JavaScript 框架，提供 Composition API',
  },
  {
    name: 'TypeScript',
    version: 'v5.x',
    description: 'JavaScript 的超集，提供静态类型检查',
  },
  {
    name: 'Vite',
    version: 'v5.x',
    description: '现代化的前端构建工具，提供快速的 dev server',
  },
  {
    name: 'Element Plus',
    version: 'v2.x',
    description: 'Vue 3 的桌面端 UI 组件库',
  },
  {
    name: 'Vue Router',
    version: 'v4.x',
    description: 'Vue.js 官方的路由管理器',
  },
  {
    name: 'Pinia',
    version: 'v2.x',
    description: 'Vue 的状态管理库',
  },
  {
    name: 'SCSS',
    version: 'v1.x',
    description: 'CSS 预处理器，提供变量、嵌套等功能',
  },
])

// 编辑器技术栈
const editorTechs = ref([
  {
    name: 'Tiptap',
    version: 'v2.x',
    description: '基于 ProseMirror 的现代化富文本编辑器',
  },
  {
    name: 'wangEditor',
    version: 'v5.x',
    description: '轻量级的富文本编辑器，易用性强',
  },
  {
    name: 'ProseMirror',
    version: 'v1.x',
    description: 'Tiptap 的底层编辑器框架',
  },
  {
    name: 'Slate',
    version: 'v0.x',
    description: '可插拔的富文本编辑器框架（可选）',
  },
])

// 项目结构
const projectStructure = ref(`vue-editor/
├── public/                 # 静态资源
├── src/
│   ├── components/        # 公共组件
│   │   ├── TiptapEditor.vue
│   │   ├── WangEditor.vue
│   │   └── TiptapToolbar.vue
│   ├── views/            # 页面组件
│   │   ├── home/        # 首页相关
│   │   ├── editor/      # 编辑器页面
│   │   ├── demo/        # 演示页面
│   │   ├── about/       # 关于页面
│   │   └── error/       # 错误页面
│   ├── router/          # 路由配置
│   │   ├── index.ts
│   │   └── routes/      # 路由模块
│   ├── layouts/         # 布局组件
│   ├── stores/          # 状态管理
│   ├── utils/           # 工具函数
│   ├── types/           # 类型定义
│   └── styles/          # 样式文件
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md`)

// 安装步骤
const installSteps = ref([
  {
    title: '克隆项目',
    command: 'git clone https://github.com/your-username/vue-editor.git',
    description: '将项目克隆到本地',
  },
  {
    title: '安装依赖',
    command: 'npm install',
    description: '安装项目所需的所有依赖包',
  },
  {
    title: '开发模式',
    command: 'npm run dev',
    description: '启动开发服务器，默认端口为 5173',
  },
  {
    title: '构建项目',
    command: 'npm run build',
    description: '构建生产版本',
  },
])

// 快速链接
const quickLinks = ref([
  {
    name: 'GitHub 仓库',
    url: 'https://github.com/your-username/vue-editor',
    icon: Link,
  },
  {
    name: 'Vue.js 官网',
    url: 'https://vuejs.org/',
    icon: Document,
  },
  {
    name: 'Tiptap 文档',
    url: 'https://tiptap.dev/',
    icon: Document,
  },
  {
    name: 'wangEditor 文档',
    url: 'https://www.wangeditor.com/',
    icon: Document,
  },
  {
    name: 'Element Plus',
    url: 'https://element-plus.org/',
    icon: Link,
  },
  {
    name: 'Vite 官网',
    url: 'https://vitejs.dev/',
    icon: Monitor,
  },
])

// 复制命令
const copyCommand = async (command: string) => {
  try {
    await navigator.clipboard.writeText(command)
    ElMessage.success('命令已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped lang="scss">
.about-page {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: 100vh;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;

  .about-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .about-subtitle {
    font-size: 1.3rem;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 32px;

  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 20px 0;
    border-bottom: 2px solid var(--el-color-primary);
    padding-bottom: 8px;
  }
}

// 介绍卡片
.intro-card {
  background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-fill-color-extra-light) 100%);

  .intro-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;

    .intro-text {
      h2 {
        margin: 0 0 20px 0;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0 0 16px 0;
        line-height: 1.6;
        color: var(--el-text-color-regular);
      }
    }

    .intro-features {
      h3 {
        margin: 0 0 20px 0;
        color: var(--el-text-color-primary);
      }

      .feature-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        .feature-item {
          text-align: center;
          padding: 20px;
          background: var(--el-bg-color);
          border-radius: 8px;
          border: 1px solid var(--el-border-color-light);

          h4 {
            margin: 12px 0 8px 0;
            color: var(--el-text-color-primary);
          }

          p {
            margin: 0;
            color: var(--el-text-color-secondary);
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}

// 技术卡片
.tech-card {
  .tech-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      color: var(--el-text-color-primary);
    }
  }

  .tech-list {
    .tech-item {
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color-extra-light);

      &:last-child {
        border-bottom: none;
      }

      .tech-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .tech-name {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .tech-version {
          font-size: 0.9rem;
          color: var(--el-text-color-secondary);
          background: var(--el-fill-color);
          padding: 2px 8px;
          border-radius: 4px;
        }
      }

      .tech-description {
        font-size: 0.9rem;
        color: var(--el-text-color-regular);
      }
    }
  }
}

// 项目结构卡片
.structure-card {
  .structure-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;

    .structure-tree {
      pre {
        background: var(--el-fill-color-extra-light);
        padding: 20px;
        border-radius: 8px;
        overflow-x: auto;
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--el-text-color-primary);
      }
    }

    .structure-description {
      h3 {
        margin: 0 0 16px 0;
        color: var(--el-text-color-primary);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 8px 0;
          color: var(--el-text-color-regular);
          border-bottom: 1px solid var(--el-border-color-extra-light);

          &:last-child {
            border-bottom: none;
          }

          strong {
            color: var(--el-text-color-primary);
            font-family: 'Consolas', 'Monaco', monospace;
          }
        }
      }
    }
  }
}

// 快速开始卡片
.quickstart-card {
  .quickstart-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;

    .quickstart-steps {
      h3 {
        margin: 0 0 20px 0;
        color: var(--el-text-color-primary);
      }

      .step-list {
        .step-item {
          display: flex;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid var(--el-border-color-extra-light);

          &:last-child {
            border-bottom: none;
          }

          .step-number {
            width: 32px;
            height: 32px;
            background: var(--el-color-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
          }

          .step-content {
            flex: 1;

            h4 {
              margin: 0 0 8px 0;
              color: var(--el-text-color-primary);
            }

            .step-command {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 8px;

              code {
                background: var(--el-fill-color-extra-light);
                padding: 8px 12px;
                border-radius: 4px;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 0.9rem;
                flex: 1;
              }
            }

            p {
              margin: 0;
              color: var(--el-text-color-secondary);
              font-size: 0.9rem;
            }
          }
        }
      }
    }

    .quickstart-links {
      h3 {
        margin: 0 0 20px 0;
        color: var(--el-text-color-primary);
      }

      .link-grid {
        display: grid;
        gap: 12px;

        .link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: var(--el-fill-color-extra-light);
          border-radius: 8px;
          text-decoration: none;
          color: var(--el-text-color-primary);
          transition: all 0.3s ease;

          &:hover {
            background: var(--el-fill-color-light);
            transform: translateX(4px);
          }
        }
      }
    }
  }
}

// 贡献指南卡片
.contribute-card {
  .contribute-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;

    .contribute-info {
      h3 {
        margin: 0 0 16px 0;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0 0 16px 0;
        color: var(--el-text-color-regular);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 6px 0;
          color: var(--el-text-color-regular);
        }
      }
    }

    .contribute-steps {
      h3 {
        margin: 0 0 20px 0;
        color: var(--el-text-color-primary);
      }
    }
  }
}

// 许可证卡片
.license-card {
  .license-content {
    .license-info {
      h3 {
        margin: 0 0 16px 0;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0 0 16px 0;
        color: var(--el-text-color-regular);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;

        li {
          padding: 6px 12px;
          background: var(--el-fill-color-extra-light);
          border-radius: 4px;
          color: var(--el-text-color-regular);
        }
      }

      .license-note {
        code {
          background: var(--el-fill-color-extra-light);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Consolas', 'Monaco', monospace;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .intro-content {
    grid-template-columns: 1fr !important;
  }

  .structure-content {
    grid-template-columns: 1fr !important;
  }

  .quickstart-content {
    grid-template-columns: 1fr !important;
  }

  .contribute-content {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 768px) {
  .about-header {
    .about-title {
      font-size: 2rem;
    }

    .about-subtitle {
      font-size: 1rem;
    }
  }

  .about-section {
    .section-title {
      font-size: 1.4rem;
    }
  }

  .feature-grid {
    grid-template-columns: 1fr !important;
  }

  .step-item {
    flex-direction: column;
    gap: 12px;

    .step-number {
      align-self: flex-start;
    }
  }
}

// 深色主题适配
:root.dark {
  .about-page {
    background: var(--el-bg-color);
  }

  .intro-card {
    background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-fill-color) 100%);
  }

  .structure-tree pre {
    background: var(--el-fill-color-darker);
  }
}
</style>
