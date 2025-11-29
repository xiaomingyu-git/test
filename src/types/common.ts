// 通用类型定义

export interface BaseComponentProps {
  /** 组件类名 */
  class?: string
  /** 组件样式 */
  style?: string | Record<string, any>
}

export interface LoadingState {
  /** 是否加载中 */
  loading: boolean
  /** 加载文本 */
  loadingText?: string
}

export interface ErrorResponse {
  /** 错误码 */
  code: string | number
  /** 错误信息 */
  message: string
  /** 错误详情 */
  details?: any
}

export interface PaginationConfig {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 显示总数 */
  showTotal?: boolean
  /** 显示尺寸切换 */
  showSizeChanger?: boolean
  /** 显示快速跳转 */
  showQuickJumper?: boolean
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
