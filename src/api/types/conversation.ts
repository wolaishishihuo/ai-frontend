/**
 * 会话模块类型定义
 */

/**
 * 会话信息
 */
export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  [key: string]: any
}
