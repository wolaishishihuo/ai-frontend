<script setup lang="ts">
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
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/modules/user'

const { setIsSignup, signup } = useUserStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref<{ name?: string, email?: string, password?: string, confirmPassword?: string }>({})

function validate() {
  errors.value = {}

  if (!form.name) {
    errors.value.name = '请输入姓名'
  }

  if (!form.email) {
    errors.value.email = '请输入邮箱'
  }
  else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  }

  if (!form.password) {
    errors.value.password = '请输入密码'
  }
  else if (form.password.length < 4) {
    errors.value.password = '密码至少4位'
  }

  if (!form.confirmPassword) {
    errors.value.confirmPassword = '请输入确认密码'
  }
  else if (form.confirmPassword !== form.password) {
    errors.value.confirmPassword = '密码不一致'
  }

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validate()) {
    signup()
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>
        Enter your information below to create your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <FieldGroup>
          <Field>
            <FieldLabel for="name">
              Full Name
            </FieldLabel>
            <Input id="name" v-model="form.name" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel for="email">
              Email
            </FieldLabel>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <FieldDescription>
              We'll use this to contact you. We will not share your email with
              anyone else.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="password">
              Password
            </FieldLabel>
            <Input id="password" v-model="form.password" type="password" required />
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="confirm-password">
              Confirm Password
            </FieldLabel>
            <Input id="confirm-password" v-model="form.confirmPassword" type="password" required />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit">
                Create Account
              </Button>
              <FieldDescription class="px-6 text-center" @click="setIsSignup(false)">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
