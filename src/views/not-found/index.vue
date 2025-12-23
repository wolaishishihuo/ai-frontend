<script setup lang="ts">
import { Button } from '@/components/ui/button';

const router = useRouter();

function goHome() {
  router.push('/');
}

function goBack() {
  router.back();
}
</script>

<template>
  <div class="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
    <div class="flex flex-col items-center gap-8 text-center">
      <!-- 404 数字动画 -->
      <div class="relative">
        <span class="text-[10rem] font-bold leading-none text-muted-foreground/10 md:text-[14rem]">
          404
        </span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <div class="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <div class="h-3 w-3 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <!-- 文案 -->
      <div class="space-y-3">
        <h1 class="text-2xl font-semibold tracking-tight md:text-3xl">
          页面走丢了
        </h1>
        <p class="max-w-md text-muted-foreground">
          抱歉，您访问的页面不存在或已被移除。请检查链接是否正确，或返回首页继续探索。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <Button variant="default" size="lg" @click="goHome">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          返回首页
        </Button>
        <Button variant="outline" size="lg" @click="goBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          返回上页
        </Button>
      </div>

      <!-- AI 风格装饰 -->
      <div class="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
        <span>AI 助手正在待命中...</span>
      </div>
    </div>
  </div>
</template>
