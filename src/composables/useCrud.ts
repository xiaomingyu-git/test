import { ref, reactive, nextTick } from 'vue'
import type { User, UserFormData, SearchForm, Pagination } from '@/types/crud'
import { getUserList, createUser, updateUser, deleteUser, batchDeleteUsers } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

export function useCrud() {
  // 表格数据
  const tableData = ref<User[]>([])

  // 加载状态
  const loading = ref(false)

  // 搜索表单
  const searchForm = reactive<SearchForm>({
    keyword: '',
    role: '',
    status: '',
  })

  // 分页信息
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 选中的行
  const selectedRows = ref<User[]>([])

  // 弹窗显示状态
  const dialogVisible = ref(false)

  // 编辑模式
  const editMode = ref<'create' | 'edit'>('create')

  // 编辑表单数据
  const editForm = reactive<UserFormData>({
    username: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    password: '',
    confirmPassword: '',
  })

  // 表单引用
  const formRef = ref()

  // 表单验证规则
  const formRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    password: [
      {
        validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
          if (editMode.value === 'create' && !value) {
            callback(new Error('请输入密码'))
          } else if (value && (value.length < 6 || value.length > 20)) {
            callback(new Error('密码长度在 6 到 20 个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
          if (editMode.value === 'create' && !value) {
            callback(new Error('请确认密码'))
          } else if (value && value !== editForm.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
  }

  // 获取数据
  const fetchData = async () => {
    loading.value = true
    try {
      const response = await getUserList(searchForm, {
        current: pagination.current,
        pageSize: pagination.pageSize,
      })

      if (response.success) {
        tableData.value = response.data.list
        pagination.total = response.data.pagination.total
      } else {
        ElMessage.error(response.message)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      ElMessage.error('获取数据失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.current = 1
    fetchData()
  }

  // 重置搜索
  const handleReset = () => {
    Object.assign(searchForm, {
      keyword: '',
      role: '',
      status: '',
    })
    pagination.current = 1
    fetchData()
  }

  // 分页大小改变
  const handleSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.current = 1
    fetchData()
  }

  // 当前页改变
  const handleCurrentChange = (current: number) => {
    pagination.current = current
    fetchData()
  }

  // 表格选择改变
  const handleSelectionChange = (selection: User[]) => {
    selectedRows.value = selection
  }

  // 打开新增弹窗
  const handleCreate = () => {
    editMode.value = 'create'
    Object.assign(editForm, {
      username: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      password: '',
      confirmPassword: '',
    })
    dialogVisible.value = true

    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }

  // 打开编辑弹窗
  const handleEdit = (row: User) => {
    editMode.value = 'edit'
    Object.assign(editForm, {
      id: row.id,
      username: row.username,
      email: row.email,
      phone: row.phone,
      role: row.role,
      status: row.status,
      password: '',
      confirmPassword: '',
    })
    dialogVisible.value = true

    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }

  // 删除单个用户
  const handleDelete = async (row: User) => {
    try {
      await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const response = await deleteUser(row.id)

      if (response.success) {
        ElMessage.success(response.message)
        fetchData()
      } else {
        ElMessage.error(response.message)
      }
    } catch {
      // 用户取消删除
      console.log('用户取消删除')
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请选择要删除的用户')
      return
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
        '批量删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )

      const ids = selectedRows.value.map((row) => row.id)
      const response = await batchDeleteUsers(ids)

      if (response.success) {
        ElMessage.success(response.message)
        selectedRows.value = []
        fetchData()
      } else {
        ElMessage.error(response.message)
      }
    } catch {
      // 用户取消删除
      console.log('用户取消批量删除')
    }
  }

  // 保存表单
  const handleSave = async () => {
    try {
      await formRef.value?.validate()

      loading.value = true

      let response
      if (editMode.value === 'create') {
        response = await createUser(editForm)
      } else {
        response = await updateUser(editForm.id!, editForm)
      }

      if (response.success) {
        ElMessage.success(response.message)
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(response.message)
      }
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  }

  // 取消编辑
  const handleCancel = () => {
    dialogVisible.value = false
  }

  // 状态标签显示
  const getStatusTag = (status: string) => {
    const statusMap = {
      active: { type: 'success', text: '正常' },
      inactive: { type: 'info', text: '禁用' },
      banned: { type: 'danger', text: '封禁' },
    }
    return statusMap[status as keyof typeof statusMap] || { type: 'info', text: status }
  }

  // 角色标签显示
  const getRoleTag = (role: string) => {
    const roleMap = {
      admin: { type: 'danger', text: '管理员' },
      editor: { type: 'warning', text: '编辑者' },
      user: { type: 'primary', text: '普通用户' },
    }
    return roleMap[role as keyof typeof roleMap] || { type: 'info', text: role }
  }

  // 初始化数据
  const init = () => {
    fetchData()
  }

  return {
    // 数据
    tableData,
    loading,
    searchForm,
    pagination,
    selectedRows,
    dialogVisible,
    editMode,
    editForm,
    formRef,
    formRules,

    // 方法
    fetchData,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleCreate,
    handleEdit,
    handleDelete,
    handleBatchDelete,
    handleSave,
    handleCancel,
    getStatusTag,
    getRoleTag,
    init,
  }
}
