<script setup lang="ts">
import ChatPromptInput from './components/ChatPromptInput.vue';

const chatPromptInputRef = ref<InstanceType<typeof ChatPromptInput>>();
const messages = computed(() => chatPromptInputRef.value?.messages);
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex-1 overflow-y-auto h-0">
      <Conversation>
        <ConversationContent>
          <div
            v-for="message in messages"
            :key="message.id"
          >
            <template
              v-for="(part, partIndex) in message.parts"
              :key="`${message.id}-${partIndex}`"
            >
              <Message
                v-if="part.type === 'text'"
                :from="message.role"
              >
                <div>
                  <MessageContent>
                    <MessageResponse :content="part.text" />
                  </MessageContent>

                  <!-- <MessageActions v-if="shouldShowActions(message, partIndex)">
                    <MessageAction
                      label="Retry"
                      @click="handleRegenerate"
                    >
                      <RefreshCcwIcon class="size-3" />
                    </MessageAction>
                    <MessageAction
                      label="Copy"
                      @click="copyToClipboard(part.text)"
                    >
                      <CopyIcon class="size-3" />
                    </MessageAction>
                  </MessageActions> -->
                </div>
              </Message>
            </template>
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
    <ChatPromptInput ref="chatPromptInputRef" class="mt-4" />
  </div>
</template>
