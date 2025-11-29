/**
 * 权限管理相关类型定义
 */

// 权限状态枚举
export enum PermissionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// 权限类型枚举
export enum PermissionType {
  MENU = 'menu', // 菜单权限
  BUTTON = 'button', // 按钮权限
  API = 'api', // API权限
}

// 权限模块枚举
export enum PermissionModule {
  USER_MANAGE = 'user_manage', // 用户管理
  ROLE_MANAGE = 'role_manage', // 角色管理
  SYSTEM_CONFIG = 'system_config', // 系统配置
  CONTENT_MANAGE = 'content_manage', // 内容管理
  DATA_EXPORT = 'data_export', // 数据导出
  LOG_VIEW = 'log_view', // 日志查看
}

// 权限状态显示名称映射
export const PERMISSION_STATUS_LABELS: Record<PermissionStatus, string> = {
  [PermissionStatus.ACTIVE]: '启用',
  [PermissionStatus.INACTIVE]: '禁用',
}

// 权限类型显示名称映射
export const PERMISSION_TYPE_LABELS: Record<PermissionType, string> = {
  [PermissionType.MENU]: '菜单权限',
  [PermissionType.BUTTON]: '按钮权限',
  [PermissionType.API]: 'API权限',
}

// 权限模块显示名称映射
export const PERMISSION_MODULE_LABELS: Record<PermissionModule, string> = {
  [PermissionModule.USER_MANAGE]: '用户管理',
  [PermissionModule.ROLE_MANAGE]: '角色管理',
  [PermissionModule.SYSTEM_CONFIG]: '系统配置',
  [PermissionModule.CONTENT_MANAGE]: '内容管理',
  [PermissionModule.DATA_EXPORT]: '数据导出',
  [PermissionModule.LOG_VIEW]: '日志查看',
}

// 权限基础信息接口
export interface Permission {
  id: number
  name: string // 权限名称
  code: string // 权限编码
  description?: string // 权限描述
  type: PermissionType // 权限类型
  module: PermissionModule // 所属模块
  status: PermissionStatus // 状态
  createdAt: string // 创建时间
  updatedAt?: string // 更新时间
}

// 权限创建数据接口（不包含 id 和时间戳）
export type PermissionCreateData = Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>

// 权限更新数据接口（部分字段可选）
export type PermissionUpdateData = Partial<PermissionCreateData>

// 权限搜索表单接口
export interface PermissionSearchForm {
  keyword: string // 权限名称或编码关键词
  type?: string // 权限类型筛选
  module?: string // 权限模块筛选
  status?: string // 权限状态筛选
}

// 权限表单数据接口（用于编辑对话框）
export interface PermissionFormData {
  name: string
  code: string
  description?: string
  type: PermissionType
  module: PermissionModule
  status: PermissionStatus
}

// 权限列表响应接口
export interface PermissionListResponse {
  permissions: Permission[]
  total: number
}

// 权限选项接口（用于下拉选择）
export interface PermissionOption {
  label: string
  value: number
  description?: string
}

// 权限类型选项接口
export interface PermissionTypeOption {
  label: string
  value: PermissionType
  description?: string
  type?: 'primary' | 'success' | 'warning' | 'info' | 'danger' // Element Plus Tag 类型
}

// 权限模块选项接口
export interface PermissionModuleOption {
  label: string
  value: PermissionModule
  description?: string
  icon?: string // 图标名称
}

// API 请求参数接口
export interface PermissionFetchParams {
  page: number
  pageSize: number
  keyword?: string
  type?: string
  module?: string
  status?: string
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

// API 响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  code: number
}
