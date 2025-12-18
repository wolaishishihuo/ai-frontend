/**
 * 表单校验工具函数
 */

/**
 * 登录表单数据类型
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * 注册表单数据类型
 */
export interface SignupFormData {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

/**
 * 错误信息类型
 */
export interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

/**
 * 校验用户名
 */
export function validateUsername(
  username: string,
  errors: FormErrors,
): boolean {
  if (!username) {
    errors.username = 'please enter your username'
    return false
  }
  delete errors.username
  return true
}

/**
 * 校验邮箱
 */
export function validateEmail(
  email: string,
  errors: FormErrors,
): boolean {
  if (!email) {
    errors.email = 'please enter your email'
    return false
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
    errors.email = 'please enter a valid email address'
    return false
  }
  delete errors.email
  return true
}

/**
 * 校验密码
 */
export function validatePassword(
  password: string,
  errors: FormErrors,
): boolean {
  if (!password) {
    errors.password = 'please enter your password'
    return false
  }
  if (password.length < 4) {
    errors.password = 'password must be at least 4 characters long'
    return false
  }
  delete errors.password
  return true
}

/**
 * 校验确认密码
 */
export function validateConfirmPassword(
  confirmPassword: string,
  password: string,
  errors: FormErrors,
): boolean {
  if (!confirmPassword) {
    errors.confirmPassword = 'please enter your confirm password'
    return false
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = 'password does not match'
    return false
  }
  delete errors.confirmPassword
  return true
}

/**
 * 校验登录表单
 */
export function validateLoginForm(
  form: LoginFormData,
  errors: FormErrors,
): boolean {
  const emailValid = validateEmail(form.email, errors)
  const passwordValid = validatePassword(form.password, errors)

  return emailValid && passwordValid
}

/**
 * 校验注册表单
 */
export function validateSignupForm(
  form: SignupFormData,
  errors: FormErrors,
): boolean {
  const usernameValid = validateUsername(form.username, errors)
  const emailValid = validateEmail(form.email, errors)
  const passwordValid = validatePassword(form.password, errors)
  const confirmPasswordValid = validateConfirmPassword(
    form.confirmPassword || '',
    form.password,
    errors,
  )

  return usernameValid && emailValid && passwordValid && confirmPasswordValid
}
