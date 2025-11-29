<template>
  <div class="wang-editor-test">
    <el-card title="wangEditor 测试页面">
      <template #header>
        <div class="card-header">
          <span>wangEditor 测试页面</span>
          <ThemeToggle />
        </div>
      </template>

      <WangEditor
        v-model="content"
        :height="400"
        placeholder="请输入富文本内容..."
        @ready="onReady"
        @change="onChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WangEditor from '@/components/WangEditor.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const content = ref('<h2>wangEditor 测试</h2><p>这是一个<strong>测试页面</strong>，用于验证 wangEditor 是否正常工作。</p>')

const onReady = (editor: any) => {
  console.log('wangEditor 已就绪:', editor)
}

const onChange = (value: string) => {
  console.log('内容已变更:', value)
}
</script>

<style scoped>
.wang-editor-test {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>