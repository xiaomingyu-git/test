/**
 * 用户相关类型定义
 */

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

// 排序顺序枚举
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// 用户基础信息接口
export interface User {
  id: number
  username: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

// 用户创建数据接口（不包含 id 和 createdAt）
export type UserCreateData = Omit<User, 'id' | 'createdAt'>

// 用户更新数据接口（部分字段可选）
export type UserUpdateData = Partial<UserCreateData>

// 搜索表单接口
export interface SearchForm {
  keyword: string
  role: string
  status: string
}

// 表单数据接口（包含密码字段）
export interface FormData {
  username: string
  email: string
  phone: string
  role: string
  status: string
  password?: string
  confirmPassword?: string
}

// 分页接口
export interface Pagination {
  current: number
  size: number
  total: number
}

// API 请求参数接口
export interface FetchParams {
  page: number
  pageSize: number
  keyword?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: SortOrder
}

// API 响应接口
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

// 用户列表响应接口
export interface UserListResponse {
  users: User[]
  total: number
}

// 角色选项接口
export interface RoleOption {
  label: string
  value: UserRole
}

// 状态选项接口
export interface StatusOption {
  label: string
  value: UserStatus
}

// 表格排序配置接口
export interface SortConfig {
  prop?: string
  order?: SortOrder
}

// 表单验证规则接口
export interface FormValidationRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  type?: string
  pattern?: RegExp
  validator?: (rule: any, value: any, callback: (error?: string | Error) => void) => void
}

// 编辑模式类型
export type EditMode = 'create' | 'edit'

// 标签类型映射
export type TagType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
