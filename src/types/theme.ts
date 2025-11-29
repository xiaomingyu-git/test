import type { ThemeMode } from './common'

// 主题相关类型定义

export interface ThemeConfig {
  /** 主题模式 */
  mode: ThemeMode
  /** 主题色彩 */
  colors?: ThemeColors
  /** 自定义CSS变量 */
  cssVars?: Record<string, string>
}

export interface ThemeColors {
  /** 主色 */
  primary: string
  /** 成功色 */
  success: string
  /** 警告色 */
  warning: string
  /** 危险色 */
  danger: string
  /** 信息色 */
  info: string
  /** 文本色 */
  text: {
    primary: string
    secondary: string
    placeholder: string
    disabled: string
  }
  /** 背景色 */
  background: {
    primary: string
    secondary: string
    disabled: string
  }
  /** 边框色 */
  border: {
    primary: string
    secondary: string
    light: string
    lighter: string
  }
}

export interface ThemeState {
  /** 当前主题模式 */
  currentMode: ThemeMode
  /** 是否为深色主题 */
  isDark: boolean
  /** 系统主题偏好 */
  systemPrefersDark: boolean
  /** 主题配置 */
  config: ThemeConfig
}

export interface ThemeStorage {
  /** 存储的主题模式 */
  mode?: ThemeMode
  /** 存储的时间戳 */
  timestamp?: number
  /** 用户自定义配置 */
  customConfig?: Partial<ThemeConfig>
}