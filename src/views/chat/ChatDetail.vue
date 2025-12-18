<script setup lang="ts">
import ChatPromptInput from './components/ChatPromptInput.vue';

const messages = ref<any[]>([]);

function handleMessagesUpdated(newMessages: any[]) {
  messages.value = newMessages;
}
</script>

<template>
  <div class="relative w-1/2 mx-auto h-full flex flex-col overflow-hidden">
    <div class="flex-1 min-h-0 overflow-hidden p-6 pb-0">
      <Conversation class="size-full overflow-y-auto">
        <ConversationContent>
          <Message v-for="message in messages" :key="message.id" :from="message.role">
            <MessageContent>
              <template v-for="(part, i) in message.parts" :key="`${message.id}-${i}`">
                <MessageResponse v-if="part.type === 'text'">
                  {{ part.text }}
                </MessageResponse>
              </template>
            </MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
    <div class="shrink-0 p-6 pt-0">
      <ChatPromptInput @messages-updated="handleMessagesUpdated" />
    </div>
  </div>
</template>
