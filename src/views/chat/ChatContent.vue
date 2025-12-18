<script setup lang="ts">
import ChatPromptInput from './components/ChatPromptInput.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col gap-4 p-4 items-center justify-center">
    <div class="text-2xl font-bold">
      Hello My Friend, Welcome to my AI Chat.
    </div>
    <ChatPromptInput class="w-full max-w-3xl h-2/5" />
  </div>
</template>
