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

  return { isSignup, token, userInfo, setIsSignup, signin, signup }
}, {
  persist: true,
})
