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
    await conversationStore.deleteConversation(props.conversation.id);
    toast.success('Conversation deleted');
    emit('success');
    emit('update:open', false);
  }
  catch {
    toast.error('Failed to delete, please try again');
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
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{{ conversation?.title }}"? This action cannot be undone and all chat history will be permanently deleted.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" :disabled="isDeleting" @click="handleCancel">
          Cancel
        </Button>
        <Button variant="destructive" :disabled="isDeleting" @click="handleConfirm">
          <Loader2 v-if="isDeleting" class="size-4 animate-spin" />
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
