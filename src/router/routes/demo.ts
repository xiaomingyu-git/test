import type { RouteRecordRaw } from 'vue-router'

// 演示页面路由
export const demoRoutes: RouteRecordRaw[] = [
  {
    path: 'table',
    name: 'TableView',
    component: () => import('@/views/demo/TableView.vue'),
    meta: {
      title: '表格组件演示',
      description: 'Element Plus 表格组件功能演示',
      requiresAuth: false
    }
  },
  {
    path: 'card',
    name: 'CardView',
    component: () => import('@/views/demo/CardView.vue'),
    meta: {
      title: '卡片组件演示',
      description: 'Element Plus 卡片组件功能演示',
      requiresAuth: false
    }
  },
  {
    path: 'integration',
    name: 'IntegrationView',
    component: () => import('@/views/demo/IntegrationView.vue'),
    meta: {
      title: '集成演示',
      description: '编辑器与其他组件的集成演示',
      requiresAuth: false,
      layout: 'EditorLayout'
    }
  },
  {
    path: 'crud',
    name: 'CrudView',
    component: () => import('@/views/CrudView.vue'),
    meta: {
      title: 'CRUD 标准页面',
      description: '完整的增删改查标准页面演示，包含弹窗编辑功能',
      requiresAuth: false
    }
  }
]