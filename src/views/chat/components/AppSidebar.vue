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

const router = useRouter();

const userInfo = computed(() => useUserStore().userInfo);

function handleNewConversation() {
  router.push({ name: 'chat-content' });
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="data-[slot=sidebar-menu-button]:p-1.5! flex items-center gap-2">
            <GalleryVerticalEnd class="size-5!" />
            <span class="text-base font-semibold">AIWeb Chat</span>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="conversationList" />
    </SidebarContent>
    <SidebarFooter class="space-y-10">
      <SidebarMenu>
        <SidebarMenuItem>
          <Button class="w-full" @click="handleNewConversation">
            <Plus class="size-4!" />
            New Conversation
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
      <NavUser v-if="userInfo" :user="userInfo" />
    </SidebarFooter>
  </Sidebar>
</template>
