import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiResponse, RequestConfig } from './types'
import axios from 'axios'

const TOKEN_KEY = 'auth_token'

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器 - 附加 token
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (!config.skipAuth) {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器 - 错误处理和数据提取
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data.data
  },
  (error) => {
    const status = error.response?.status
    const apiError: ApiError = {
      code: status || 0,
      message: error.message || 'Unknown error',
    }

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
      apiError.message = 'Unauthorized'
    }
    else if (status === 403) {
      apiError.message = 'Permission denied'
    }
    else if (status >= 500) {
      apiError.message = 'Server error'
    }

    return Promise.reject(apiError)
  },
)

/**
 * GET 请求
 */
export function get<T>(url: string, config?: RequestConfig): Promise<T> {
  return instance.get(url, config)
}

/**
 * POST 请求
 */
export function post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return instance.post(url, data, config)
}

/**
 * PUT 请求
 */
export function put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return instance.put(url, data, config)
}

/**
 * DELETE 请求
 */
export function del<T>(url: string, config?: RequestConfig): Promise<T> {
  return instance.delete(url, config)
}

export { instance }
