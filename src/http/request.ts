import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse, RequestConfig } from './types';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { useUserStore } from '@/stores/modules/user';
import { HttpStatus, HttpStatusMessage } from './types';
/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 请求拦截器 - 附加 token
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (!config.skipAuth) {
      const userStore = useUserStore();
      if (userStore.token) {
        config.headers.Authorization = `Bearer ${userStore.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 错误处理和数据提取
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code === HttpStatus.OK) {
      return res.data;
    }
    return Promise.reject(new Error(res.message));
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || HttpStatusMessage[status] || '网络错误';
    const apiError: ApiError = {
      code: status || 0,
      message
    };

    if (status === HttpStatus.UNAUTHORIZED) {
      const userStore = useUserStore();
      userStore.logout();
    }

    toast.error(message);

    return Promise.reject(apiError);
  }
);

/**
 * GET 请求
 */
export function get<T>(url: string, config?: RequestConfig): Promise<T> {
  return instance.get(url, config);
}

/**
 * POST 请求
 */
export function post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return instance.post(url, data, config);
}

/**
 * PUT 请求
 */
export function put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return instance.put(url, data, config);
}

/**
 * PATCH 请求
 */
export function patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return instance.patch(url, data, config);
}

/**
 * DELETE 请求
 */
export function del<T>(url: string, config?: RequestConfig): Promise<T> {
  return instance.delete(url, config);
}

export { instance };
