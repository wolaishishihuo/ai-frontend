<script setup lang="ts">
import type { Conversation } from '@/api/types/conversation';
import { MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { formatRelativeTime } from '@/lib/utils';
import { useConversationStore } from '@/stores/modules/conversation';
import DeleteConversationDialog from '../dialogs/DeleteConversationDialog.vue';
import EditConversationDialog from '../dialogs/EditConversationDialog.vue';

const route = useRoute();
const router = useRouter();

const conversationStore = useConversationStore();
const { conversations } = storeToRefs(conversationStore);

// 搜索关键词
const searchQuery = ref('');

// 过滤后的对话列表
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return conversations.value;
  }

  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter(conv =>
    conv.title.toLowerCase().includes(query)
    || conv.description?.toLowerCase().includes(query)
  );
});

// 删除对话框状态
const deleteDialogOpen = ref(false);
const conversationToDelete = ref<Conversation | null>(null);

// 编辑对话框状态
const editDialogOpen = ref(false);
const conversationToEdit = ref<Conversation | null>(null);

onMounted(async () => {
  await conversationStore.fetchConversationList();
});

const selectedId = computed(() => route.params.id as string | null);

function handleClick(id: string) {
  router.push({ name: 'chat-detail', params: { id } });
}

// 打开删除确认对话框
function handleDeleteClick(conversation: Conversation, event: Event) {
  event.stopPropagation();
  conversationToDelete.value = conversation;
  deleteDialogOpen.value = true;
}

// 打开编辑对话框
function handleEditClick(conversation: Conversation, event: Event) {
  event.stopPropagation();
  conversationToEdit.value = conversation;
  editDialogOpen.value = true;
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

// 编辑成功回调
function handleEditSuccess() {
  editDialogOpen.value = false;
  conversationToEdit.value = null;
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent class="flex flex-col gap-5">
      <!-- 搜索框 -->
      <div class="px-2">
        <div class="relative">
          <Search class="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="搜索对话..."
            class="h-9 pl-8 pr-3"
          />
        </div>
      </div>

      <!-- 对话列表 -->
      <SidebarMenu>
        <template v-if="filteredConversations.length > 0">
          <SidebarMenuItem
            v-for="item in filteredConversations"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <SidebarMenuButton
              :tooltip="item.title"
              :is-active="selectedId === item.id"
              class="h-auto flex-1 flex-col items-start gap-1 py-2"
              @click="handleClick(item.id)"
            >
              <span class="text-base line-clamp-1 w-full text-left">{{ item.title }}</span>
              <span class="text-xs text-muted-foreground">
                {{ formatRelativeTime(item.updatedAt) }}
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuAction show-on-hover class="h-[70%]! cursor-pointer">
                  <MoreHorizontal class="size-4" />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem @click="handleEditClick(item, $event)">
                  <Pencil class="mr-2 size-4" />
                  <span>Edit Conversation</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="text-destructive focus:text-destructive"
                  @click="handleDeleteClick(item, $event)"
                >
                  <Trash2 class="mr-2 size-4" />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </template>
        <template v-else>
          <div class="px-2 py-8 text-center text-sm text-muted-foreground">
            {{ searchQuery ? '未找到匹配的对话' : '暂无对话' }}
          </div>
        </template>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  <!-- 删除确认对话框 -->
  <DeleteConversationDialog
    v-model:open="deleteDialogOpen"
    :conversation="conversationToDelete"
    @success="handleDeleteSuccess"
  />

  <!-- 编辑对话框 -->
  <EditConversationDialog
    v-model:open="editDialogOpen"
    :conversation="conversationToEdit"
    @success="handleEditSuccess"
  />
</template>
