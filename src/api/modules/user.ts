import type { GetUserListParams, LoginParams, LoginResponse, RegisterParams, SendCaptchaParams, SendCaptchaResponse, UpdateUserParams, User } from '../types/user';
import type { PaginatedData } from '@/http/types';
import { del, get, patch, post } from '@/http';

/**
 * 用户模块 API
 */
export const userApi = {
  /**
   * 用户登录
   * @param data 登录参数
   * @returns 登录响应（包含 token）
   */
  login(data: LoginParams): Promise<LoginResponse> {
    return post<LoginResponse>('/api/user/login', data, { skipAuth: true });
  },

  /**
   * 用户注册
   * @param data 注册参数
   * @returns 用户信息
   */
  register(data: RegisterParams): Promise<void> {
    return post<void>('/api/user/register', data, { skipAuth: true });
  },

  /**
   * 查询所有用户（分页）
   * @param params 分页参数
   * @returns 用户列表和分页信息
   */
  getUserList(params?: GetUserListParams): Promise<PaginatedData<User>> {
    return get<PaginatedData<User>>('/api/user/all', { params });
  },

  /**
   * 根据邮箱查询用户
   * @param email 邮箱
   * @returns 用户信息数组
   */
  getUserByEmail(email: string): Promise<User> {
    return get<User>(`/api/user/${encodeURIComponent(email)}`);
  },

  /**
   * 获取当前登录用户信息
   * @returns 当前登录用户信息
   */
  getCurrentUser(): Promise<User> {
    return get<User>('/api/user/current');
  },

  /**
   * 更新用户信息
   * @param id 用户 ID
   * @param data 更新参数
   * @returns 更新后的用户信息
   */
  updateUser(id: string, data: UpdateUserParams): Promise<User> {
    return patch<User>(`/api/user/${id}`, data);
  },

  /**
   * 删除用户
   * @param id 用户 ID
   * @returns 删除的用户信息
   */
  deleteUser(id: string): Promise<User> {
    return del<User>(`/api/user/${id}`);
  },

  /**
   * 发送邮箱验证码
   * @param data 包含邮箱地址
   * @returns 发送结果
   */
  sendCaptcha(data: SendCaptchaParams): Promise<SendCaptchaResponse> {
    return post<SendCaptchaResponse>('/api/email/send', data, { skipAuth: true });
  }
};
