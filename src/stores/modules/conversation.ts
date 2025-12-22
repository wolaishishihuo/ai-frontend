import type { Conversation } from '@/api/types/conversation';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { conversationApi } from '@/api';

// 模型配置
export const CHAT_MODELS = [
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
] as const;

export type ModelId = typeof CHAT_MODELS[number]['id'];

export const useConversationStore = defineStore('conversation', () => {
  // 会话列表
  const conversations = ref<Conversation[]>([]);
  // 当前会话
  const currentConversation = ref<Conversation | null>(null);
  // 当前会话 ID
  const currentConversationId = ref<string | null>(null);
  // 待发送的消息（创建会话后使用）
  const pendingMessage = ref<PromptInputMessage | null>(null);
  // 当前选择的模型
  const modelId = ref<ModelId>('deepseek-chat');

  const selectedModel = computed(() =>
    CHAT_MODELS.find(m => m.id === modelId.value)
  );

  // 获取会话列表
  async function fetchConversationList() {
    const response = await conversationApi.getConversationList();
    conversations.value = response.list;
  }

  // 获取会话详情
  async function fetchConversationById(id: string) {
    const response = await conversationApi.getConversationById(id);
    currentConversation.value = response;
    return response;
  }

  // 创建会话
  async function createConversation(message: PromptInputMessage): Promise<string> {
    const newConversationId = await conversationApi.createConversation({
      title: message.text.slice(0, 50),
      description: ''
    });
    await fetchConversationList();
    pendingMessage.value = message;
    return newConversationId;
  }

  // 消费待发送消息
  function consumePendingMessage(): PromptInputMessage | null {
    const message = pendingMessage.value;
    pendingMessage.value = null;
    return message;
  }

  // 设置当前会话 ID
  function setCurrentConversationId(id: string | null) {
    currentConversationId.value = id;
  }

  // 设置模型
  function setModel(id: ModelId) {
    modelId.value = id;
  }

  // 清理当前会话状态
  function clearCurrentConversation() {
    currentConversationId.value = null;
    currentConversation.value = null;
    pendingMessage.value = null;
  }

  return {
    // 状态
    conversations,
    currentConversation,
    currentConversationId,
    modelId,
    selectedModel,
    pendingMessage,

    // 方法
    fetchConversationList,
    fetchConversationById,
    createConversation,
    consumePendingMessage,
    setCurrentConversationId,
    setModel,
    clearCurrentConversation
  };
});
