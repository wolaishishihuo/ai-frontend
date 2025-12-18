<script setup lang="ts">
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
import { useUserStore } from '@/stores/modules/user';
import {
  type FormErrors,
  type SignupFormData,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateSignupForm,
  validateUsername
} from './validate';

const { setIsSignup, signup } = useUserStore();

const form = reactive<SignupFormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const errors = ref<FormErrors>({});

/**
 * 校验所有字段
 */
function validate() {
  return validateSignupForm(form, errors.value);
}

async function handleSubmit() {
  if (!validate()) {
    return;
  }

  try {
    isLoading.value = true;
    await signup({
      username: form.username,
      email: form.email,
      password: form.password
    });
    // 注册成功，跳转到首页或聊天页
    // router.push('/chat')
  }
  catch (error: any) {
    errors.value.email = error.message || 'registration failed, please check your input information';
  }
  finally {
    isLoading.value = false;
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
          <Field :data-invalid="!!errors.username">
            <FieldLabel for="username">
              Username
            </FieldLabel>
            <Input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="John Doe"
              @blur="() => validateUsername(form.username, errors)"
            />
            <FieldError v-if="errors.username">
              {{ errors.username }}
            </FieldError>
          </Field>
          <Field :data-invalid="!!errors.email">
            <FieldLabel for="email">
              Email
            </FieldLabel>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="m@example.com"
              @blur="() => validateEmail(form.email, errors)"
            />
            <FieldError v-if="errors.email">
              {{ errors.email }}
            </FieldError>
            <FieldDescription>
              We'll use this to contact you. We will not share your email with
              anyone else.
            </FieldDescription>
          </Field>
          <Field :data-invalid="!!errors.password">
            <FieldLabel for="password">
              Password
            </FieldLabel>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="please enter your password"
              @blur="() => {
                validatePassword(form.password, errors)
                if (form.confirmPassword) {
                  validateConfirmPassword(form.confirmPassword, form.password, errors)
                }
              }"
            />
            <FieldError v-if="errors.password">
              {{ errors.password }}
            </FieldError>
            <FieldDescription>Must be at least 4 characters long.</FieldDescription>
          </Field>
          <Field :data-invalid="!!errors.confirmPassword">
            <FieldLabel for="confirm-password">
              Confirm Password
            </FieldLabel>
            <Input
              id="confirm-password"
              v-model="form.confirmPassword"
              type="password"
              placeholder="please enter your confirm password"
              @blur="() => validateConfirmPassword(form.confirmPassword || '', form.password, errors)"
            />
            <FieldError v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </FieldError>
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit" :disabled="isLoading">
                {{ isLoading ? 'registering...' : 'Create Account' }}
              </Button>
              <FieldDescription class="px-6 text-center">
                Already have an account?
                <a href="#" @click.prevent="setIsSignup(false)">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
