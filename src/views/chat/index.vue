<script lang="ts">
</script>

<script setup lang="ts">
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar';
import AppSidebar from './components/AppSidebar.vue';
import SiteHeader from './components/SiteHeader.vue';
</script>

<template>
  <SidebarProvider
    :style=" {
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    }"
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div class="flex flex-1 flex-col">
        <div class="@container/main flex flex-1 flex-col gap-2">
          <RouterView />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
