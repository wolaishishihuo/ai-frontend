import type { LoginParams, RegisterParams, User } from '@/api/types/user'
import { userApi } from '@/api'
import { USER_STORE_KEY } from '@/constant'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<User | null>(null)

  const isSignup = ref(false)

  /**
   * 检查是否已登录
   */
  const isLoggedIn = computed(() => !!token.value)

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

    // 登录成功后获取用户信息
    const users = await userApi.getUserByEmail(params.email)
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
      email: params.email,
      password: params.password,
    })
    token.value = response.token
  }

  const resetUserStore = () => {
    token.value = ''
    userInfo.value = null
  }

  /**
   * 用户登出
   */
  const logout = () => {
    resetUserStore()
    router.replace('/login')
  }

  return {
    // state
    token,
    userInfo,
    isSignup,
    // getters
    isLoggedIn,
    // actions
    setIsSignup,
    signin,
    signup,
    logout,
    resetUserStore,
  }
}, {
  persist: {
    key: USER_STORE_KEY,
    pick: ['token', 'userInfo'],
  },
})
