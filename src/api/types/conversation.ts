import type { UIMessage } from 'ai';

/**
 * 会话模块类型定义
 */

/**
 * 会话消息
 */
export interface ConversationMessage {
  id: string
  parts: UIMessage['parts']
  role: 'user' | 'assistant'
  createdAt: string
}

/**
 * 会话信息
 */
export interface Conversation {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  messages?: ConversationMessage[]
}

export interface CreateConversationParams {
  title: string
  description?: string
}
