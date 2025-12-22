<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { Moon, Sun, Zap } from 'lucide-vue-next';
import { useConversationStore } from '@/stores/modules/conversation';
import ConversationStatsDrawer from './ConversationStatsDrawer.vue';

const isDark = useDark({
  valueDark: 'dark',
  valueLight: 'light'
});
const toggle = useToggle(isDark);

const conversationStore = useConversationStore();
const { conversationStats, currentConversationId } = storeToRefs(conversationStore);

const drawerOpen = ref(false);

// 监听会话 ID 变化，获取统计数据
watch(currentConversationId, (id) => {
  if (id) {
    conversationStore.fetchConversationStats();
  }
}, { immediate: true });

function formatTokens(tokens: number) {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`;
  }
  return tokens.toString();
}

function handleClickStats() {
  drawerOpen.value = true;
}
</script>

<template>
  <header class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 class="text-base font-medium">
        <span>
          DeepSeek AI
        </span>
      </h1>
      <div class="ml-auto flex items-center gap-2">
        <!-- 会话用量统计 -->
        <div
          v-if="currentConversationId && conversationStats"
          class="cursor-pointer hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex hover:text-foreground transition-colors"
          @click="handleClickStats"
        >
          <Zap class="size-3.5" />
          <span>{{ formatTokens(conversationStats.totalTokens) }} tokens</span>
          <span class="text-muted-foreground/50">
            ({{ formatTokens(conversationStats.inputTokens) }} in / {{ formatTokens(conversationStats.outputTokens) }} out)
          </span>
        </div>
        <Button variant="ghost" size="icon" @click="toggle()">
          <Sun v-if="isDark" class="size-4!" />
          <Moon v-else class="size-4!" />
        </Button>
        <Button variant="ghost" as-child class="hidden sm:flex">
          <a
            href="https://github.com/wolaishishihuo/ai-frontend"
            rel="noopener noreferrer"
            target="_blank"
            class="dark:text-foreground"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>

    <!-- 统计详情 Drawer -->
    <ConversationStatsDrawer v-model:open="drawerOpen" :stats="conversationStats" />
  </header>
</template>
