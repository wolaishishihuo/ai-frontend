<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { toast } from 'vue-sonner';
import { useConversationStore } from '@/stores/modules/conversation';
import { useUserStore } from '@/stores/modules/user';
import ChatPromptInput from './ChatPromptInput.vue';

const { userInfo } = storeToRefs(useUserStore());
const { clearCurrentConversation } = useConversationStore();

const { copy } = useClipboard();

const examples = [
  { title: '小红书文案', prompt: '帮我生成一篇关于旅行的小红书爆款文案，要求有吸引力的标题和emoji' },
  { title: '代码助手', prompt: '帮我写一个 JavaScript 函数，实现数组去重并保持原有顺序' },
  { title: '周报生成', prompt: '帮我根据以下工作内容生成一份周报：完成了用户模块开发、修复了3个bug、参加了2次会议' },
  { title: '翻译润色', prompt: '请将以下中文翻译成地道的英文，并进行润色优化' }
];

function handleExampleClick(prompt: string) {
  copy(prompt);
  toast.success('Copied to clipboard');
}

onMounted(() => {
  clearCurrentConversation();
});
</script>

<template>
  <div class="min-h-screen flex flex-col gap-6 p-4 items-center justify-center">
    <div class="text-2xl font-bold text-center">
      Hello {{ userInfo.username }}, Try to ask me anything.
    </div>

    <!-- 四个示例卡片 -->
    <div class="grid grid-cols-2 gap-3 w-full max-w-2xl">
      <div
        v-for="example in examples"
        :key="example.title"
        class="p-4 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
        @click="handleExampleClick(example.prompt)"
      >
        <div class="font-medium text-sm">
          {{ example.title }}
        </div>
        <div class="text-xs text-muted-foreground mt-1 line-clamp-2">
          {{ example.prompt }}
        </div>
      </div>
    </div>

    <ChatPromptInput class="w-full max-w-3xl h-2/5" />
  </div>
</template>
