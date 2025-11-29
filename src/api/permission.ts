import type {
  Permission,
  PermissionFormData,
  PermissionListResponse,
  PermissionFetchParams,
  ApiResponse,
} from '@/types/permission'
import { PermissionStatus, PermissionType, PermissionModule } from '@/types/permission'

// 模拟 API 延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟权限数据
const mockPermissions: Permission[] = [
  {
    id: 1,
    name: '用户查看',
    code: 'user:view',
    description: '查看用户信息和列表',
    type: PermissionType.BUTTON,
    module: PermissionModule.USER_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    name: '用户创建',
    code: 'user:create',
    description: '创建新用户账户',
    type: PermissionType.BUTTON,
    module: PermissionModule.USER_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    name: '用户编辑',
    code: 'user:edit',
    description: '编辑用户基本信息',
    type: PermissionType.BUTTON,
    module: PermissionModule.USER_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    name: '用户删除',
    code: 'user:delete',
    description: '删除用户账户',
    type: PermissionType.BUTTON,
    module: PermissionModule.USER_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-04 10:00:00',
    updatedAt: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    name: '角色查看',
    code: 'role:view',
    description: '查看角色信息和列表',
    type: PermissionType.BUTTON,
    module: PermissionModule.ROLE_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-05 10:00:00',
    updatedAt: '2024-01-05 10:00:00',
  },
  {
    id: 6,
    name: '角色管理菜单',
    code: 'role:menu',
    description: '角色管理模块菜单访问权限',
    type: PermissionType.MENU,
    module: PermissionModule.ROLE_MANAGE,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-06 10:00:00',
    updatedAt: '2024-01-06 10:00:00',
  },
  {
    id: 7,
    name: '系统配置',
    code: 'system:config',
    description: '系统参数配置API访问',
    type: PermissionType.API,
    module: PermissionModule.SYSTEM_CONFIG,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-07 10:00:00',
    updatedAt: '2024-01-07 10:00:00',
  },
  {
    id: 8,
    name: '数据导出',
    code: 'data:export',
    description: '数据导出功能API',
    type: PermissionType.API,
    module: PermissionModule.DATA_EXPORT,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-08 10:00:00',
    updatedAt: '2024-01-08 10:00:00',
  },
  {
    id: 9,
    name: '内容管理菜单',
    code: 'content:menu',
    description: '内容管理模块菜单访问权限',
    type: PermissionType.MENU,
    module: PermissionModule.CONTENT_MANAGE,
    status: PermissionStatus.INACTIVE,
    createdAt: '2024-01-09 10:00:00',
    updatedAt: '2024-01-09 10:00:00',
  },
  {
    id: 10,
    name: '日志查看',
    code: 'log:view',
    description: '查看系统操作日志',
    type: PermissionType.BUTTON,
    module: PermissionModule.LOG_VIEW,
    status: PermissionStatus.ACTIVE,
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-01-10 10:00:00',
  },
]

// 生成更多模拟数据
for (let i = 11; i <= 30; i++) {
  const types: PermissionType[] = [PermissionType.MENU, PermissionType.BUTTON, PermissionType.API]
  const modules: PermissionModule[] = [
    PermissionModule.USER_MANAGE,
    PermissionModule.ROLE_MANAGE,
    PermissionModule.SYSTEM_CONFIG,
    PermissionModule.CONTENT_MANAGE,
    PermissionModule.DATA_EXPORT,
    PermissionModule.LOG_VIEW,
  ]
  const statuses: PermissionStatus[] = [PermissionStatus.ACTIVE, PermissionStatus.INACTIVE]

  const type = types[i % 3]!
  const module = modules[i % 6]!
  const status = statuses[i % 2]!

  mockPermissions.push({
    id: i,
    name: `${module}_${i}_权限`,
    code: `${module}:action${i}`,
    description: `这是权限${i}的描述信息`,
    type,
    module,
    status,
    createdAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
    updatedAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
  })
}

/**
 * 获取权限列表
 */
