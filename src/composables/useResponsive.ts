import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Breakpoint } from '../types/common'

// 响应式断点配置
const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

export function useResponsive() {
  // 窗口宽度
  const windowWidth: Ref<number> = ref(0)

  // 更新窗口宽度
  const updateWindowWidth = (): void => {
    windowWidth.value = typeof window !== 'undefined' ? window.innerWidth : 0
  }

  // 计算当前断点
  const currentBreakpoint = computed((): Breakpoint => {
    const width = windowWidth.value

    if (width >= (BREAKPOINTS.xxl || 1400)) return 'xxl'
    if (width >= (BREAKPOINTS.xl || 1200)) return 'xl'
    if (width >= (BREAKPOINTS.lg || 992)) return 'lg'
    if (width >= (BREAKPOINTS.md || 768)) return 'md'
    if (width >= (BREAKPOINTS.sm || 576)) return 'sm'
    return 'xs'
  })

  // 判断是否为移动设备
  const isMobile = computed(() => {
    return windowWidth.value < BREAKPOINTS.lg
  })

  // 判断是否为平板设备
  const isTablet = computed(() => {
    return windowWidth.value >= BREAKPOINTS.md && windowWidth.value < BREAKPOINTS.lg
  })

  // 判断是否为桌面设备
  const isDesktop = computed(() => {
    return windowWidth.value >= BREAKPOINTS.lg
  })

  // 判断是否为大屏设备
  const isLargeScreen = computed(() => {
    return windowWidth.value >= BREAKPOINTS.xl
  })

  // 响应式工具方法
  const breakpointUp = (breakpoint: Breakpoint): boolean => {
    return windowWidth.value >= BREAKPOINTS[breakpoint]
  }

  const breakpointDown = (breakpoint: Breakpoint): boolean => {
    return windowWidth.value < BREAKPOINTS[breakpoint]
  }

  const breakpointBetween = (min: Breakpoint, max: Breakpoint): boolean => {
    return windowWidth.value >= BREAKPOINTS[min] && windowWidth.value < BREAKPOINTS[max]
  }

  const breakpointOnly = (breakpoint: Breakpoint): boolean => {
    const breakpoints = Object.keys(BREAKPOINTS) as Breakpoint[]
    const index = breakpoints.indexOf(breakpoint)
    const minValue = BREAKPOINTS[breakpoint] || 0
    const nextBreakpoint = breakpoints[index + 1]
    const maxValue = nextBreakpoint ? BREAKPOINTS[nextBreakpoint] || Infinity : Infinity

    return windowWidth.value >= minValue && windowWidth.value < maxValue
  }

  // 响应式数值计算
  const responsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
    const breakpoints = Object.keys(BREAKPOINTS) as Breakpoint[]

    // 从大到小查找匹配的断点
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      const bp = breakpoints[i]
      if (bp && values[bp] !== undefined && breakpointUp(bp)) {
        return values[bp]!
      }
    }

    return defaultValue
  }

  // 响应式类名生成
  const responsiveClasses = (
    classes: Partial<Record<Breakpoint, string>>,
    prefix = '',
  ): string[] => {
    const result: string[] = []
    const breakpoints = Object.keys(BREAKPOINTS) as Breakpoint[]

    breakpoints.forEach((bp) => {
      if (classes[bp]) {
        if (bp === 'xs') {
          result.push(`${prefix}${classes[bp]}`)
        } else {
          result.push(`${prefix}${bp}:${classes[bp]}`)
        }
      }
    })

    return result
  }

  // 防抖处理窗口大小变化
  let resizeTimer: number | null = null
  const handleResize = (): void => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    resizeTimer = window.setTimeout(() => {
      updateWindowWidth()
    }, 100)
  }

  // 生命周期
  onMounted(() => {
    updateWindowWidth()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
  })

  onUnmounted(() => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    // 状态
    windowWidth: computed(() => windowWidth.value),
    currentBreakpoint,

    // 布尔值判断
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,

    // 工具方法
    breakpointUp,
    breakpointDown,
    breakpointBetween,
    breakpointOnly,

    // 响应式工具
    responsiveValue,
    responsiveClasses,

    // 断点常量
    BREAKPOINTS,
  }
}
