<script setup lang="ts">
import { SelectTrigger as SelectTriggerPrimitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import SafeIcon from '@/components/common/SafeIcon.vue'

defineProps<{
  class?: string
}>()
</script>

<template>
  <SelectTriggerPrimitive
    :class="cn('flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1', $attrs.class)">
    <slot />
    <SafeIcon name="ChevronsUpDown" :size="16" class="opacity-50 shrink-0" />
  </SelectTriggerPrimitive>
</template>
