<script setup lang="ts">
import type { Conversation } from '@/api/types/conversation';
import { MoreHorizontal, Trash2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useConversationStore } from '@/stores/modules/conversation';
import DeleteConversationDialog from './DeleteConversationDialog.vue';

const route = useRoute();
const router = useRouter();

const conversationStore = useConversationStore();
const { conversations } = storeToRefs(conversationStore);

// 删除对话框状态
const deleteDialogOpen = ref(false);
const conversationToDelete = ref<Conversation | null>(null);

onMounted(async () => {
  await conversationStore.fetchConversationList();
});

const selectedId = computed(() => {
  return route.params.id as string | null;
});

function handleClick(id: string) {
  router.push({ name: 'chat-detail', params: { id } });
}

// 打开删除确认对话框
function handleDeleteClick(conversation: Conversation, event: Event) {
  event.stopPropagation();
  conversationToDelete.value = conversation;
  deleteDialogOpen.value = true;
}

// 删除成功回调
function handleDeleteSuccess() {
  // 如果删除的是当前正在查看的会话，跳转到 chat-content 页面
  if (conversationToDelete.value && selectedId.value === conversationToDelete.value.id) {
    router.push({ name: 'chat-content' });
  }

  deleteDialogOpen.value = false;
  conversationToDelete.value = null;
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
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuAction show-on-hover>
                <MoreHorizontal class="size-4" />
                <span class="sr-only">更多操作</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem
                class="text-destructive focus:text-destructive"
                @click="handleDeleteClick(item, $event)"
              >
                <Trash2 class="mr-2 size-4" />
                删除会话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <!-- 删除确认对话框 -->
  <DeleteConversationDialog
    v-model:open="deleteDialogOpen"
    :conversation="conversationToDelete"
    @success="handleDeleteSuccess"
  />
</template>
