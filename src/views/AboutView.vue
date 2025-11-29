<template>
  <div class="about">
    <h1>Element Plus 测试页面</h1>
    <ElementTest />
  </div>
</template>

<script setup lang="ts">
import ElementTest from '@/components/ElementTest.vue'
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
}

.about h1 {
  margin-bottom: 30px;
  color: #409eff;
  text-align: center;
}
</style>
