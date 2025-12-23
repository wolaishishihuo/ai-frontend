<script setup lang="ts">
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/modules/user';
import SiteHeader from './layout/SiteHeader.vue';
import AppSidebar from './sidebar/AppSidebar.vue';

const { getUserInfo } = useUserStore();

const isPageReady = ref(false);

onMounted(async () => {
  await getUserInfo();
  isPageReady.value = true;
});
</script>

<template>
  <SidebarProvider
    class="h-svh! min-h-0!"
    :style=" {
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <Transition name="slide-right">
      <AppSidebar v-show="isPageReady" variant="inset" />
    </Transition>
    <SidebarInset class="overflow-hidden">
      <Transition name="fade-up">
        <div v-show="isPageReady" class="flex h-full flex-col">
          <SiteHeader />
          <div class="min-h-0 flex-1">
            <RouterView />
          </div>
        </div>
      </Transition>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
/* 侧边栏从左滑入 */
.slide-right-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-right-leave-active {
  transition: all 0.3s ease-in;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* 主内容区淡入上移 */
.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.15s;
}
.fade-up-leave-active {
  transition: all 0.3s ease-in;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
