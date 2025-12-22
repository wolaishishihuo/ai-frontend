<script setup lang="ts">
import type { ChatStatus, UIMessage } from 'ai';
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import { CheckIcon } from 'lucide-vue-next';
import { type PromptInputMessage, usePromptInputProvider } from '@/components/ai-elements/prompt-input/';
import { CHAT_MODELS, useConversationStore } from '@/stores/modules/conversation';

const route = useRoute();
const router = useRouter();
const conversationStore = useConversationStore();
const { modelId, selectedModel, pendingMessage, currentConversation } = storeToRefs(conversationStore);

const modelSelectorOpen = ref(false);
const conversationId = computed(() => route.params.id as string | undefined);

// Chat 实例
const chatRef = shallowRef<Chat<UIMessage> | null>(null);

// 创建 Chat 实例
function createChat(initialMessages?: UIMessage[]) {
  chatRef.value = new Chat<UIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_API_BASE_URL}/api/chat/generate`,
      body: () => ({
        modelType: selectedModel.value?.id,
        conversationId: conversationId.value
      })
    })
  });
}

// 初始化
createChat();

const status = computed<ChatStatus>(() => chatRef.value?.status ?? 'ready');
const messages = computed(() => chatRef.value?.messages ?? []);

const promptInput = usePromptInputProvider({
  onSubmit: handleSubmit,
  onError: handlePromptError
});

const hasPendingInput = computed(() => {
  return Boolean(promptInput.textInput.value.trim()) || promptInput.files.value.length > 0;
});

const submitDisabled = computed(() => !hasPendingInput.value && !status.value);

function handlePromptError(error: { code: string, message: string }) {
  console.error(`Input error (${error.code})`, error.message);
}

function handleStopStream() {
  chatRef.value?.stop();
}

async function handleSubmit(message: PromptInputMessage) {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  // 如果没有当前会话，创建新会话
  if (!conversationId.value) {
    const newConversationId = await conversationStore.createConversation(message);
    router.push({ name: 'chat-detail', params: { id: newConversationId } });
    return;
  }

  if (status.value === 'streaming' || status.value === 'submitted') {
    return;
  }

  // 发送消息
  chatRef.value?.sendMessage({
    text: hasText ? message.text : 'Sent with attachments',
    files: hasAttachments ? message.files : undefined
  });
}

function handleRegenerate() {
  chatRef.value?.regenerate({
    body: {
      modelType: selectedModel.value?.id
    }
  });
}

function selectModel(id: string) {
  conversationStore.setModel(id as typeof modelId.value);
  modelSelectorOpen.value = false;
}

// 监听会话变化，加载历史消息
watch(currentConversation, (conversation) => {
  if (conversation?.messages?.length) {
    // 转换消息格式
    const historyMessages: UIMessage[] = conversation.messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      parts: msg.parts,
      createdAt: new Date(msg.createdAt)
    }));
    // 重新创建 Chat 实例并加载历史消息
    createChat(historyMessages);
  }
}, { immediate: true });

// 处理 pendingMessage（从 ChatContent 创建会话后跳转过来）
watch([conversationId, currentConversation], async ([newId, conversation]) => {
  if (newId && pendingMessage.value && conversation) {
    const message = conversationStore.consumePendingMessage();
    if (message) {
      await nextTick();
      chatRef.value?.sendMessage({
        text: message.text,
        files: message.files?.length ? message.files : undefined
      });
    }
  }
}, { immediate: true });

defineExpose({
  messages,
  status,
  handleRegenerate,
  handleStopStream,
  setTextInput: (text: string) => promptInput.setTextInput(text)
});
</script>

<template>
  <div>
    <PromptInputProvider @submit="handleSubmit">
      <PromptInput multiple global-drop class="w-full">
        <PromptInputAttachments>
          <template #default="{ file }">
            <PromptInputAttachment :file="file" />
          </template>
        </PromptInputAttachments>

        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>

        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>

            <ModelSelector v-model:open="modelSelectorOpen">
              <ModelSelectorTrigger as-child>
                <PromptInputButton>
                  <ModelSelectorLogo
                    v-if="selectedModel?.chefSlug"
                    :provider="selectedModel.chefSlug"
                  />
                  <ModelSelectorName v-if="selectedModel?.name">
                    {{ selectedModel.name }}
                  </ModelSelectorName>
                </PromptInputButton>
              </ModelSelectorTrigger>

              <ModelSelectorContent>
                <ModelSelectorInput placeholder="Search models..." />
                <ModelSelectorList>
                  <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>

                  <ModelSelectorGroup
                    v-for="chef in ['DeepSeek']"
                    :key="chef"
                    :heading="chef"
                  >
                    <ModelSelectorItem
                      v-for="m in CHAT_MODELS.filter((item) => item.chef === chef)"
                      :key="m.id"
                      :value="m.id"
                      @select="() => selectModel(m.id)"
                    >
                      <ModelSelectorLogo :provider="m.chefSlug" />
                      <ModelSelectorName>{{ m.name }}</ModelSelectorName>

                      <ModelSelectorLogoGroup>
                        <ModelSelectorLogo
                          v-for="provider in m.providers"
                          :key="provider"
                          :provider="provider"
                        />
                      </ModelSelectorLogoGroup>

                      <CheckIcon v-if="modelId === m.id" class="ml-auto size-4" />
                      <div v-else class="ml-auto size-4" />
                    </ModelSelectorItem>
                  </ModelSelectorGroup>
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>
          </PromptInputTools>

          <PromptInputSubmit
            :status="status"
            :disabled="submitDisabled"
            @stop="handleStopStream"
          />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  </div>
</template>
