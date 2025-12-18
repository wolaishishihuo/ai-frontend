<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { Moon, Sun } from 'lucide-vue-next';

const isDark = useDark();

function toggleDark() {
  isDark.value = !isDark.value;
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
        <!-- TODO: AI 详细信息 -->
        DeepSeek AI
      </h1>
      <div class="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" @click="toggleDark">
          <Sun v-if="isDark" class="size-4!" />
          <Moon v-else class="size-4!" />
        </Button>
        <Button variant="ghost" as-child size="sm" class="hidden sm:flex">
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
  </header>
</template>
