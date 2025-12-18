<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactive, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/modules/user';
import {
  type FormErrors,
  type LoginFormData,
  validateEmail,
  validateLoginForm,
  validatePassword
} from './validate';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>();

const router = useRouter();
const { setIsSignup, signin } = useUserStore();

const form = reactive<LoginFormData>({
  email: '',
  password: ''
});

const isLoading = ref(false);
const errors = ref<FormErrors>({});

/**
 * 校验所有字段
 */
function validate() {
  return validateLoginForm(form, errors.value);
}

async function handleSubmit() {
  if (!validate()) {
    return;
  }

  try {
    isLoading.value = true;
    await signin({
      email: form.email,
      password: form.password
    });
    // 登录成功，跳转到首页或聊天页
    router.push('/chat');
  }
  catch (error: any) {
    errors.value.password = error.message || '登录失败，请检查邮箱和密码';
  }
  finally {
    isLoading.value = false;
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
                placeholder="please enter your email"
                @blur="() => validateEmail(form.email, errors)"
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
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="please enter your password"
                @blur="() => validatePassword(form.password, errors)"
              />
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
