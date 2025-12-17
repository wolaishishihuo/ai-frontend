import type { AxiosRequestConfig } from 'axios'

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
