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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
const isSubmitting = ref(false);
const title = ref('');

// 当对话框打开时，初始化标题
watch(() => props.open, (open) => {
  if (open && props.conversation) {
    title.value = props.conversation.title;
  }
});

async function handleConfirm() {
  if (!props.conversation || !title.value.trim())
    return;

  isSubmitting.value = true;
  try {
    await conversationStore.updateConversation(props.conversation.id, { title: title.value.trim() });
    toast.success('Conversation updated');
    emit('success');
    emit('update:open', false);
  }
  catch {
    toast.error('Failed to update, please try again');
  }
  finally {
    isSubmitting.value = false;
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
        <DialogTitle>Edit Conversation</DialogTitle>
        <DialogDescription>
          Modify conversation title
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <Label for="title" class="mb-2 block">Title</Label>
        <Input
          id="title"
          v-model="title"
          placeholder="Enter conversation title"
          :disabled="isSubmitting"
          @keyup.enter="handleConfirm"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" :disabled="isSubmitting" @click="handleCancel">
          Cancel
        </Button>
        <Button :disabled="isSubmitting || !title.trim()" @click="handleConfirm">
          <Loader2 v-if="isSubmitting" class="size-4 animate-spin" />
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
