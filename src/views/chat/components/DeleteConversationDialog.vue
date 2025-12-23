<script setup lang="ts">
import type { Conversation } from '@/api/types/conversation';
import { Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useConversationStore } from '@/stores/modules/conversation';

interface Props {
  open: boolean
  conversation: Conversation | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const conversationStore = useConversationStore();
const isDeleting = ref(false);

async function handleConfirm() {
  if (!props.conversation)
    return;

  isDeleting.value = true;
  try {
    const success = await conversationStore.deleteConversation(props.conversation.id);
    if (success) {
      toast.success('会话已删除');
      emit('success');
      emit('update:open', false);
    }
    else {
      toast.error('删除失败，请重试');
    }
  }
  finally {
    isDeleting.value = false;
  }
}

function handleCancel() {
  emit('update:open', false);
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>删除会话</DialogTitle>
        <DialogDescription>
          确定要删除会话 "{{ conversation?.title }}" 吗？此操作无法撤销，所有聊天记录将被永久删除。
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" :disabled="isDeleting" @click="handleCancel">
          取消
        </Button>
        <Button variant="destructive" :disabled="isDeleting" @click="handleConfirm">
          <Loader2 v-if="isDeleting" class="size-4 animate-spin" />
          {{ isDeleting ? '删除中...' : '删除' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
