import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { ThemeMode } from '../types/common'

interface ThemeConfig {
  mode: ThemeMode
  colors?: any
  cssVars?: Record<string, string>
}

export function useTheme(initialMode?: ThemeMode) {
  // 主题状态
  const currentMode: Ref<ThemeMode> = ref(initialMode || 'auto')
  const systemPrefersDark = ref(false)

  // 计算属性
  const isDark = computed(() => {
    if (currentMode.value === 'auto') {
      return systemPrefersDark.value
    }
    return currentMode.value === 'dark'
  })

  const isLight = computed(() => !isDark.value)

  // 初始化主题
  const initializeTheme = (): void => {
    // 从 localStorage 读取保存的主题
    const savedMode = localStorage.getItem('theme') as ThemeMode | null

    if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
      currentMode.value = savedMode
    } else if (initialMode) {
      currentMode.value = initialMode
    }

    // 获取系统主题偏好
    updateSystemThemePreference()

    // 应用主题
    applyTheme()
  }

  // 更新系统主题偏好
  const updateSystemThemePreference = (): void => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches
  }

  // 应用主题到 DOM
  const applyTheme = (): void => {
    const htmlElement = document.documentElement
    const bodyElement = document.body

    if (isDark.value) {
      htmlElement.classList.add('dark')
      htmlElement.setAttribute('data-theme', 'dark')
      bodyElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
      htmlElement.setAttribute('data-theme', 'light')
      bodyElement.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = (mode?: ThemeMode): void => {
    if (mode) {
      currentMode.value = mode
    } else {
      // 在 light 和 dark 之间切换
      currentMode.value = isDark.value ? 'light' : 'dark'
    }

    // 保存到 localStorage
    localStorage.setItem('theme', currentMode.value)

    // 应用主题
    applyTheme()
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode): void => {
    currentMode.value = mode
    localStorage.setItem('theme', mode)
    applyTheme()
  }

  // 监听系统主题变化
  let mediaQuery: MediaQueryList | null = null
  let handleThemeChange: ((e: MediaQueryListEvent) => void) | null = null

  const setupSystemThemeListener = (): void => {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      handleThemeChange = (e: MediaQueryListEvent) => {
        systemPrefersDark.value = e.matches
        if (currentMode.value === 'auto') {
          applyTheme()
        }
      }

      mediaQuery.addEventListener('change', handleThemeChange)
    }
  }

  const removeSystemThemeListener = (): void => {
    if (mediaQuery && handleThemeChange) {
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }

  // 获取当前主题配置
  const getThemeConfig = (): ThemeConfig => {
    return {
      mode: currentMode.value,
      colors: {
        primary: 'var(--el-color-primary)',
        success: 'var(--el-color-success)',
        warning: 'var(--el-color-warning)',
        danger: 'var(--el-color-danger)',
        info: 'var(--el-color-info)',
        text: {
          primary: 'var(--el-text-color-primary)',
          secondary: 'var(--el-text-color-regular)',
          placeholder: 'var(--el-text-color-placeholder)',
          disabled: 'var(--el-text-color-disabled)',
        },
        background: {
          primary: 'var(--el-bg-color)',
          secondary: 'var(--el-bg-color-page)',
          disabled: 'var(--el-fill-color-disabled)',
        },
        border: {
          primary: 'var(--el-border-color)',
          secondary: 'var(--el-border-color-light)',
          light: 'var(--el-border-color-lighter)',
          lighter: 'var(--el-border-color-extra-light)',
        },
      },
    }
  }

  // 生命周期
  onMounted(() => {
    initializeTheme()
    setupSystemThemeListener()
  })

  onUnmounted(() => {
    removeSystemThemeListener()
  })

  return {
    // 状态
    currentMode: computed(() => currentMode.value),
    isDark,
    isLight,
    systemPrefersDark: computed(() => systemPrefersDark.value),

    // 方法
    toggleTheme,
    setThemeMode,
    applyTheme,
    getThemeConfig,

    // 工具方法
    initializeTheme,
    updateSystemThemePreference,
  }
}