export const getPermissionList = async (
  params: PermissionFetchParams,
): Promise<ApiResponse<PermissionListResponse>> => {
  await delay(500) // 模拟网络延迟

  try {
    let filteredPermissions = [...mockPermissions]

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredPermissions = filteredPermissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(keyword) ||
          permission.code.toLowerCase().includes(keyword) ||
          (permission.description && permission.description.toLowerCase().includes(keyword)),
      )
    }

    // 权限类型筛选
    if (params.type) {
      filteredPermissions = filteredPermissions.filter(
        (permission) => permission.type === params.type,
      )
    }

    // 权限模块筛选
    if (params.module) {
      filteredPermissions = filteredPermissions.filter(
        (permission) => permission.module === params.module,
      )
    }

    // 状态筛选
    if (params.status) {
      filteredPermissions = filteredPermissions.filter(
        (permission) => permission.status === params.status,
      )
    }

    // 排序
    const sortBy = params.sortBy || 'createdAt'
    const sortOrder = params.sortOrder || 'desc'

    filteredPermissions.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Permission] || ''
      let bValue: any = b[sortBy as keyof Permission] || ''

      // 如果是时间字符串，转换为时间戳进行比较
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // 计算分页
    const total = filteredPermissions.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const permissions = filteredPermissions.slice(start, end)

    return {
      success: true,
      data: {
        permissions,
        total,
      },
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return {
      success: false,
      data: { permissions: [], total: 0 },
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 根据ID获取权限详情
 */
export const getPermissionById = async (id: number): Promise<ApiResponse<Permission>> => {
  await delay(200)

  try {
    const permission = mockPermissions.find((permission) => permission.id === id)

    if (!permission) {
      return {
        success: false,
        data: null as any,
        message: '权限不存在',
        code: 404,
      }
    }

    return {
      success: true,
      data: permission,
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取权限详情失败:', error)
    return {
      success: false,
      data: null as any,
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 创建权限
 */
export const createPermission = async (
  permissionData: PermissionFormData,
): Promise<ApiResponse<Permission>> => {
  await delay(300)

  try {
    // 检查权限名称是否已存在
    if (mockPermissions.some((permission) => permission.name === permissionData.name)) {
      return {
        success: false,
        data: null as any,
        message: '权限名称已存在',
        code: 400,
      }
    }

    // 检查权限编码是否已存在
    if (mockPermissions.some((permission) => permission.code === permissionData.code)) {
      return {
        success: false,
        data: null as any,
        message: '权限编码已存在',
        code: 400,
      }
    }

    // 验证权限编码格式
    const codePattern = /^[a-z_]+:[a-z_]+$/
    if (!codePattern.test(permissionData.code)) {
      return {
        success: false,
        data: null as any,
        message: '权限编码格式错误，应为 module:action 格式',
        code: 400,
      }
    }

    const newPermission: Permission = {
      id: Math.max(...mockPermissions.map((p) => p.id)) + 1,
      name: permissionData.name,
      code: permissionData.code,
      description: permissionData.description,
      type: permissionData.type,
      module: permissionData.module,
      status: permissionData.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }

    mockPermissions.push(newPermission)

    return {
      success: true,
      data: newPermission,
      message: '创建成功',
      code: 200,
    }
  } catch (error) {
    console.error('创建权限失败:', error)
    return {
      success: false,
      data: null as any,
      message: '创建失败',
      code: 500,
    }
  }
}

/**
 * 更新权限
 */
export const updatePermission = async (
  id: number,
  permissionData: PermissionFormData,
): Promise<ApiResponse<Permission>> => {
  await delay(300)

  try {
    const permissionIndex = mockPermissions.findIndex((permission) => permission.id === id)

    if (permissionIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: '权限不存在',
        code: 404,
      }
    }

    // 检查权限名称是否已被其他权限使用
    if (
      mockPermissions.some(
        (permission) => permission.name === permissionData.name && permission.id !== id,
      )
    ) {
      return {
        success: false,
        data: null as any,
        message: '权限名称已存在',
        code: 400,
      }
    }

    // 检查权限编码是否已被其他权限使用
    if (
      mockPermissions.some(
        (permission) => permission.code === permissionData.code && permission.id !== id,
      )
    ) {
      return {
        success: false,
        data: null as any,
        message: '权限编码已存在',
        code: 400,
      }
    }

    // 验证权限编码格式
    const codePattern = /^[a-z_]+:[a-z_]+$/
    if (!codePattern.test(permissionData.code)) {
      return {
        success: false,
        data: null as any,
        message: '权限编码格式错误，应为 module:action 格式',
        code: 400,
      }
    }

    const currentPermission = mockPermissions[permissionIndex]

    const updatedPermission: Permission = {
      id: currentPermission!.id,
      name: permissionData.name,
      code: permissionData.code,
      description: permissionData.description,
      type: permissionData.type,
      module: permissionData.module,
      status: permissionData.status,
      createdAt: currentPermission!.createdAt,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }

    mockPermissions[permissionIndex] = updatedPermission

    return {
      success: true,
      data: updatedPermission,
      message: '更新成功',
      code: 200,
    }
  } catch (error) {
    console.error('更新权限失败:', error)
    return {
      success: false,
      data: null as any,
      message: '更新失败',
      code: 500,
    }
  }
}

/**
 * 删除权限
 */
export const deletePermission = async (id: number): Promise<ApiResponse> => {
  await delay(300)

  try {
    const permissionIndex = mockPermissions.findIndex((permission) => permission.id === id)

    if (permissionIndex === -1) {
      return {
        success: false,
        data: null,
        message: '权限不存在',
        code: 404,
      }
    }

    mockPermissions.splice(permissionIndex, 1)

    return {
      success: true,
      data: null,
      message: '删除成功',
      code: 200,
    }
  } catch (error) {
    console.error('删除权限失败:', error)
    return {
      success: false,
      data: null,
      message: '删除失败',
      code: 500,
    }
  }
}

/**
 * 批量删除权限
 */
export const batchDeletePermissions = async (ids: number[]): Promise<ApiResponse> => {
  await delay(500)

  try {
    let deletedCount = 0
    const errors: string[] = []

    for (const id of ids) {
      const permissionIndex = mockPermissions.findIndex((permission) => permission.id === id)

      if (permissionIndex !== -1) {
        mockPermissions.splice(permissionIndex, 1)
        deletedCount++
      }
    }

    if (deletedCount === 0) {
      return {
        success: false,
        data: null,
        message: '没有找到要删除的权限',
        code: 404,
      }
    }

    const message =
      errors.length > 0
        ? `成功删除 ${deletedCount} 个权限。${errors.join('; ')}`
        : `成功删除 ${deletedCount} 个权限`

    return {
      success: true,
      data: null,
      message,
      code: 200,
    }
  } catch (error) {
    console.error('批量删除权限失败:', error)
    return {
      success: false,
      data: null,
      message: '批量删除失败',
      code: 500,
    }
  }
}

/**
 * 获取权限选项列表（用于下拉选择）
 */
export const getPermissionOptions = async (): Promise<
  ApiResponse<Array<{ label: string; value: number }>>
> => {
  await delay(200)

  try {
    const options = mockPermissions
      .filter((permission) => permission.status === PermissionStatus.ACTIVE)
      .map((permission) => ({
        label: `${permission.name} (${permission.code})`,
        value: permission.id,
      }))

    return {
      success: true,
      data: options,
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取权限选项失败:', error)
    return {
      success: false,
      data: [],
      message: '获取失败',
      code: 500,
    }
  }
}
