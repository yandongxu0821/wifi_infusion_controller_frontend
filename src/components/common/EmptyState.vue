<script setup lang="ts">
import SafeIcon from '@/components/common/SafeIcon.vue';

interface EmptyStateProps {
  /**
   * 图标名称 (Lucide 图标库中的 PascalCase 名称)
   * @default "Inbox"
   */
  icon?: string;
  /**
   * 标题文字
   */
  message: string;
  /**
   * 详细描述文字
   */
  description?: string;
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  icon: 'Inbox',
});
</script>

<template>
  <div class="empty-state w-full h-full flex flex-col items-center justify-center text-center">
    <div class="mb-6 p-6 rounded-full bg-muted/20 border border-border/50">
      <SafeIcon :name="props.icon" :size="48" :stroke-width="1.5" class="text-muted-foreground opacity-60" />
    </div>

    <div class="max-w-md space-y-2">
      <h3 class="text-lg font-semibold text-foreground">
        {{ props.message }}
      </h3>

      <p v-if="props.description" class="text-sm text-muted-foreground leading-relaxed">
        {{ props.description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  /* 确保在父容器中居中，并至少有 300px 高度 */
  min-height: 300px;
}
</style>
