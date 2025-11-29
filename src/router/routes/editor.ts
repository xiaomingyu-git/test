import type { RouteRecordRaw } from 'vue-router'

// 编辑器相关路由
export const editorRoutes: RouteRecordRaw[] = [
  {
    path: 'tiptap',
    name: 'TiptapEditor',
    component: () => import('@/views/editor/TiptapView.vue'),
    meta: {
      title: 'Tiptap Editor',
      description: '基于 Tiptap 的富文本编辑器',
      requiresAuth: false,
      layout: 'EditorLayout'
    }
  },
  {
    path: 'wang',
    name: 'WangEditor',
    component: () => import('@/views/editor/WangEditorView.vue'),
    meta: {
      title: 'wangEditor',
      description: '基于 wangEditor 的富文本编辑器',
      requiresAuth: false,
      layout: 'EditorLayout'
    }
  },
  {
    path: 'comparison',
    name: 'EditorComparison',
    component: () => import('@/views/editor/EditorComparison.vue'),
    meta: {
      title: '编辑器对比',
      description: 'Tiptap 与 wangEditor 功能对比',
      requiresAuth: false,
      layout: 'DefaultLayout'
    }
  }
]