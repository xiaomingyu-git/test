<template>
  <el-switch
    v-model="isDark"
    inline-prompt
    active-text="🌙"
    inactive-text="☀️"
    active-color="var(--el-color-primary)"
    inactive-color="var(--el-color-primary)"
    @change="toggleTheme"
  />
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'

// 主题状态 - 计算属性确保与DOM同步
const isDark: Ref<boolean> = ref(false)

// 初始化主题 - 使用明确的返回类型
const initializeTheme = (): void => {
  // 从localStorage读取主题设置
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    // 使用系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// 切换主题 - 使用明确的返回类型
const toggleTheme = (value: boolean): void => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    // 同时添加html的dark属性
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    // 移除html的dark属性
    document.documentElement.removeAttribute('data-theme')
  }
}

onMounted(() => {
  initializeTheme()

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { // 只有在用户没有手动设置时才响应系统变化
      isDark.value = e.matches
      toggleTheme(e.matches)
    }
  })
})
</script>

<style scoped>
/* 组件样式可以保持简单，因为主要样式在全局CSS中处理 */
</style>