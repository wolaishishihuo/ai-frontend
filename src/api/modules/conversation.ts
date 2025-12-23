import type { Conversation, CreateConversationParams, UpdateConversationParams } from '../types';
import type { PaginatedData, PaginationParams } from '@/http/types';
import { del, get, post } from '@/http';

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
  },

  /**
   * 删除会话
   * @param id 会话 ID
   * @returns 是否删除成功
   */
  deleteConversation(id: string): Promise<boolean> {
    return del<boolean>(`/api/conversation/delete/${id}`);
  },

  /**
   * 更新会话
   * @param id 会话 ID
   * @param data 更新数据
   * @returns 是否更新成功
   */
  updateConversation(id: string, data: UpdateConversationParams): Promise<boolean> {
    return post<boolean>(`/api/conversation/update/${id}`, data);
  }

};
