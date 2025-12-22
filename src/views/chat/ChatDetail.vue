<script setup lang="ts">
import type { UIMessage } from 'ai';
import { useClipboard } from '@vueuse/core';
import { CopyIcon, RefreshCcwIcon } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import ChatPromptInput from './components/ChatPromptInput.vue';

const { copy } = useClipboard();

const chatPromptInputRef = ref<InstanceType<typeof ChatPromptInput>>();
const messages = computed(() => chatPromptInputRef.value?.messages);
const status = computed(() => chatPromptInputRef.value?.status);

function shouldShowActions(message: UIMessage, partIndex: number) {
  return message.role === 'assistant' && partIndex === message.parts.length - 1;
}

function handleRegenerate() {
  chatPromptInputRef.value?.handleRegenerate();
}

function copyToClipboard(text: string) {
  copy(text);
  toast.success('Copied to clipboard');
}

function getSourceUrlParts(message: UIMessage) {
  return message.parts.filter(part => part.type === 'source-url');
}

function isStreamingPart(msgIndex: number, partIndex: number) {
  const lastMsg = messages!.value?.at(-1);
  const msg = messages!.value?.[msgIndex];

  if (!lastMsg || msg?.id !== lastMsg.id)
    return false;

  const isLastPart = partIndex === msg!.parts!.length - 1;
  return status.value === 'streaming' && isLastPart;
}
</script>

<template>
  <div class="flex h-full flex-col mx-auto max-w-5xl">
    <div class="flex-1 overflow-y-auto h-0">
      <Conversation>
        <ConversationContent>
          <div
            v-for="(message, messageIndex) in messages"
            :key="message.id"
          >
            <!-- 开启web搜索时，显示来源 -->
            <Sources
              v-if="message.role === 'assistant' && getSourceUrlParts(message).length > 0"
            >
              <SourcesTrigger :count="getSourceUrlParts(message).length" />
              <SourcesContent
                v-for="(source, index) in getSourceUrlParts(message)"
                :key="`${message.id}-source-${index}`"
              >
                <Source
                  :href="source.url"
                  :title="source.title ?? source.url"
                />
              </SourcesContent>
            </Sources>

            <template
              v-for="(part, partIndex) in message.parts"
              :key="`${message.id}-${partIndex}`"
            >
              <Message
                v-if="part.type === 'text' || part.type === 'reasoning'"
                :from="message.role"
              >
                <div class="space-y-2">
                  <MessageContent>
                    <MessageResponse v-if="part.type === 'text'" :content="part.text" />
                    <Reasoning
                      v-else-if="part.type === 'reasoning'"
                      class="w-full"
                      :is-streaming="isStreamingPart(messageIndex, partIndex)"
                    >
                      <ReasoningTrigger />
                      <ReasoningContent :content="part.text" />
                    </Reasoning>
                  </MessageContent>
                  <MessageActions v-if="shouldShowActions(message, partIndex)">
                    <MessageAction
                      v-if="messageIndex === messages!.length - 1"
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
                  </MessageActions>
                </div>
              </Message>
            </template>
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
    <ChatPromptInput ref="chatPromptInputRef" class="my-4" />
  </div>
</template>
