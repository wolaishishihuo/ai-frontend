import type { Conversation } from '@/api/types/conversation';
import type { ConversationStats } from '@/api/types/statistics';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { conversationApi, statisticsApi } from '@/api';

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
  // 当前会话统计数据
  const conversationStats = ref<ConversationStats | null>(null);
  const statsLoading = ref(false);

  const selectedModel = computed(() =>
    CHAT_MODELS.find(m => m.id === modelId.value)
  );

  // 获取会话列表
  async function fetchConversationList() {
    const response = await conversationApi.getConversationList();
    conversations.value = response.list;
  }

  // 获取会话详情
  async function fetchConversationById() {
    const response = await conversationApi.getConversationById(currentConversationId.value!);
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
    conversationStats.value = null;
  }

  // 获取当前会话统计
  async function fetchConversationStats() {
    if (!currentConversationId.value)
      return;

    statsLoading.value = true;
    try {
      conversationStats.value = await statisticsApi.getConversationStats(currentConversationId.value);
    }
    catch {
      conversationStats.value = null;
    }
    finally {
      statsLoading.value = false;
    }
  }

  // 删除会话
  async function deleteConversation(id: string): Promise<boolean> {
    try {
      await conversationApi.deleteConversation(id);

      // 从列表中移除
      conversations.value = conversations.value.filter(c => c.id !== id);

      // 如果删除的是当前会话，清理状态
      if (currentConversationId.value === id) {
        clearCurrentConversation();
      }

      return true;
    }
    catch (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
  }

  return {
    // 状态
    conversations,
    currentConversation,
    currentConversationId,
    modelId,
    selectedModel,
    pendingMessage,
    conversationStats,
    statsLoading,

    // 方法
    fetchConversationList,
    fetchConversationById,
    createConversation,
    consumePendingMessage,
    setCurrentConversationId,
    setModel,
    clearCurrentConversation,
    fetchConversationStats,
    deleteConversation
  };
});
