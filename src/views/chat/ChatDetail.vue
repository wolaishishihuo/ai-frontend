<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const conversationId = computed(() => route.params.id as string);

// 这里可以根据 conversationId 获取对话详情
// 例如：从 store 或 API 获取
</script>

<template>
  <div class="flex flex-1 flex-col p-6">
    <div class="w-full max-w-3xl mx-auto space-y-4">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">
          对话详情
        </h1>
        <p class="text-muted-foreground">
          对话 ID: {{ conversationId }}
        </p>
      </div>

      <!-- 消息列表区域 -->
      <div class="space-y-4">
        <div class="rounded-lg border p-4">
          <p class="text-sm text-muted-foreground">
            这里显示对话的消息列表
          </p>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div class="mx-auto max-w-3xl">
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="输入消息..."
              class="flex-1 rounded-md border px-4 py-2"
            >
            <button class="rounded-md bg-primary px-4 py-2 text-primary-foreground">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
