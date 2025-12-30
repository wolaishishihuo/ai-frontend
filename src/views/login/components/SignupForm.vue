<script setup lang="ts">
import { reactive, ref } from 'vue';
import { userApi } from '@/api/modules/user';
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
  validateCaptcha,
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
  confirmPassword: '',
  captcha: ''
});

const isLoading = ref(false);
const isSendingCaptcha = ref(false);
const countdown = ref(0);
const errors = ref<FormErrors>({});

let countdownTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 开始倒计时
 */
function startCountdown() {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
}

/**
 * 发送验证码
 */
async function handleSendCaptcha() {
  // 先校验邮箱
  if (!validateEmail(form.email, errors.value)) {
    return;
  }

  try {
    isSendingCaptcha.value = true;
    await userApi.sendCaptcha({ email: form.email });
    startCountdown();
  }
  catch (error: any) {
    errors.value.email = error.message || 'Failed to send verification code';
  }
  finally {
    isSendingCaptcha.value = false;
  }
}

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
      password: form.password,
      captcha: form.captcha
    });
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
          <Field :data-invalid="!!errors.captcha">
            <FieldLabel for="captcha">
              Verification Code
            </FieldLabel>
            <div class="flex gap-2">
              <Input
                id="captcha"
                v-model="form.captcha"
                type="text"
                placeholder="Enter 6-digit code"
                maxlength="6"
                class="flex-1"
                @blur="() => validateCaptcha(form.captcha, errors)"
              />
              <Button
                type="button"
                variant="outline"
                :disabled="isSendingCaptcha || countdown > 0 || !form.email"
                class="shrink-0"
                @click="handleSendCaptcha"
              >
                {{ countdown > 0 ? `${countdown}s` : (isSendingCaptcha ? 'Sending...' : 'Send Code') }}
              </Button>
            </div>
            <FieldError v-if="errors.captcha">
              {{ errors.captcha }}
            </FieldError>
            <FieldDescription>
              Enter the 6-digit code sent to your email. Valid for 5 minutes.
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
