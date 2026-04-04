<script setup lang="ts">
import { Button } from '@/components/ui/button';
import SafeIcon from '@/components/common/SafeIcon.vue';

interface Props {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  backUrl: './monitoring-dashboard.html'
});

const handleBack = () => {
  window.location.href = props.backUrl;
};
</script>

<template>
  <header class="h-16 shrink-0 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
    <div class="h-full px-6 flex items-center justify-between">
      <!-- Left: Logo & Title -->
      <div class="flex items-center gap-4">
        <template v-if="showBackButton">
          <Button variant="ghost" size="icon" class="hover:bg-muted" @click="handleBack">
            <SafeIcon name="ArrowLeft" :size="20" />
          </Button>
        </template>

        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(168,65,48,0.3)]">
            <SafeIcon name="Activity" :size="20" class="text-primary-foreground" />
          </div>
          <h1 class="text-page-title text-xl tracking-wider">
            {{ title }}
          </h1>
        </div>
      </div>

      <!-- Right: Actions Slot -->
      <div class="flex items-center gap-4">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.5);
}
</style>
