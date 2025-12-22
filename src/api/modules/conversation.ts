import type { Conversation, CreateConversationParams } from '../types';
import type { PaginatedData, PaginationParams } from '@/http/types';
import { get, post } from '@/http';

/**
 * 会话模块 API
 */
export const conversationApi = {
  /**
   * 获取会话列表
   * @param params 分页参数
   * @returns 会话列表和分页信息
   */
  getConversationList(params?: PaginationParams): Promise<PaginatedData<Conversation>> {
    return get<PaginatedData<Conversation>>('/api/conversation/list', { params });
  },

  /**
   * 创建会话
   * @param data 会话数据
   * @returns 创建的会话信息
   */
  createConversation(data: CreateConversationParams): Promise<string> {
    return post<string>('/api/conversation/create', data);
  },

  /**
   * 获取会话详情
   * @param id 会话 ID
   * @returns 会话详情
   */
  getConversationById(id: string): Promise<Conversation> {
    return get<Conversation>(`/api/conversation/detail/${id}`);
  }
};
