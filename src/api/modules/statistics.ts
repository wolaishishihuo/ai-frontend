import type {
  ConversationStats,
  DailyUsage,
  DailyUsageParams,
  ModelUsage,
  StatisticsOverview,
  TopConversationsParams
} from '../types';
import { get } from '@/http';

/**
 * 统计模块 API
 */
export const statisticsApi = {
  /**
   * 获取总览数据
   * @returns 统计总览数据
   */
  getOverview(): Promise<StatisticsOverview> {
    return get<StatisticsOverview>('/api/statistics/overview');
  },

  /**
   * 获取每日用量趋势
   * @param params 查询参数
   * @returns 每日用量数据列表
   */
  getDailyUsage(params?: DailyUsageParams): Promise<DailyUsage[]> {
    return get<DailyUsage[]>('/api/statistics/usage/daily', { params });
  },

  /**
   * 按模型统计用量
   * @returns 各模型用量统计
   */
  getUsageByModel(): Promise<ModelUsage[]> {
    return get<ModelUsage[]>('/api/statistics/usage/by-model');
  },

  /**
   * 获取单个会话统计
   * @param id 会话 ID
   * @returns 会话统计数据
   */
  getConversationStats(id: string): Promise<ConversationStats> {
    return get<ConversationStats>(`/api/statistics/conversation/${id}`);
  },

  /**
   * 获取 Token 消耗最多的会话
   * @param params 查询参数
   * @returns Top 会话列表
   */
  getTopConversations(params?: TopConversationsParams): Promise<ConversationStats[]> {
    return get<ConversationStats[]>('/api/statistics/top-conversations', { params });
  }
};
