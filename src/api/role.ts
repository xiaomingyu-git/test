import type {
  Role,
  RoleFormData,
  RoleListResponse,
  RoleFetchParams,
  ApiResponse,
} from '@/types/role'
import { RoleStatus, Permission, PERMISSION_LABELS } from '@/types/role'

// 模拟 API 延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限的超级管理员角色',
    permissions: [
      Permission.USER_MANAGE,
      Permission.USER_VIEW,
      Permission.ROLE_MANAGE,
      Permission.CONTENT_EDIT,
      Permission.CONTENT_VIEW,
      Permission.SYSTEM_CONFIG,
      Permission.DATA_EXPORT,
    ],
    status: RoleStatus.ACTIVE,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
    userCount: 1,
  },
  {
    id: 2,
    name: '内容编辑',
    description: '负责内容编辑和发布的编辑人员',
    permissions: [Permission.CONTENT_EDIT, Permission.CONTENT_VIEW, Permission.USER_VIEW],
    status: RoleStatus.ACTIVE,
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00',
    userCount: 5,
  },
  {
    id: 3,
    name: '普通用户',
    description: '系统普通用户，只能查看内容',
    permissions: [Permission.CONTENT_VIEW, Permission.USER_VIEW],
    status: RoleStatus.ACTIVE,
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00',
    userCount: 15,
  },
  {
    id: 4,
    name: '访客',
    description: '只能查看公开内容的访客角色',
    permissions: [Permission.CONTENT_VIEW],
    status: RoleStatus.INACTIVE,
    createdAt: '2024-01-04 10:00:00',
    updatedAt: '2024-01-04 10:00:00',
    userCount: 0,
  },
  {
    id: 5,
    name: '审核员',
    description: '负责内容审核的工作人员',
    permissions: [
      Permission.CONTENT_VIEW,
      Permission.CONTENT_EDIT,
      Permission.USER_VIEW,
      Permission.DATA_EXPORT,
    ],
    status: RoleStatus.ACTIVE,
    createdAt: '2024-01-05 10:00:00',
    updatedAt: '2024-01-05 10:00:00',
    userCount: 3,
  },
]

// 生成更多模拟数据
for (let i = 6; i <= 20; i++) {
  const statuses: RoleStatus[] = [RoleStatus.ACTIVE, RoleStatus.INACTIVE]
  const permissionSets = [
    [Permission.CONTENT_VIEW],
    [Permission.CONTENT_VIEW, Permission.USER_VIEW],
    [Permission.CONTENT_EDIT, Permission.CONTENT_VIEW, Permission.USER_VIEW],
    [Permission.USER_MANAGE, Permission.USER_VIEW, Permission.ROLE_MANAGE],
    [
      Permission.CONTENT_EDIT,
      Permission.CONTENT_VIEW,
      Permission.DATA_EXPORT,
      Permission.USER_VIEW,
    ],
  ]

  mockRoles.push({
    id: i,
    name: `角色${i.toString().padStart(3, '0')}`,
    description: `这是角色${i}的描述信息`,
    permissions: permissionSets[i % permissionSets.length]!,
    status: statuses[i % 2]!,
    createdAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
    updatedAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
    userCount: Math.floor(Math.random() * 20),
  })
}

/**
 * 获取角色列表
 */
