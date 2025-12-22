<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConversationStore } from '@/stores/modules/conversation';

const route = useRoute();
const router = useRouter();

const conversationStore = useConversationStore();
const { conversations } = storeToRefs(conversationStore);

onMounted(async () => {
  await conversationStore.fetchConversationList();
});

const selectedId = computed(() => {
  return route.params.id as string | null;
});

function handleClick(id: string) {
  router.push({ name: 'chat-detail', params: { id } });
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent class="flex flex-col gap-5">
      <SidebarMenu>
        <SidebarMenuItem v-for="item in conversations" :key="item.id">
          <SidebarMenuButton
            :tooltip="item.title"
            :is-active="selectedId === item.id"
            class="h-10"
            @click="handleClick(item.id)"
          >
            <span class="text-base">{{ item.title }}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
