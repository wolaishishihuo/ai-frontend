<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user';
import ChatPromptInput from './components/ChatPromptInput.vue';

const { userInfo } = useUserStore();
</script>

<template>
  <div class="min-h-screen flex flex-col gap-4 p-4 items-center justify-center">
    <div class="text-2xl font-bold">
      Hello {{ userInfo.username }}, Welcome to AI Chat.
    </div>
    <ChatPromptInput class="w-full max-w-3xl h-2/5" />
  </div>
</template>