export const getRoleList = async (
  params: RoleFetchParams,
): Promise<ApiResponse<RoleListResponse>> => {
  await delay(500) // 模拟网络延迟

  try {
    let filteredRoles = [...mockRoles]

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(keyword) ||
          (role.description && role.description.toLowerCase().includes(keyword)),
      )
    }

    // 状态筛选
    if (params.status) {
      filteredRoles = filteredRoles.filter((role) => role.status === params.status)
    }

    // 权限筛选
    if (params.permission) {
      filteredRoles = filteredRoles.filter((role) =>
        role.permissions.includes(params.permission as Permission),
      )
    }

    // 排序
    const sortBy = params.sortBy || 'createdAt'
    const sortOrder = params.sortOrder || 'desc'

    filteredRoles.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Role] || ''
      let bValue: any = b[sortBy as keyof Role] || ''

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
    const total = filteredRoles.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const roles = filteredRoles.slice(start, end)

    return {
      success: true,
      data: {
        roles,
        total,
      },
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return {
      success: false,
      data: { roles: [], total: 0 },
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 根据ID获取角色详情
 */
export const getRoleById = async (id: number): Promise<ApiResponse<Role>> => {
  await delay(200)

  try {
    const role = mockRoles.find((role) => role.id === id)

    if (!role) {
      return {
        success: false,
        data: null as any,
        message: '角色不存在',
        code: 404,
      }
    }

    return {
      success: true,
      data: role,
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    return {
      success: false,
      data: null as any,
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 创建角色
 */
export const createRole = async (roleData: RoleFormData): Promise<ApiResponse<Role>> => {
  await delay(300)

  try {
    // 检查角色名称是否已存在
    if (mockRoles.some((role) => role.name === roleData.name)) {
      return {
        success: false,
        data: null as any,
        message: '角色名称已存在',
        code: 400,
      }
    }

    const newRole: Role = {
      id: Math.max(...mockRoles.map((r) => r.id)) + 1,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      status: roleData.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userCount: 0,
    }

    mockRoles.push(newRole)

    return {
      success: true,
      data: newRole,
      message: '创建成功',
      code: 200,
    }
  } catch (error) {
    console.error('创建角色失败:', error)
    return {
      success: false,
      data: null as any,
      message: '创建失败',
      code: 500,
    }
  }
}

/**
 * 更新角色
 */
export const updateRole = async (
  id: number,
  roleData: RoleFormData,
): Promise<ApiResponse<Role>> => {
  await delay(300)

  try {
    const roleIndex = mockRoles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: '角色不存在',
        code: 404,
      }
    }

    // 检查角色名称是否已被其他角色使用
    if (mockRoles.some((role) => role.name === roleData.name && role.id !== id)) {
      return {
        success: false,
        data: null as any,
        message: '角色名称已存在',
        code: 400,
      }
    }

    const currentRole = mockRoles[roleIndex]

    const updatedRole: Role = {
      id: currentRole!.id,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      status: roleData.status,
      createdAt: currentRole!.createdAt,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userCount: currentRole!.userCount,
    }

    mockRoles[roleIndex] = updatedRole

    return {
      success: true,
      data: updatedRole,
      message: '更新成功',
      code: 200,
    }
  } catch (error) {
    console.error('更新角色失败:', error)
    return {
      success: false,
      data: null as any,
      message: '更新失败',
      code: 500,
    }
  }
}

/**
 * 删除角色
 */
export const deleteRole = async (id: number): Promise<ApiResponse> => {
  await delay(300)

  try {
    const roleIndex = mockRoles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      return {
        success: false,
        data: null,
        message: '角色不存在',
        code: 404,
      }
    }

    const role = mockRoles[roleIndex]

    // 检查角色下是否有关联用户
    if (role!.userCount && role!.userCount > 0) {
      return {
        success: false,
        data: null,
        message: '该角色下还有用户，无法删除',
        code: 400,
      }
    }

    mockRoles.splice(roleIndex, 1)

    return {
      success: true,
      data: null,
      message: '删除成功',
      code: 200,
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    return {
      success: false,
      data: null,
      message: '删除失败',
      code: 500,
    }
  }
}

/**
 * 批量删除角色
 */
export const batchDeleteRoles = async (ids: number[]): Promise<ApiResponse> => {
  await delay(500)

  try {
    let deletedCount = 0
    const errors: string[] = []

    for (const id of ids) {
      const roleIndex = mockRoles.findIndex((role) => role.id === id)

      if (roleIndex !== -1) {
        const role = mockRoles[roleIndex]

        // 检查角色下是否有关联用户
        if (role!.userCount && role!.userCount > 0) {
          errors.push(`角色 "${role!.name}" 下还有用户，无法删除`)
          continue
        }

        mockRoles.splice(roleIndex, 1)
        deletedCount++
      }
    }

    if (deletedCount === 0) {
      return {
        success: false,
        data: null,
        message: errors.join('; ') || '没有找到要删除的角色',
        code: 400,
      }
    }

    const message =
      errors.length > 0
        ? `成功删除 ${deletedCount} 个角色。${errors.join('; ')}`
        : `成功删除 ${deletedCount} 个角色`

    return {
      success: true,
      data: null,
      message,
      code: 200,
    }
  } catch (error) {
    console.error('批量删除角色失败:', error)
    return {
      success: false,
      data: null,
      message: '批量删除失败',
      code: 500,
    }
  }
}

/**
 * 获取角色选项列表（用于下拉选择）
 */
export const getRoleOptions = async (): Promise<
  ApiResponse<Array<{ label: string; value: number }>>
> => {
  await delay(200)

  try {
    const options = mockRoles
      .filter((role) => role.status === 'active')
      .map((role) => ({
        label: role.name,
        value: role.id,
      }))

    return {
      success: true,
      data: options,
      message: '获取成功',
      code: 200,
    }
  } catch (error) {
    console.error('获取角色选项失败:', error)
    return {
      success: false,
      data: [],
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 获取权限选项列表
 */
export const getPermissionOptions = async (): Promise<
  ApiResponse<Array<{ label: string; value: string; category?: string }>>
> => {
  await delay(200)

  try {
    const options = Object.entries(PERMISSION_LABELS).map(([value, label]) => ({
      value,
      label,
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
