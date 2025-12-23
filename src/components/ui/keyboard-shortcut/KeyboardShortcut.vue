<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
  keys: string[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>();

// 检测是否为 Mac 系统
const isMac = computed(() => {
  if (typeof window === 'undefined')
    return false;
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
});

// 格式化快捷键显示
const formattedKeys = computed(() => {
  return props.keys.map((key) => {
    if (key === 'meta' || key === 'cmd') {
      return isMac.value ? 'Command' : 'Ctrl';
    }
    if (key === 'ctrl') {
      return 'Ctrl';
    }
    if (key === 'shift') {
      return 'Shift';
    }
    if (key === 'alt') {
      return isMac.value ? '⌥' : 'Alt';
    }
    if (key === 'enter') {
      return 'Enter';
    }
    if (key === 'escape' || key === 'esc') {
      return 'Esc';
    }
    // 其他键转为大写
    return key.length === 1 ? key.toUpperCase() : key;
  });
});
</script>

<template>
  <kbd
    :class="cn(
      'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100',
      props.class,
    )"
  >
    <template v-for="(key, index) in formattedKeys" :key="index">
      <span>{{ key }}</span>
      <span v-if="index < formattedKeys.length - 1" class="text-muted-foreground/50">+</span>
    </template>
  </kbd>
</template>
