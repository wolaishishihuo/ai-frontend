import type { AxiosRequestConfig } from 'axios'

/**
 * HTTP 状态码常量
 */
export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus]

/**
 * 状态码描述映射
 */
export const HttpStatusMessage: Record<number, string> = {
  [HttpStatus.OK]: '请求成功',
  [HttpStatus.BAD_REQUEST]: '请求参数错误',
  [HttpStatus.UNAUTHORIZED]: '未授权（未登录或 token 失效）',
  [HttpStatus.FORBIDDEN]: '禁止访问',
  [HttpStatus.NOT_FOUND]: '资源不存在',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误',
}

/**
 * 标准 API 响应结构
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 分页元数据
 */
export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 分页数据结构
 */
export interface PaginatedData<T> {
  list: T[]
  meta: PaginationMeta
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * API 错误结构
 */
export interface ApiError {
  code: number
  message: string
}

/**
 * 扩展的请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
}
