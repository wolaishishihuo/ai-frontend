/**
 * 统计模块类型定义
 */

/**
 * 总览数据
 */
export interface StatisticsOverview {
  totalConversations: number
  totalMessages: number
  totalTokens: number
  totalInputTokens: number
  totalOutputTokens: number
}

/**
 * 每日用量数据
 */
export interface DailyUsage {
  date: string
  conversations: number
  messages: number
  tokens: number
  inputTokens: number
  outputTokens: number
}

/**
 * 每日用量查询参数
 */
export interface DailyUsageParams {
  /** 查询天数，默认30 */
  days?: number
}

/**
 * 模型用量统计
 */
export interface ModelUsage {
  model: string
  conversations: number
  messages: number
  tokens: number
  inputTokens: number
  outputTokens: number
}

/**
 * 模型用量明细
 */
export interface ModelUsageDetail {
  model: string
  count: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
}

/**
 * 会话统计
 */
export interface ConversationStats {
  messageCount: number
  requestCount: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  byModel: ModelUsageDetail[]
}

/**
 * Top 会话查询参数
 */
export interface TopConversationsParams {
  /** 返回数量，默认10 */
  limit?: number
}
