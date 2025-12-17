<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import LoginForm from '@/views/login/components/LoginForm.vue'
import SignupForm from '@/views/login/components/SignupForm.vue'

const isSignup = computed(() => useUserStore().isSignup)
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <LoginForm v-if="!isSignup" />
      <SignupForm v-else />
    </div>
  </div>
</template>
