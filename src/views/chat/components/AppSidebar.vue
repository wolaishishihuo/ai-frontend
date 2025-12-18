<script setup lang="ts">
import { GalleryVerticalEnd, Plus } from 'lucide-vue-next';
import { useUserStore } from '@/stores/modules/user';
import NavMain from './NavMain.vue';
import NavUser from './NavUser.vue';

const conversationList = ref<any[]>([
  {
    id: '1',
    title: 'Conversation 1',
    messages: []
  }
]);

const selectedConversationId = ref<string | null>('1');

const userInfo = computed(() => useUserStore().userInfo);

function handleSelectConversation(id: string) {
  selectedConversationId.value = id;
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="data-[slot=sidebar-menu-button]:p-1.5! flex items-center gap-2">
            <GalleryVerticalEnd class="size-5!" />
            <span class="text-base font-semibold">AI Chat</span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain
        :items="conversationList"
        :selected-id="selectedConversationId"
        @select="handleSelectConversation"
      />
    </SidebarContent>
    <SidebarFooter class="space-y-10">
      <SidebarMenu>
        <SidebarMenuItem>
          <Button class="w-full">
            <Plus class="size-4!" />
            New Conversation
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
      <NavUser v-if="userInfo" :user="userInfo" />
    </SidebarFooter>
  </Sidebar>
</template>
