<script setup lang="ts">
import { computed } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{
  name: string;
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  class?: string;
}>();

const iconComponent = computed(() => {
  const icon = (LucideIcons as any)[props.name];
  return icon || LucideIcons.Circle;
});
</script>

<template>
  <component :is="iconComponent" :size="size || 18" :stroke-width="strokeWidth || 2" :color="color || 'currentColor'"
    :class="props.class" />
</template>
