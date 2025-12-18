<script setup lang="ts">
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input/';
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import { CheckIcon, GlobeIcon } from 'lucide-vue-next';
import { useUserStore } from '@/stores/modules/user';

interface Emits {
  (e: 'messagesUpdated', messages: any[]): void
}

const emit = defineEmits<Emits>();

const userStore = useUserStore();

// 创建 Chat 实例
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: `${import.meta.env.VITE_API_BASE_URL}/chat`,
    headers: () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (userStore.token) {
        headers.Authorization = `Bearer ${userStore.token}`;
      }
      return headers;
    },
    body: () => ({
      // 可以根据需要添加额外的 body 参数
    })
  })
});

// 监听 messages 变化，通知父组件
watch(chat.messages, (newMessages) => {
  emit('messagesUpdated', newMessages);
}, { deep: true, immediate: true });

const models = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    chef: 'DeepSeek',
    chefSlug: 'deepseek',
    providers: ['deepseek']
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    chef: 'DeepSeek',
    chefSlug: 'deepseek',
    providers: ['deepseek']
  }
];

const modelId = ref<string>(models[0].id);
const modelSelectorOpen = ref(false);
const selectedModelData = computed(() => models.find(m => m.id === modelId.value));

function handleSubmit(message: PromptInputMessage) {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  // 发送消息
  chat.sendMessage({
    text: message.text || 'Sent with attachments',
    files: message.files
  });
}

// 暴露 messages 和 status 给父组件
defineExpose({
  messages: chat.messages,
  status: chat.status
});

onMounted(() => {
  // 组件挂载时可以加载历史消息等
});
</script>

<template>
  <div class="size-full">
    <PromptInputProvider
      @submit="handleSubmit"
    >
      <PromptInput
        multiple
        global-drop class="w-full"
      >
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

            <PromptInputSpeechButton />

            <PromptInputButton>
              <GlobeIcon :size="16" />
              <span>Search</span>
            </PromptInputButton>

            <ModelSelector v-model:open="modelSelectorOpen">
              <ModelSelectorTrigger as-child>
                <PromptInputButton>
                  <ModelSelectorLogo
                    v-if="selectedModelData?.chefSlug"
                    :provider="selectedModelData.chefSlug"
                  />
                  <ModelSelectorName v-if="selectedModelData?.name">
                    {{ selectedModelData.name }}
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
                      v-for="m in models.filter((item) => item.chef === chef)"
                      :key="m.id"
                      :value="m.id"
                      @select="() => {
                        modelId = m.id;
                        modelSelectorOpen = false;
                      }"
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

          <PromptInputSubmit :status="chat.status" />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  </div>
</template>
