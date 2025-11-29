import type { RouteRecordRaw } from 'vue-router'

// 首页相关路由
export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: {
      title: '首页',
      description: 'Vue Editor - 富文本编辑器解决方案',
      requiresAuth: false,
    },
  },
  {
    path: 'about',
    name: 'About',
    component: () => import('@/views/about/AboutView.vue'),
    meta: {
      title: '关于项目',
      description: '了解 Vue Editor 项目详情',
      requiresAuth: false,
    },
  },
]
