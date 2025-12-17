<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/modules/user'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { setIsSignup, signin } = useUserStore()

const form = reactive({
  username: '',
  password: '',
})

const isLoading = ref(false)
const errors = ref<{ username?: string, password?: string }>({})

function validate() {
  errors.value = {}

  if (!form.username) {
    errors.value.username = '请输入用户名'
  }

  if (!form.password) {
    errors.value.password = '请输入密码'
  }
  else if (form.password.length < 4) {
    errors.value.password = '密码至少4位'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  try {
    isLoading.value = true
    await signin({
      username: form.username,
      password: form.password,
    })
    // 登录成功，跳转到首页或聊天页
    // router.push('/chat')
  }
  catch (error: any) {
    errors.value.password = error.message || '登录失败，请检查用户名和密码'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <FieldGroup>
            <Field :data-invalid="!!errors.username">
              <FieldLabel for="username">
                Username
              </FieldLabel>
              <Input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="please enter your username"
              />
              <FieldError v-if="errors.username">
                {{ errors.username }}
              </FieldError>
            </Field>
            <Field :data-invalid="!!errors.password">
              <div class="flex items-center">
                <FieldLabel for="password">
                  Password
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" v-model="form.password" type="password" placeholder="please enter your password" />
              <FieldError v-if="errors.password">
                {{ errors.password }}
              </FieldError>
            </Field>
            <Field>
              <Button type="submit" :disabled="isLoading">
                {{ isLoading ? '登录中...' : 'Login' }}
              </Button>
              <FieldDescription class="text-center">
                Don't have an account?
                <a href="#" @click="setIsSignup(true)">
                  Sign up
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
