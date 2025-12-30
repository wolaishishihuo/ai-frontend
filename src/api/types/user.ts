/**
 * 用户相关类型定义
 */

/**
 * 用户信息
 */
export interface User {
  id: string
  username: string
  email: string
  avatar: string
  createdAt: string
  updatedAt: string
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  email: string
  password: string
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string
  password: string
  email: string
  captcha: string
}

/**
 * 发送验证码请求参数
 */
export interface SendCaptchaParams {
  email: string
}

/**
 * 发送验证码响应
 */
export interface SendCaptchaResponse {
  success: boolean
}

/**
 * 更新用户请求参数
 */
export interface UpdateUserParams {
  username?: string
  password?: string
  email?: string
  avatar?: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string
}

/**
 * 用户列表查询参数
 */
export interface GetUserListParams {
  page?: number
  pageSize?: number
}
