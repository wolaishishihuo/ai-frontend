import { TOKEN_KEY } from '@/http/request'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<{ name: string } | null>(null)

  const isSignup = ref(false)

  const setIsSignup = (value: boolean) => {
    isSignup.value = value
  }

  const signin = async () => {
    //
  }

  const signup = async () => {
    //
  }

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
