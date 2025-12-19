<script setup lang="ts">
import type { ChatStatus } from 'ai';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input/';
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import { CheckIcon, GlobeIcon } from 'lucide-vue-next';

const models = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek',
    chef: 'DeepSeek',
    chefSlug: 'deepseek',
    providers: ['deepseek']
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek R1',
    chef: 'DeepSeek',
    chefSlug: 'deepseek',
    providers: ['deepseek']
  }
];
const modelId = ref<string>(models[0].id);
const modelSelectorOpen = ref(false);
const selectedModelData = computed(() => models.find(m => m.id === modelId.value));

// 创建 Chat 实例
const chat = new Chat({
  transport: new DefaultChatTransport({
    api: `${import.meta.env.VITE_API_BASE_URL}/api/chat/generate`,
    body: () => ({
      modelType: selectedModelData.value?.id
    })
  })
});

const status = computed<ChatStatus>(() => chat.status);
const messages = computed(() => chat.messages);

function handleSubmit(message: PromptInputMessage) {
  const hasText = Boolean(message.text);
  const hasAttachments = Boolean(message.files?.length);

  if (!(hasText || hasAttachments)) {
    return;
  }

  // 发送消息
  chat.sendMessage({
    text: hasText ? message.text : 'Sent with attachments',
    files: hasAttachments ? message.files : undefined
  });
}

defineExpose({
  messages
});
</script>

<template>
  <div>
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

          <PromptInputSubmit :status="status" />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  </div>
</template>
