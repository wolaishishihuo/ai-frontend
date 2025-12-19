import type { LoginParams, RegisterParams, User } from '@/api/types/user';
import { userApi } from '@/api';
import { USER_STORE_KEY } from '@/constant';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref<User>({} as User);

  const isSignup = ref(false);

  /**
   * 检查是否已登录
   */
  const isLoggedIn = computed(() => !!token.value);

  const setIsSignup = (value: boolean) => {
    isSignup.value = value;
  };

  const getUserInfo = async () => {
    const user = await userApi.getUserByEmail(userInfo.value.email);
    userInfo.value = user;
  };

  /**
   * 用户登录
   * @param params 登录参数
   */
  const signin = async (params: LoginParams) => {
    const response = await userApi.login(params);
    token.value = response.token;
    userInfo.value.email = params.email;
  };

  /**
   * 用户注册
   * @param params 注册参数
   */
  const signup = async (params: RegisterParams) => {
    const user = await userApi.register(params);
    userInfo.value = user;

    // 注册成功后自动登录
    const response = await userApi.login({
      email: params.email,
      password: params.password
    });
    token.value = response.token;
  };

  const resetUserStore = () => {
    token.value = '';
    userInfo.value = {} as User;
  };

  /**
   * 用户登出
   */
  const logout = () => {
    resetUserStore();
    router.replace('/login');
  };

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
    getUserInfo
  };
}, {
  persist: {
    key: USER_STORE_KEY,
    pick: ['token', 'userInfo']
  }
});
