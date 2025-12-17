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
  email: '2430250298@qq.com',
  password: '123456',
})

const errors = ref<{ email?: string, password?: string }>({})

function validate() {
  errors.value = {}

  if (!form.email) {
    errors.value.email = '请输入邮箱'
  }
  else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  }

  if (!form.password) {
    errors.value.password = '请输入密码'
  }
  else if (form.password.length < 6) {
    errors.value.password = '密码至少6位'
  }

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validate()) {
    signin()
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
            <Field :data-invalid="!!errors.email">
              <FieldLabel for="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="m@example.com"
              />
              <FieldError v-if="errors.email">
                {{ errors.email }}
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
              <Input id="password" v-model="form.password" type="password" />
              <FieldError v-if="errors.password">
                {{ errors.password }}
              </FieldError>
            </Field>
            <Field>
              <Button type="submit">
                Login
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
