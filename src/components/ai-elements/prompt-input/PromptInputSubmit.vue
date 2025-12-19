<script setup lang="ts">
// import type { InputGroupButtonVariants } from '@/components/ui/input-group'
import type { ChatStatus } from 'ai';
import type { HTMLAttributes } from 'vue';
import { CornerDownLeftIcon, Loader2Icon, SquareIcon, XIcon } from 'lucide-vue-next';
import { computed } from 'vue';
import { InputGroupButton } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

type InputGroupButtonProps = InstanceType<typeof InputGroupButton>['$props'];

interface Props extends /* @vue-ignore */ InputGroupButtonProps {
  class?: HTMLAttributes['class']
  status?: ChatStatus
  variant?: InputGroupButtonProps['variant']
  size?: InputGroupButtonProps['size']
  onStop?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'icon-sm'
});

const emit = defineEmits<{
  stop: []
}>();

const icon = computed(() => {
  if (props.status === 'submitted') {
    return Loader2Icon;
  }
  else if (props.status === 'streaming') {
    return SquareIcon;
  }
  else if (props.status === 'error') {
    return XIcon;
  }
  return CornerDownLeftIcon;
});

const iconClass = computed(() => {
  if (props.status === 'submitted') {
    return 'size-4 animate-spin';
  }
  return 'size-4';
});

const { status, size, variant, class: _, ...restProps } = props;

function handleClick() {
  // 如果正在流式传输，则暂停；否则提交
  if (props.status === 'streaming' || props.status === 'submitted') {
    emit('stop');
  }
}
</script>

<template>
  <InputGroupButton
    aria-label="Submit"
    :class="cn(props.class)"
    :size="size"
    :variant="variant"
    :type="props.status === 'streaming' || props.status === 'submitted' ? 'button' : 'submit'"
    v-bind="restProps"
    @click="handleClick"
  >
    <slot>
      <component :is="icon" :class="iconClass" />
    </slot>
  </InputGroupButton>
</template>
