import type { User, UserFormData, SearchForm, ApiResponse, TableResponse } from '@/types/crud'

// 模拟 API 延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138001',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'editor001',
    email: 'editor001@example.com',
    phone: '13800138002',
    role: 'editor',
    status: 'active',
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    username: 'user001',
    email: 'user001@example.com',
    phone: '13800138003',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    username: 'user002',
    email: 'user002@example.com',
    phone: '13800138004',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-04 10:00:00',
    updatedAt: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    username: 'editor002',
    email: 'editor002@example.com',
    phone: '13800138005',
    role: 'editor',
    status: 'banned',
    createdAt: '2024-01-05 10:00:00',
    updatedAt: '2024-01-05 10:00:00',
  },
]

// 生成更多模拟数据
for (let i = 6; i <= 50; i++) {
  const roles: ('admin' | 'user' | 'editor')[] = ['admin', 'user', 'editor']
  const statuses: ('active' | 'inactive' | 'banned')[] = ['active', 'inactive', 'banned']

  mockUsers.push({
    id: i,
    username: `user${i.toString().padStart(3, '0')}`,
    email: `user${i.toString().padStart(3, '0')}@example.com`,
    phone: `1380013${i.toString().padStart(4, '0')}`,
    role: roles[i % 3] as 'admin' | 'user' | 'editor',
    status: statuses[i % 3] as 'active' | 'inactive' | 'banned',
    createdAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
    updatedAt: `2024-01-${((i % 28) + 1).toString().padStart(2, '0')} 10:00:00`,
  })
}

/**
 * 获取用户列表
 */
export const getUserList = async (
  searchForm: SearchForm,
  pagination: { current: number; pageSize: number },
): Promise<ApiResponse<TableResponse>> => {
  await delay(500) // 模拟网络延迟

  try {
    let filteredUsers = [...mockUsers]

    // 关键词搜索
    if (searchForm.keyword) {
      const keyword = searchForm.keyword.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.phone.includes(keyword),
      )
    }

    // 角色筛选
    if (searchForm.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === searchForm.role)
    }

    // 状态筛选
    if (searchForm.status) {
      filteredUsers = filteredUsers.filter((user) => user.status === searchForm.status)
    }

    // 计算分页
    const total = filteredUsers.length
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    const list = filteredUsers.slice(start, end)

    return {
      success: true,
      data: {
        list,
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
        },
      },
      message: '获取成功',
      code: 200,
    }
  } catch {
    return {
      success: false,
      data: { list: [], pagination: { current: 1, pageSize: 10, total: 0 } },
      message: '获取失败',
      code: 500,
    }
  }
}

/**
 * 创建用户
 */
export const createUser = async (userData: UserFormData): Promise<ApiResponse<User>> => {
  await delay(300)

  try {
    // 检查用户名是否已存在
    if (mockUsers.some((user) => user.username === userData.username)) {
      return {
        success: false,
        data: null as any,
        message: '用户名已存在',
        code: 400,
      }
    }

    // 检查邮箱是否已存在
    if (mockUsers.some((user) => user.email === userData.email)) {
      return {
        success: false,
        data: null as any,
        message: '邮箱已存在',
        code: 400,
      }
    }

    const newUser: User = {
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }

    mockUsers.push(newUser)

    return {
      success: true,
      data: newUser,
      message: '创建成功',
      code: 200,
    }
  } catch {
    return {
      success: false,
      data: null as any,
      message: '创建失败',
      code: 500,
    }
  }
}

/**
 * 更新用户
 */
export const updateUser = async (
  id: number,
  userData: UserFormData,
): Promise<ApiResponse<User>> => {
  await delay(300)

  try {
    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      return {
        success: false,
        data: null as any,
        message: '用户不存在',
        code: 404,
      }
    }

    // 检查用户名是否已被其他用户使用
    if (mockUsers.some((user) => user.username === userData.username && user.id !== id)) {
      return {
        success: false,
        data: null as any,
        message: '用户名已存在',
        code: 400,
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (mockUsers.some((user) => user.email === userData.email && user.id !== id)) {
      return {
        success: false,
        data: null as any,
        message: '邮箱已存在',
        code: 400,
      }
    }

    const currentUser = mockUsers[userIndex]
    if (!currentUser) {
      return {
        success: false,
        data: null as any,
        message: '用户不存在',
        code: 404,
      }
    }

    const updatedUser: User = {
      ...currentUser,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }

    mockUsers[userIndex] = updatedUser

    return {
      success: true,
      data: updatedUser,
      message: '更新成功',
      code: 200,
    }
  } catch {
    return {
      success: false,
      data: null as any,
      message: '更新失败',
      code: 500,
    }
  }
}

/**
 * 删除用户
 */
export const deleteUser = async (id: number): Promise<ApiResponse> => {
  await delay(300)

  try {
    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      return {
        success: false,
        data: null,
        message: '用户不存在',
        code: 404,
      }
    }

    mockUsers.splice(userIndex, 1)

    return {
      success: true,
      data: null,
      message: '删除成功',
      code: 200,
    }
  } catch {
    return {
      success: false,
      data: null,
      message: '删除失败',
      code: 500,
    }
  }
}

/**
 * 批量删除用户
 */
export const batchDeleteUsers = async (ids: number[]): Promise<ApiResponse> => {
  await delay(500)

  try {
    const deletedCount = ids.reduce((count, id) => {
      const index = mockUsers.findIndex((user) => user.id === id)
      if (index !== -1) {
        mockUsers.splice(index, 1)
        return count + 1
      }
      return count
    }, 0)

    if (deletedCount === 0) {
      return {
        success: false,
        data: null,
        message: '没有找到要删除的用户',
        code: 404,
      }
    }

    return {
      success: true,
      data: null,
      message: `成功删除 ${deletedCount} 个用户`,
      code: 200,
    }
  } catch {
    return {
      success: false,
      data: null,
      message: '批量删除失败',
      code: 500,
    }
  }
}
