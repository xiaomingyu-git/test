// CRUD 页面相关类型定义

export interface User {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 角色 */
  role: 'admin' | 'user' | 'editor'
  /** 状态 */
  status: 'active' | 'inactive' | 'banned'
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

export interface UserFormData {
  /** 用户ID (编辑时需要) */
  id?: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 角色 */
  role: 'admin' | 'user' | 'editor'
  /** 状态 */
  status: 'active' | 'inactive' | 'banned'
  /** 密码 (新增时需要) */
  password?: string
  /** 确认密码 */
  confirmPassword?: string
}

export interface SearchForm {
  /** 搜索关键词 */
  keyword: string
  /** 角色筛选 */
  role: '' | 'admin' | 'user' | 'editor'
  /** 状态筛选 */
  status: '' | 'active' | 'inactive' | 'banned'
}

export interface Pagination {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
}

export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean
  /** 数据 */
  data: T
  /** 消息 */
  message: string
  /** 代码 */
  code: number
}

export interface TableResponse {
  /** 用户列表 */
  list: User[]
  /** 分页信息 */
  pagination: Pagination
}

export interface CrudAction {
  /** 操作类型 */
  type: 'create' | 'edit' | 'delete' | 'batchDelete'
  /** 数据 */
  data?: any
  /** 行数据 */
  row?: User
}

// 表格列配置
export interface TableColumn {
  /** 列属性 */
  prop: string
  /** 列标题 */
  label: string
  /** 宽度 */
  width?: number
  /** 最小宽度 */
  minWidth?: number
  /** 是否固定 */
  fixed?: boolean | 'left' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 格式化函数 */
  formatter?: (row: User, column: any, cellValue: any, index: number) => string
}

// 表单验证规则
export interface FormRule {
  /** 字段 */
  field: string
  /** 规则 */
  rules: Array<{
    required?: boolean
    message: string
    trigger?: 'blur' | 'change'
    pattern?: RegExp
    min?: number
    max?: number
    validator?: (rule: any, value: any, callback: (error?: string | Error) => void) => void
  }>
}