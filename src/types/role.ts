/**
 * 角色管理相关类型定义
 */

// 通用API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
}

// 角色状态枚举
export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// 权限枚举
export enum Permission {
  USER_MANAGE = 'user:manage',
  USER_VIEW = 'user:view',
  ROLE_MANAGE = 'role:manage',
  CONTENT_EDIT = 'content:edit',
  CONTENT_VIEW = 'content:view',
  SYSTEM_CONFIG = 'system:config',
  DATA_EXPORT = 'data:export',
}

// 权限显示名称映射
export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.USER_MANAGE]: '用户管理',
  [Permission.USER_VIEW]: '用户查看',
  [Permission.ROLE_MANAGE]: '角色管理',
  [Permission.CONTENT_EDIT]: '内容编辑',
  [Permission.CONTENT_VIEW]: '内容查看',
  [Permission.SYSTEM_CONFIG]: '系统配置',
  [Permission.DATA_EXPORT]: '数据导出',
}

// 角色基础信息接口
export interface Role {
  id: number
  name: string
  description?: string
  permissions: Permission[]
  status: RoleStatus
  createdAt: string
  updatedAt?: string
  userCount?: number // 关联用户数量
}

// 角色创建数据接口（不包含 id 和时间戳）
export type RoleCreateData = Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>

// 角色更新数据接口（部分字段可选）
export type RoleUpdateData = Partial<RoleCreateData>

// 角色搜索表单接口
export interface RoleSearchForm {
  keyword: string // 角色名称或描述关键词
  status: string // 角色状态筛选
  permission?: string // 权限筛选
  startDate?: string // 创建开始日期
  endDate?: string // 创建结束日期
  minUserCount?: number // 最小用户数量
  maxUserCount?: number // 最大用户数量
}

// 角色表单数据接口（用于编辑对话框）
export interface RoleFormData {
  name: string
  description?: string
  permissions: Permission[]
  status: RoleStatus
}

// 角色列表响应接口
export interface RoleListResponse {
  roles: Role[]
  total: number
}

// 角色选项接口（用于下拉选择）
export interface RoleOption {
  label: string
  value: number
  description?: string
}

// 状态选项接口
export interface RoleStatusOption {
  label: string
  value: RoleStatus
  type?: 'success' | 'info' | 'warning' | 'danger' // Element Plus Tag 类型
}

// 权限选项接口
export interface PermissionOption {
  label: string
  value: Permission
  description?: string
  category?: string // 权限分类
}

// 权限分组接口
export interface PermissionGroup {
  category: string
  label: string
  permissions: PermissionOption[]
}

// API 请求参数接口
export interface RoleFetchParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  permission?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 表格操作按钮接口
export interface TableAction {
  label: string
  value: string
  icon?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  disabled?: boolean
}
