import type { LoginParams, RegisterParams, User } from '@/api/types/user'
import { userApi } from '@/api'
import { TOKEN_KEY } from '@/http/request'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<User | null>(null)

  const isSignup = ref(false)

  const setIsSignup = (value: boolean) => {
    isSignup.value = value
  }

  /**
   * 用户登录
   * @param params 登录参数
   */
  const signin = async (params: LoginParams) => {
    const response = await userApi.login(params)
    token.value = response.token
    localStorage.setItem(TOKEN_KEY, response.token)

    // 登录成功后获取用户信息
    const users = await userApi.getUserByUsername(params.username)
    if (users.length > 0) {
      userInfo.value = users[0]
    }
  }

  /**
   * 用户注册
   * @param params 注册参数
   */
  const signup = async (params: RegisterParams) => {
    const user = await userApi.register(params)
    userInfo.value = user

    // 注册成功后自动登录
    const response = await userApi.login({
      username: params.username,
      password: params.password,
    })
    token.value = response.token
    localStorage.setItem(TOKEN_KEY, response.token)
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY)
    token.value = ''
    userInfo.value = null
    router.replace('/login')
  }

  return { isSignup, token, userInfo, setIsSignup, signin, signup, logout }
}, {
  persist: true,
})
