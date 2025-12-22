<script setup lang="ts">
import { useConversationStore } from '@/stores/modules/conversation';
import { useUserStore } from '@/stores/modules/user';
import ChatPromptInput from './components/ChatPromptInput.vue';

const { userInfo } = useUserStore();
const { clearCurrentConversation } = useConversationStore();

onMounted(() => {
  clearCurrentConversation();
});
</script>

<template>
  <div class="min-h-screen flex flex-col gap-4 p-4 items-center justify-center">
    <div class="text-2xl font-bold">
      Hello {{ userInfo.username }}, Try to ask me anything.
    </div>
    <ChatPromptInput class="w-full max-w-3xl h-2/5" />
  </div>
</template>
