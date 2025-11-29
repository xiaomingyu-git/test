/**
 * 用户管理逻辑复用 Composable
 */

import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type {
  User,
  UserCreateData,
  UserUpdateData,
  SearchForm,
  FormData,
  Pagination,
  FetchParams,
  ApiResponse,
  UserListResponse,
  EditMode,
  TagType
} from '@/types/user'
import { UserRole, UserStatus } from '@/types/user'

// 默认分页大小
const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// 用户角色选项
const USER_ROLE_OPTIONS = [
  { label: '管理员', value: UserRole.ADMIN },
  { label: '编辑者', value: UserRole.EDITOR },
  { label: '普通用户', value: UserRole.USER }
]

// 用户状态选项
const USER_STATUS_OPTIONS = [
  { label: '正常', value: UserStatus.ACTIVE },
  { label: '禁用', value: UserStatus.INACTIVE },
  { label: '封禁', value: UserStatus.BANNED }
]

// 用户角色映射
const USER_ROLE_MAP: Record<UserRole, string> = {
  admin: '管理员',
  editor: '编辑者',
  user: '普通用户'
}

// 用户状态映射
const USER_STATUS_MAP: Record<UserStatus, string> = {
  active: '正常',
  inactive: '禁用',
  banned: '封禁'
}

export function useUserManagement() {
  // ==================== 响应式状态 ====================
  const loading = ref(false)
  const submitting = ref(false)
  const isProcessing = ref(false)
  const tableData = ref<User[]>([])
  const selectedRows = ref<User[]>([])
  const dialogVisible = ref(false)
  const editMode = ref<EditMode>('create')

  const searchForm = ref<SearchForm>({
    keyword: '',
    role: '',
    status: ''
  })

  const pagination = reactive<Pagination>({
    current: 1,
    size: DEFAULT_PAGE_SIZE,
    total: 0
  })

  const formData = ref<FormData>({
    username: '',
    email: '',
    phone: '',
    role: '',
    status: 'active'
  })

  // 表单引用
  const searchFormRef = ref<FormInstance>()
  const formRef = ref<FormInstance>()

  // ==================== 计算属性 ====================
  const hasSelectedRows = computed(() => selectedRows.value.length > 0)
  const isCreateMode = computed(() => editMode.value === 'create')
  const dialogTitle = computed(() => isCreateMode.value ? '新增用户' : '编辑用户')

  // ==================== 工具函数 ====================
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleText = (role: UserRole): string => {
    return USER_ROLE_MAP[role] || role
  }

  const getRoleTagType = (role: UserRole): TagType => {
    const typeMap: Record<UserRole, TagType> = {
      admin: 'danger',
      editor: 'warning',
      user: 'info'
    }
    return typeMap[role] || 'info'
  }

  const getStatusText = (status: UserStatus): string => {
    return USER_STATUS_MAP[status] || status
  }

  const getStatusTagType = (status: UserStatus): TagType => {
    const typeMap: Record<UserStatus, TagType> = {
      active: 'success',
      inactive: 'warning',
      banned: 'danger'
    }
    return typeMap[status] || 'info'
  }

  const showSuccess = (message: string): void => {
    ElMessage.success(message)
  }

  const showError = (message: string): void => {
    ElMessage.error(message)
  }

  const showWarning = (message: string): void => {
    ElMessage.warning(message)
  }

  const showConfirm = async (message: string, title = '确认操作'): Promise<boolean> => {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      return true
    } catch {
      return false
    }
  }

  // ==================== API 模拟 ====================
  const mockApiCall = async <T>(data: T, delay = 1000): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay)
    })
  }

  const fetchUsers = async (params: FetchParams): Promise<ApiResponse<UserListResponse>> => {
    await mockApiCall(null, 800)

    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        phone: '13800138001',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-01T10:00:00'
      },
      {
        id: 2,
        username: 'editor001',
        email: 'editor001@example.com',
        phone: '13800138002',
        role: UserRole.EDITOR,
        status: UserStatus.ACTIVE,
        createdAt: '2024-01-02T10:00:00'
      },
      {
        id: 3,
        username: 'user001',
        email: 'user001@example.com',
        phone: '13800138003',
        role: UserRole.USER,
        status: UserStatus.INACTIVE,
        createdAt: '2024-01-03T10:00:00'
      },
      {
        id: 4,
        username: 'user002',
        email: 'user002@example.com',
        phone: '13800138004',
        role: UserRole.USER,
        status: UserStatus.BANNED,
        createdAt: '2024-01-04T10:00:00'
      }
    ]

    // 模拟搜索过滤
    let filteredUsers = mockUsers
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword)
      )
    }

    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role)
    }

    if (params.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status)
    }

    // 模拟排序
    if (params.sortBy && params.sortOrder) {
      filteredUsers.sort((a, b) => {
        const aValue = a[params.sortBy as keyof User]
        const bValue = b[params.sortBy as keyof User]
        const order = params.sortOrder === 'asc' ? 1 : -1
        return aValue > bValue ? order : -order
      })
    }

    const total = filteredUsers.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const paginatedUsers = filteredUsers.slice(start, end)

    return {
      code: 200,
      data: { users: paginatedUsers, total },
      message: 'success'
    }
  }

  const createUser = async (userData: UserCreateData): Promise<ApiResponse<User>> => {
    await mockApiCall(null, 1000)

    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }

    return {
      code: 200,
      data: newUser,
      message: '用户创建成功'
    }
  }

  const updateUser = async (id: number, userData: UserUpdateData): Promise<ApiResponse<User>> => {
    await mockApiCall(null, 800)

    const existingUser = tableData.value.find(user => user.id === id)
    if (!existingUser) {
      return {
        code: 404,
        data: null as any,
        message: '用户不存在'
      }
    }

    const updatedUser = { ...existingUser, ...userData }
    return {
      code: 200,
      data: updatedUser,
      message: '用户更新成功'
    }
  }

  // ==================== 业务方法 ====================
  const fetchData = async (): Promise<void> => {
    loading.value = true
    try {
      const params: FetchParams = {
        page: pagination.current,
        pageSize: pagination.size,
        keyword: searchForm.value.keyword || undefined,
        role: searchForm.value.role || undefined,
        status: searchForm.value.status || undefined
      }

      const response = await fetchUsers(params)

      if (response.code === 200) {
        tableData.value = response.data.users
        pagination.total = response.data.total
      } else {
        showError(response.message || '获取数据失败')
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      showError('获取数据失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  const handleSearch = async (): Promise<void> => {
    pagination.current = 1
    await fetchData()
  }

  const handleReset = (): void => {
    searchForm.value = {
      keyword: '',
      role: '',
      status: ''
    }
    handleSearch()
  }

  const handleSortChange = ({ prop, order }: { prop: string; order: string | null }): void => {
    if (!prop) return

    const sortOrder = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : undefined

    // 更新搜索参数并重新获取数据
    Object.assign(searchForm, { sortBy: prop, sortOrder })
    handleSearch()
  }

  const handleSelectionChange = (rows: User[]): void => {
    selectedRows.value = rows
  }

  const clearSelection = (): void => {
    selectedRows.value = []
  }

  const handleSizeChange = (size: number): void => {
    pagination.size = size
    pagination.current = 1
    handleSearch()
  }

  const handleCurrentChange = (current: number): void => {
    pagination.current = current
    handleSearch()
  }

  const handleCreate = (): void => {
    editMode.value = 'create'
    formData.value = {
      username: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      password: '',
      confirmPassword: ''
    }
    dialogVisible.value = true
    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }

  const handleEdit = (row: User): void => {
    editMode.value = 'edit'
    formData.value = {
      username: row.username,
      email: row.email,
      phone: row.phone,
      role: row.role,
      status: row.status
    }
    dialogVisible.value = true
    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }

  const handleDelete = async (row: User): Promise<void> => {
    const confirmed = await showConfirm(`确定要删除用户 "${row.username}" 吗？此操作不可撤销`)
    if (confirmed) {
      isProcessing.value = true
      try {
        await mockApiCall(null, 500)

        const index = tableData.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          tableData.value.splice(index, 1)
          pagination.total = Math.max(0, pagination.total - 1)
          showSuccess(`用户 "${row.username}" 已删除`)
        }
      } catch (error) {
        console.error('删除失败:', error)
        showError('删除失败，请重试')
      } finally {
        isProcessing.value = false
      }
    }
  }

  const handleBatchDelete = async (): Promise<void> => {
    if (!hasSelectedRows.value) return

    const confirmed = await showConfirm(
      `确定要删除选中的 ${selectedRows.value.length} 个用户吗？此操作不可撤销`,
      '批量删除'
    )
    if (confirmed) {
      isProcessing.value = true
      try {
        await mockApiCall(null, 800)

        const deleteIds = selectedRows.value.map(row => row.id)
        const deletedCount = deleteIds.length
        tableData.value = tableData.value.filter(item => !deleteIds.includes(item.id))
        selectedRows.value = []
        pagination.total = Math.max(0, pagination.total - deletedCount)
        showSuccess(`成功删除 ${deletedCount} 个用户`)
      } catch (error) {
        console.error('批量删除失败:', error)
        showError('批量删除失败，请重试')
      } finally {
        isProcessing.value = false
      }
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      submitting.value = true

      if (isCreateMode.value) {
        const userData: UserCreateData = {
          username: formData.value.username,
          email: formData.value.email,
          phone: formData.value.phone,
          role: formData.value.role as UserRole,
          status: formData.value.status as UserStatus
        }

        const response = await createUser(userData)
        if (response.code === 200) {
          showSuccess('用户创建成功')
          dialogVisible.value = false
          await fetchData()
        } else {
          showError(response.message || '创建失败')
        }
      } else {
        // 编辑模式需要获取当前编辑的用户ID
        const editingUser = tableData.value.find(user =>
          user.username === formData.value.username &&
          user.email === formData.value.email
        )

        if (editingUser) {
          const userData: UserUpdateData = {
            username: formData.value.username,
            email: formData.value.email,
            phone: formData.value.phone,
            role: formData.value.role as UserRole,
            status: formData.value.status as UserStatus
          }

          const response = await updateUser(editingUser.id, userData)
          if (response.code === 200) {
            showSuccess('用户更新成功')
            dialogVisible.value = false
            await fetchData()
          } else {
            showError(response.message || '更新失败')
          }
        }
      }
    } catch (error: any) {
      console.error('提交失败:', error)
      if (error.message?.includes('validation')) {
        showWarning('请检查表单填写是否正确')
      } else {
        showError(isCreateMode.value ? '创建失败，请重试' : '更新失败，请重试')
      }
    } finally {
      submitting.value = false
    }
  }

  const handleCancel = () => {
    dialogVisible.value = false
    formRef.value?.clearValidate()
  }

  const handleDialogClose = (done: () => void) => {
    if (submitting.value || isProcessing.value) {
      return
    }
    done()
  }

  // ==================== 返回接口 ====================
  return {
    // 响应式状态
    loading,
    submitting,
    isProcessing,
    tableData,
    selectedRows,
    dialogVisible,
    editMode,
    searchForm,
    pagination,
    formData,
    searchFormRef,
    formRef,

    // 计算属性
    hasSelectedRows,
    isCreateMode,
    dialogTitle,

    // 常量
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    USER_ROLE_OPTIONS,
    USER_STATUS_OPTIONS,

    // 工具函数
    formatDate,
    getRoleText,
    getRoleTagType,
    getStatusText,
    getStatusTagType,
    showSuccess,
    showError,
    showWarning,
    showConfirm,

    // 业务方法
    fetchData,
    handleSearch,
    handleReset,
    handleSortChange,
    handleSelectionChange,
    clearSelection,
    handleSizeChange,
    handleCurrentChange,
    handleCreate,
    handleEdit,
    handleDelete,
    handleBatchDelete,
    handleSubmit,
    handleCancel,
    handleDialogClose
  }
}