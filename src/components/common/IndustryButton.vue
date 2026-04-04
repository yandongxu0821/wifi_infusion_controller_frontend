<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import SafeIcon from '@/components/common/SafeIcon.vue';
import { cn } from '@/lib/utils';

interface IndustryButtonProps {
  variant?: 'primary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  class?: string;
}

const props = withDefaults(defineProps<IndustryButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-[hsl(var(--success))] text-white border-[hsl(var(--success))] hover:brightness-110 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_2px_0_hsl(var(--success)/0.5)]';
    case 'warning':
      return 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] border-[hsl(var(--warning))] hover:brightness-110 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_2px_0_hsl(var(--warning)/0.5)]';
    case 'destructive':
      return 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_2px_0_hsl(var(--destructive)/0.5)]';
    case 'outline':
      return 'bg-transparent text-foreground border-border hover:bg-muted active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]';
    case 'primary':
    default:
      return 'bg-primary text-primary-foreground border-primary hover:bg-[hsl(var(--primary-hover))] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] shadow-[0_2px_0_hsl(var(--primary)/0.5)]';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs h-8';
    case 'lg':
      return 'px-6 py-3 text-base h-12';
    case 'md':
    default:
      return 'px-4 py-2 text-sm h-10';
  }
});

const buttonClasses = computed(() =>
  cn(
    'industry-button relative inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider',
    'transition-all duration-100 flex-shrink-0',
    'active:translate-y-[1px]',
    variantClasses.value,
    sizeClasses.value,
    (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed pointer-events-none translate-y-0 shadow-none',
    props.class
  )
);
</script>

<template>
  <button :type="'button'" :class="buttonClasses" :disabled="disabled || loading">
    <!-- Loading Spinner -->
    <Loader2 v-if="loading" class="animate-spin" :size="size === 'sm' ? 14 : 18" />

    <!-- Prefix Icon -->
    <SafeIcon v-else-if="icon" :name="icon" :size="size === 'sm' ? 14 : 18" :stroke-width="2.5" />

    <!-- Label -->
    <span class="relative">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.industry-button {
  /* 工业风格的厚度感模拟 */
  border-bottom-width: 3px;
}

.industry-button:active {
  border-bottom-width: 1px;
  margin-top: 2px;
}
</style>
