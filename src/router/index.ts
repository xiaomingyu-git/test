import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
import { homeRoutes } from './routes/home'
import { editorRoutes } from './routes/editor'
import { demoRoutes } from './routes/demo'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: DefaultLayout,
    redirect: '/',
    children: [
      ...homeRoutes,
      {
        path: 'demo',
        name: 'Demo',
        redirect: '/demo/table',
        children: demoRoutes,
        meta: {
          title: '演示',
          description: '组件功能演示'
        }
      }
    ]
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorLayout,
    redirect: '/editor/tiptap',
    children: editorRoutes,
    meta: {
      title: '编辑器',
      description: '富文本编辑器'
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      description: '抱歉，您访问的页面不存在'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Vue Editor`
  } else {
    document.title = 'Vue Editor - 富文本编辑器解决方案'
  }

  // 设置页面描述
  if (to.meta?.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', to.meta.description as string)
  }

  // 权限检查（如果需要）
  if (to.meta?.requiresAuth) {
    // 这里可以添加登录状态检查逻辑
    // const isAuthenticated = checkAuth()
    // if (!isAuthenticated) {
    //   next('/login')
    //   return
    // }
  }

  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 路由切换后的处理逻辑
  // 例如：埋点统计、错误上报等
  console.log(`Route changed from ${from.path} to ${to.path}`)
})

// 错误处理
router.onError((error) => {
  console.error('Router error:', error)
  // 这里可以添加错误上报逻辑
})

export default router

// 导出路由实例和一些工具函数
export { router }

// 导出路由工具函数
export const routeUtils = {
  // 获取路由标题
  getRouteTitle: (route: any): string => {
    return route.meta?.title || 'Vue Editor'
  },

  // 获取面包屑
  getBreadcrumb: (route: any): Array<{ title: string; path: string }> => {
    const breadcrumb: Array<{ title: string; path: string }> = []
    const matched = route.matched.filter((item: any) => item.meta && item.meta.title)

    matched.forEach((item: any) => {
      breadcrumb.push({
        title: item.meta.title,
        path: item.path
      })
    })

    return breadcrumb
  },

  // 检查是否需要认证
  requiresAuth: (route: any): boolean => {
    return Boolean(route.meta?.requiresAuth)
  }
}