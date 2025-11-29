// CRUD 路由配置
export const crudRoutes: any[] = [
  {
    path: 'user',
    name: 'UserManagement',
    component: () => import('@/views/CrudView.vue'),
    meta: {
      title: '用户管理',
      description: '用户信息管理页面',
      icon: 'User',
    },
  },
  {
    path: 'role',
    name: 'RoleManagement',
    component: () => import('@/views/role/RoleManagementView.vue'),
    meta: {
      title: '角色管理',
      description: '角色权限管理页面',
      icon: 'UserFilled',
    },
  },
  {
    path: 'permission',
    name: 'PermissionManagement',
    component: () => import('@/views/permission/PermissionManagementView.vue'),
    meta: {
      title: '权限管理',
      description: '系统权限管理页面',
      icon: 'Lock',
    },
  },
]
