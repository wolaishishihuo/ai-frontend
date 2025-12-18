<script setup lang="ts">
import { GalleryVerticalEnd } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/modules/user';
import NavMain from './NavMain.vue';
import NavUser from './NavUser.vue';

const data = {
  navMain: [
    {
      title: 'Chat'
    }
  ]

};

const userInfo = computed(() => useUserStore().userInfo);
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            class="data-[slot=sidebar-menu-button]:p-1.5!"
          >
            <a href="#">
              <GalleryVerticalEnd class="size-5!" />
              <span class="text-base font-semibold">AI Chat</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser v-if="userInfo" :user="userInfo" />
    </SidebarFooter>
  </Sidebar>
</template>
