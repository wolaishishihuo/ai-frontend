<script setup lang="ts">
import LoginForm from '@/views/login/components/LoginForm.vue'
import SignupForm from '@/views/login/components/SignupForm.vue'

const isSignup = ref(false)
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <LoginForm v-if="!isSignup" @to-sign-up="isSignup = true" />
      <SignupForm v-else @to-sign-in="isSignup = false" />
    </div>
  </div>
</template>
